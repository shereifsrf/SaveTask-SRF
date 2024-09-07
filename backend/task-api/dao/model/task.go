package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

var TaskCollection = "tasks"

type Task struct {
	ID          *primitive.ObjectID `bson:"_id" json:"id"`
	Name        string              `bson:"name" json:"name"`
	Description string              `bson:"description" json:"description"`
	Date        time.Time           `bson:"date" json:"date"`
	Status      Enum_Status         `bson:"status" json:"status"`
	Order       float64             `bson:"order" json:"order"`
	Username    string              `bson:"username" json:"username"`
}

type Enum_Status string

const (
	Enum_Status_Pending Enum_Status = "pending"
	Enum_Status_Done    Enum_Status = "done"
)

type ListTaskQuery struct {
	Page     int         `form:"page"`
	Limit    int         `form:"limit"`
	Status   Enum_Status `form:"status"`
	Username *string     `form:"username"`
}

func IsEnum_Status(s string) bool {
	switch s {
	case string(Enum_Status_Pending), string(Enum_Status_Done):
		return true
	}
	return false
}
