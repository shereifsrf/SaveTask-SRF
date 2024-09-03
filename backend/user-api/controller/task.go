package controller

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/shereifsrf/SaveTask-SRF/user-api/dao/model"
	"github.com/shereifsrf/SaveTask-SRF/user-api/dao/service"
)

type userController struct {
	us service.IUser
}

func SetupTaskController(router *gin.RouterGroup) {
	controller := &userController{
		us: service.NewUserService(),
	}
	router.GET("", controller.listUser)
	router.GET(":id", controller.getUser)
	router.POST("", controller.addUser)
	router.PUT(":id", controller.updateUser)
	router.DELETE(":id", controller.deleteUser)
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
	id := ctx.Param("id")
	idUint, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid ID"})
		return
	}

	user, err := c.us.Get(idUint)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, user)
}

func (c *userController) addUser(ctx *gin.Context) {
	var user model.User
	err := ctx.BindJSON(&user)
	if err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	user, err = c.us.Add(user)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, user)
}

func (c *userController) updateUser(ctx *gin.Context) {
	id := ctx.Param("id")
	idUint, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid ID"})
		return
	}

	var user model.User
	err = ctx.BindJSON(&user)
	if err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	user, err = c.us.Update(idUint, user)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, user)
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
