package common

import (
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

var Env Environment

type Environment struct {
	GIN_MODE      string
	PORT          string
	ALLOW_ORIGINS string

	DB_HOST string
	DB_PORT string
	DB_USER string
	DB_PASS string
	DB_NAME string

	JWT_SECRET   string
	JWT_ISSUER   string
	JWT_AUDIENCE string
	JWT_EXPIRE   uint64

	PASS_PEPPER string
}

func InitEnv(isDebug bool) {
	if isDebug {
		err := godotenv.Load("config/.env")
		if err != nil {
			Log.Fatal("Error loading .env file")
		}
	}

	Env.PORT = GetEnv(PORT, true)
	Env.ALLOW_ORIGINS = GetEnv(ALLOW_ORIGINS, true)

	Env.JWT_SECRET = GetEnv(JWT_SECRET, true)
	Env.JWT_ISSUER = GetEnv(JWT_ISSUER, true)
	Env.JWT_AUDIENCE = GetEnv(JWT_AUDIENCE, true)
	jwtExpire := GetEnv(JWT_EXPIRE, true)
	if expire, err := strconv.ParseUint(jwtExpire, 10, 64); err != nil {
		Log.Fatalf("Error loading env %v",
			JWT_EXPIRE)
	} else {
		Env.JWT_EXPIRE = expire
	}

	Env.PASS_PEPPER = GetEnv(PASS_PEPPER, true)

	Env.DB_HOST = GetEnv(DB_HOST, true)
	Env.DB_PORT = GetEnv(DB_PORT, true)
	Env.DB_USER = GetEnv(DB_USER, true)
	Env.DB_PASS = GetEnv(DB_PASS, true)
	Env.DB_NAME = GetEnv(DB_NAME, true)
	Env.GIN_MODE = GetEnv(GIN_MODE, false)
	if Env.GIN_MODE != RELEASE {
		Env.GIN_MODE = DEBUG
	}
}

func GetEnv(key string, required bool) string {
	value, exist := os.LookupEnv(key)
	if !exist && required {
		Log.Fatalf("Error loading env %v", key)
	}
	return value
}
