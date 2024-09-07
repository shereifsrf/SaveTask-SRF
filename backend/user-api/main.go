package main

import (
	"os"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/shereifsrf/SaveTask-SRF/user-api/common"
	"github.com/shereifsrf/SaveTask-SRF/user-api/controller"
	"github.com/shereifsrf/SaveTask-SRF/user-api/dao"
	"github.com/shereifsrf/SaveTask-SRF/user-api/dao/service"
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

	var allowOrigins []string
	if gin.IsDebugging() {
		extraOrigins := os.Getenv("ALLOW_ORIGINS")
		extraOriginsSlice := strings.Split(extraOrigins, ",")
		allowOrigins = append(allowOrigins, extraOriginsSlice...)
		// print the extra origins
		for _, origin := range allowOrigins {
			common.Log.Printf("Extra origin: %v", origin)
		}
	}

	if len(allowOrigins) != 0 {
		r.Use(cors.New(cors.Config{
			AllowOrigins:     allowOrigins,
			AllowMethods:     []string{"GET"},
			AllowHeaders:     []string{"Origin", common.Authorization},
			ExposeHeaders:    []string{"Content-Length"},
			AllowCredentials: true,
			MaxAge:           12 * time.Hour,
		}))
	}

	api := r.Group("/api")

	userService := service.NewUserService()
	authService := service.NewAuthService(userService)

	controller.SetupUserController(api.Group("/user"), userService, authService)
	controller.SetupAuthController(api.Group("/auth"), userService, authService)

	return r
}

func setupModules(isDebug bool) {
	common.InitLogger()
	common.InitEnv(isDebug)

	dao.Init()
}
