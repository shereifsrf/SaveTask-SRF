package common

import (
	"os"

	"github.com/joho/godotenv"
)

var Env Environment

type Environment struct {
	GIN_MODE string

	MONGO_DB_HOST string
	MONGO_DB_PORT string
	MONGO_DB_USER string
	MONGO_DB_PASS string
	MONGO_DB_NAME string

	USER_API_URL string
}

func InitEnv(isDebug bool) {
	if isDebug {
		err := godotenv.Load("config/.env")
		if err != nil {
			Log.Fatal("Error loading .env file")
		}
	}

	Env.MONGO_DB_HOST = GetEnv(MONGO_DB_HOST, true)
	Env.MONGO_DB_PORT = GetEnv(MONGO_DB_PORT, true)
	Env.MONGO_DB_USER = GetEnv(MONGO_DB_USER, true)
	Env.MONGO_DB_PASS = GetEnv(MONGO_DB_PASS, true)
	Env.MONGO_DB_NAME = GetEnv(MONGO_DB_NAME, true)
	Env.GIN_MODE = GetEnv(GIN_MODE, false)
	if Env.GIN_MODE != RELEASE {
		Env.GIN_MODE = DEBUG
	}
	Env.USER_API_URL = GetEnv(USER_API_URL, true)
}

func GetEnv(key string, required bool) string {
	value, exist := os.LookupEnv(key)
	if !exist && required {
		Log.Fatalf("Error loading env %v", key)
	}
	return value
}
