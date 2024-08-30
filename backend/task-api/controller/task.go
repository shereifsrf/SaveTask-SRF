package controller

import (
	"fmt"
	"shereifsrf/SaveTask-SRF/task-api/dao/model"
	"shereifsrf/SaveTask-SRF/task-api/dao/service"
	"time"

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
	router.GET(":id", controller.getTask)
	router.POST("", controller.addTask)
	router.PUT(":id", controller.updateTask)
	router.DELETE(":id", controller.deleteTask)
}

func (t *taskController) listTask(c *gin.Context) {
	var query model.ListTaskQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
	}

	if query.Limit == 0 {
		query.Limit = 10
	}
	query.Page += 1

	tasks, err := t.ts.ListTask(c, query)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, tasks)
}

func (t *taskController) getTask(c *gin.Context) {
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

	task, err := t.ts.GetTask(c, taskID)
	if err != nil {
		c.JSON(404, gin.H{"error": fmt.Sprintf("task with id %s not found, err: %v", id, err.Error())})
		return
	}

	c.JSON(200, task)
}

func (t *taskController) addTask(c *gin.Context) {
	var task model.Task
	if err := c.ShouldBindJSON(&task); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	if task.ID == nil {
		id := primitive.NewObjectID()
		task.ID = &id
	}
	// add order as timestamp
	task.Order = float64(time.Now().Unix())
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

	oldTask, err := t.ts.GetTask(c, *task.ID)
	if err != nil {
		c.JSON(404, gin.H{"error": fmt.Sprintf("task with id %s not found, err: %v", id, err.Error())})
		return
	}

	// if status is changed, then update order
	if task.Status != oldTask.Status {
		task.Order = float64(time.Now().Unix())
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
