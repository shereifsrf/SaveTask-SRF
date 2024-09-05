package model

import (
	"time"
)

type User struct {
	ID       uint64 `gorm:"primaryKey"`
	Username string `gorm:"unique"`
	Password string
	Role     string
	IsActive bool

	CreatedAt time.Time
	UpdatedAt time.Time
}

type Role string

const (
	Role_ADMIN Role = "admin"
	Role_USER  Role = "user"
)

type UserLogin struct {
	Username string
	Password string
}
