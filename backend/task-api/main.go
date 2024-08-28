package main

import (
	"shereifsrf/SaveTask-SRF/task-api/common"
	"shereifsrf/SaveTask-SRF/task-api/controller"
	"shereifsrf/SaveTask-SRF/task-api/dao"

	"github.com/gin-gonic/gin"
)

func main() {
	isDebug := gin.IsDebugging()

	setupModules(isDebug)
	defer unSetupModules()

	r := setupRoutes()
	r.SetTrustedProxies([]string{"localhost"})

	r.Run(":8080")
}

func setupRoutes() *gin.Engine {
	gin.SetMode(common.Env.GIN_MODE)
	r := gin.Default()

	api := r.Group("/api")
	controller.SetupTaskController(api.Group("/task"))

	return r
}

func setupModules(isDebug bool) {
	common.InitLogger()
	common.InitEnv(isDebug)

	dao.InitMongoDB()
}

func unSetupModules() {
	dao.CloseMongoDB()
}