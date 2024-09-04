package controller

import (
	"fmt"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/shereifsrf/SaveTask-SRF/user-api/controller/middleware"
	"github.com/shereifsrf/SaveTask-SRF/user-api/dao/model"
	"github.com/shereifsrf/SaveTask-SRF/user-api/dao/service"
)

type userController struct {
	us service.IUser
	js service.IJwt
}

func SetupUserController(router *gin.RouterGroup) {
	c := &userController{
		us: service.NewUserService(),
		js: service.NewJwtService(),
	}
	router.POST("", c.addUser)

	router.Use(middleware.AuthMiddleware(c.js))
	{
		router.GET("", c.listUser)
		router.GET(":id", c.getUser)
		router.PUT(":id", c.updateUser)
		router.DELETE(":id", c.deleteUser)
	}
}

func (c *userController) listUser(ctx *gin.Context) {
	users, err := c.us.List()
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(200, users)
}

func (c *userController) getUser(ctx *gin.Context) {
	user, err := c.getUserBy(ctx, nil, nil)
	if err != nil {
		message := fmt.Sprintf("User not found, %v", err.Error())
		ctx.JSON(500, gin.H{"error": message})
		return
	}

	ctx.JSON(200, user)
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
			ctx.JSON(400, gin.H{"error": "Invalid ID"})
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

func (c *userController) addUser(ctx *gin.Context) {
	var user model.User
	err := ctx.BindJSON(&user)
	if err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// check if the user exist
	exUser, err := c.getUserBy(ctx, nil, &user.Username)
	if err == nil {
		message := fmt.Sprint("User with username ", exUser.Username, " already exist")
		ctx.JSON(400, gin.H{"error": message})
		return
	}

	user.IsActive = true

	user, err = c.us.Add(user)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
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
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	exUser, err := c.getUserBy(ctx, nil, nil)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "User not found"})
		return
	}

	if user.Username != "" {
		exUser.Username = user.Username
	}
	if user.Password != "" {
		exUser.Password = user.Password
	}
	exUser.IsActive = user.IsActive

	user, err = c.us.Update(exUser)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, exUser)
}

func (c *userController) deleteUser(ctx *gin.Context) {
	id := ctx.Param("id")
	idUint, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid ID"})
		return
	}

	err = c.us.Delete(idUint)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{})
}
