package main

import (
	"shereifsrf/SaveTask-SRF/task-api/common"
	"shereifsrf/SaveTask-SRF/task-api/controller"
	"shereifsrf/SaveTask-SRF/task-api/dao"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	isDebug := gin.IsDebugging()

	setupModules(isDebug)
	defer unSetupModules()

	r := setupRoutes()

	r.Run(":8080")
}

func setupRoutes() *gin.Engine {
	gin.SetMode(common.Env.GIN_MODE)
	r := gin.Default()
	r.SetTrustedProxies([]string{"localhost"})
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET"},
		AllowHeaders:     []string{"Origin"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

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
