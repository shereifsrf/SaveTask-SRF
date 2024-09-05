package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/shereifsrf/SaveTask-SRF/user-api/dao/model"
	"github.com/shereifsrf/SaveTask-SRF/user-api/dao/service"
)

type authController struct {
	us service.IUser
	js service.IJwt
}

func SetupAuthController(router *gin.RouterGroup, us service.IUser, js service.IJwt) {
	c := &authController{
		us: us,
		js: js,
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

	if ul.Password != user.Password {
		ctx.JSON(400, gin.H{"error": "Invalid password"})
		return
	}

	token, err := c.js.GenerateToken(user.Username)
	if err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"token": token})
}
