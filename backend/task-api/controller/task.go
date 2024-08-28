package controller

import (
	"shereifsrf/SaveTask-SRF/task-api/dao/model"
	"shereifsrf/SaveTask-SRF/task-api/dao/service"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type taskController struct {
	ts service.ITask
}

func SetupTaskController(router *gin.RouterGroup) {
	controller := &taskController{
		ts: service.NewTaskService(),
	}
	router.GET("", controller.listTask)
	router.POST("", controller.addTask)
	router.PUT(":id", controller.updateTask)
	router.DELETE(":id", controller.deleteTask)
}

func (t *taskController) listTask(c *gin.Context) {
	tasks, err := t.ts.ListTask(c)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, tasks)
}

func (t *taskController) addTask(c *gin.Context) {
	var task model.Task
	if err := c.ShouldBindJSON(&task); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	err := t.ts.AddTask(c, task)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, task)
}

func (t *taskController) updateTask(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(400, gin.H{"error": "id is required"})
		return
	}

	var task model.Task
	if err := c.ShouldBindJSON(&task); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	taskID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	task.ID = &taskID

	err = t.ts.UpdateTask(c, task)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, task)
}

func (t *taskController) deleteTask(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(400, gin.H{"error": "id is required"})
		return
	}

	taskID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	err = t.ts.DeleteTask(c, taskID)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "task deleted"})
}
