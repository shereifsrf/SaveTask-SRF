package controller

import (
	"github.com/gin-gonic/gin"
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
}

func (c *authController) login(ctx *gin.Context) {
	var ul model.UserLogin
	if err := ctx.ShouldBindJSON(&ul); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	user, err := c.us.Get(0, &ul.Username)
	if err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if !c.auth.VerifyPassword(ul.Password, user.Password, user.PasswordSalt) {
		ctx.JSON(400, gin.H{"error": "Invalid username or password"})
		return
	}

	token, err := c.auth.GenerateToken(user.Username)
	if err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"token": token})
}
