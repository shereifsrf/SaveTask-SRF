package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/shereifsrf/SaveTask-SRF/user-api/common"
	"github.com/shereifsrf/SaveTask-SRF/user-api/controller/middleware"
	"github.com/shereifsrf/SaveTask-SRF/user-api/dao/model"
	"github.com/shereifsrf/SaveTask-SRF/user-api/dao/service"
)

type authController struct {
	us   service.IUser
	auth service.IAuth
}

func SetupAuthController(router *gin.RouterGroup, us service.IUser, auth service.IAuth) {
	c := &authController{
		us:   us,
		auth: auth,
	}
	router.POST("/login", c.login)
	router.GET("/verify", middleware.AuthMiddleware(auth, true, false), c.verify)
}

func (c *authController) login(ctx *gin.Context) {
	var ul model.UserLogin
	if err := ctx.ShouldBindJSON(&ul); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	user, err := c.us.Get(nil, &ul.Username)
	if err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if !c.auth.VerifyPassword(ul.Password, user.Password, user.PasswordSalt) {
		ctx.JSON(400, gin.H{"error": "Invalid username or password"})
		return
	}

	token, err := c.auth.GenerateToken(*user)
	if err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"token": token})
}

func (c *authController) verify(ctx *gin.Context) {
	lgdUser, ok := ctx.Get(common.UserData)
	if !ok {
		ctx.JSON(400, gin.H{"error": "User not found"})
		return
	}

	user, ok := lgdUser.(*model.User)
	if !ok {
		ctx.JSON(400, gin.H{"error": "User model not valid"})
		return
	}

	ctx.JSON(200, gin.H{"id": user.ID, "role": user.Role})
}
