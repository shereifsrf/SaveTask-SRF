package common

import (
	logger "log"
	"os"
)

var Log *logger.Logger

func InitLogger() {
	Log = logger.New(os.Stdout, "INFO: ", logger.Ldate|logger.Ltime|logger.Lshortfile)

	Log.Println("Logger is initialized")
}