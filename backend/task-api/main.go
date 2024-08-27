package main

import (
	"shereifsrf/SaveTask-SRF/task-api/common"
	"shereifsrf/SaveTask-SRF/task-api/dao"

	"github.com/gin-gonic/gin"
)

func main() {
	isDebug := gin.IsDebugging()

	setupModules(isDebug)
	defer unSetupModules()
}

func setupModules(isDebug bool) {
	common.InitLogger()
	common.InitEnv(isDebug)

	dao.InitMongoDB()
}

func unSetupModules() {
	dao.CloseMongoDB()
}