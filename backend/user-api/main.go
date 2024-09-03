package main

import (
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/shereifsrf/SaveTask-SRF/user-api/common"
	"github.com/shereifsrf/SaveTask-SRF/user-api/controller"
	"github.com/shereifsrf/SaveTask-SRF/user-api/dao"
)

func main() {
	isDebug := gin.IsDebugging()
	setupModules(isDebug)

	r := setupRoutes()
	common.Log.Printf("Server is running at %v", common.GetEnv("PORT", true))

	r.Run()
}

func setupRoutes() *gin.Engine {
	gin.SetMode(common.Env.GIN_MODE)
	r := gin.Default()

	allowOrigins := []string{"http://localhost:3000", "http://localhost:3001"}
	if gin.IsDebugging() {
		extraOrigins := common.Env.ALLOW_ORIGINS
		extraOriginsSlice := strings.Split(extraOrigins, ",")
		allowOrigins = append(allowOrigins, extraOriginsSlice...)
	}

	r.Use(cors.New(cors.Config{
		AllowOrigins:     allowOrigins,
		AllowMethods:     []string{"GET"},
		AllowHeaders:     []string{"Origin", "ADMIN_PASS_MUST_REMOVE"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	api := r.Group("/api")
	// api.Use(middleware.TokenMiddleware())
	controller.SetupUserController(api.Group("/user"))

	return r
}

func setupModules(isDebug bool) {
	common.InitLogger()
	common.InitEnv(isDebug)

	dao.Init()
}
