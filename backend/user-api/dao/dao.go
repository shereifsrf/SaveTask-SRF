package dao

import (
	"fmt"

	"github.com/shereifsrf/SaveTask-SRF/user-api/common"
	"github.com/shereifsrf/SaveTask-SRF/user-api/dao/model"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var UserDB *gorm.DB

func Init() {
	url := fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s",
		common.Env.DB_HOST,
		common.Env.DB_PORT,
		common.Env.DB_USER,
		common.Env.DB_NAME,
		common.Env.DB_PASS,
	)

	var err error
	UserDB, err = gorm.Open(postgres.Open(url), &gorm.Config{})
	if err != nil {
		common.Log.Fatalf("Error connecting to DB %v", err)
	}

	UserDB.AutoMigrate(&model.User{})
}
