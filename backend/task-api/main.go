package main

import (
	"os"
	"shereifsrf/SaveTask-SRF/task-api/common"
	"shereifsrf/SaveTask-SRF/task-api/controller"
	"shereifsrf/SaveTask-SRF/task-api/dao"
	"shereifsrf/SaveTask-SRF/task-api/dao/service"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	isDebug := gin.IsDebugging()

	setupModules(isDebug)
	defer unSetupModules()

	r := setupRoutes()
	common.Log.Printf("Server is running at %v", common.GetEnv("PORT", true))

	r.SetTrustedProxies([]string{"localhost"})
	r.Run()
}

func setupRoutes() *gin.Engine {
	gin.SetMode(common.Env.GIN_MODE)
	r := gin.Default()

	allowOrigins := []string{"http://localhost:3000", "http://localhost:3001"}
	if gin.IsDebugging() {
		extraOrigins := os.Getenv("ALLOW_ORIGINS")
		extraOriginsSlice := strings.Split(extraOrigins, ",")
		allowOrigins = append(allowOrigins, extraOriginsSlice...)
	}

	r.Use(cors.New(cors.Config{
		AllowOrigins:     allowOrigins,
		AllowMethods:     []string{"GET"},
		AllowHeaders:     []string{"Origin"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	userApiService := service.NewUserApiService()

	api := r.Group("/api")
	controller.SetupTaskController(api.Group("/task"), userApiService)

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
