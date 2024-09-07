package controller

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/shereifsrf/SaveTask-SRF/user-api/common"
	"github.com/shereifsrf/SaveTask-SRF/user-api/controller/middleware"
	"github.com/shereifsrf/SaveTask-SRF/user-api/dao/model"
	"github.com/shereifsrf/SaveTask-SRF/user-api/dao/service"
)

type userController struct {
	us   service.IUser
	auth service.IAuth
}

func SetupUserController(router *gin.RouterGroup, us service.IUser, auth service.IAuth) {
	c := &userController{
		us:   us,
		auth: auth,
	}
	router.POST("", middleware.AuthMiddleware(nil, false, true), c.addUser)

	router.Use(middleware.AuthMiddleware(auth, true, true))
	{
		router.GET("", c.listUser)
		router.GET(":id", c.getUser)
		router.PUT(":id", c.updateUser)
		router.DELETE(":id", c.deleteUser)
	}
}

func (c *userController) authorize(ctx *gin.Context, roles []model.Role, id *uint64) (*model.User, bool) {
	logged, exists := ctx.Get(common.UserData)
	if !exists {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": common.WithFnName("User not found")})
		return nil, false
	}

	loggedUser, ok := logged.(*model.User)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": common.WithFnName("User model not valid")})
		return nil, false
	}

	if loggedUser.Role == model.Role_ADMIN {
		return loggedUser, true
	}

	if len(roles) > 0 && !common.ContainsString(roles, model.Role(loggedUser.Role)) {
		ctx.JSON(http.StatusForbidden, gin.H{"error": common.WithFnName("Forbidden for user")})
		return nil, false
	}

	if id != nil && *id != loggedUser.ID {
		ctx.JSON(http.StatusForbidden, gin.H{"error": common.WithFnName("Forbidden for user")})
		return nil, false
	}

	return loggedUser, true
}

func (c *userController) getUserBy(ctx *gin.Context, id *uint64, username *string) (*model.User, error) {
	var (
		userId uint64
		user   *model.User
		err    error
	)
	if username == nil && id == nil {
		paramId := ctx.Param("id")
		userId, err = strconv.ParseUint(paramId, 10, 64)
		if err != nil {
			return nil, err
		}
	}

	if username != nil {
		user, err = c.us.Get(0, username)
	} else {
		user, err = c.us.Get(userId, nil)
	}
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (c *userController) listUser(ctx *gin.Context) {
	_, ok := c.authorize(ctx, []model.Role{model.Role_ADMIN}, nil)
	if !ok {
		return
	}

	users, err := c.us.List()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(200, users)
}

func (c *userController) getUser(ctx *gin.Context) {
	user, err := c.getUserBy(ctx, nil, nil)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, ok := c.authorize(ctx, []model.Role{model.Role_USER}, &user.ID)
	if !ok {
		return
	}

	ctx.JSON(200, user)
}

func (c *userController) addUser(ctx *gin.Context) {
	var user model.User
	err := ctx.BindJSON(&user)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// check if the user exist
	exUser, _ := c.getUserBy(ctx, nil, &user.Username)
	if exUser != nil {
		message := fmt.Sprintf("User with username: %s, already exist, err: %v", user.Username, err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": message})
		return
	}

	role := model.Role_USER
	lgdUser, ok := c.authorize(ctx, []model.Role{model.Role_ADMIN}, nil)
	if ok && lgdUser.Role == user.Role {
		role = lgdUser.Role
	}
	user.Role = role

	hash, salt, err := c.auth.GenerateHashSalt(user.Password, nil)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	user.Password = hash
	user.PasswordSalt = salt

	user.IsActive = true
	user, err = c.us.Add(user)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, user)
}

func (c *userController) updateUser(ctx *gin.Context) {
	var (
		user *model.User
		err  error
	)

	err = ctx.BindJSON(&user)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	exUser, err := c.getUserBy(ctx, nil, nil)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, ok := c.authorize(ctx, []model.Role{model.Role_USER}, &user.ID)
	if !ok {
		return
	}

	if user.Username != "" {
		exUser.Username = user.Username
	}
	if user.Password != "" {
		hash, salt, err := c.auth.GenerateHashSalt(user.Password, nil)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		exUser.Password = hash
		exUser.PasswordSalt = salt
	}
	exUser.IsActive = user.IsActive

	user, err = c.us.Update(exUser)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, exUser)
}

func (c *userController) deleteUser(ctx *gin.Context) {
	exUser, err := c.getUserBy(ctx, nil, nil)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, ok := c.authorize(ctx, []model.Role{model.Role_USER}, &exUser.ID)
	if !ok {
		return
	}

	if !exUser.IsActive {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "User already deleted"})
		return
	}

	err = c.us.Delete(exUser.ID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{})
}
