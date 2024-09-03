package model

import "time"

type User struct {
	ID       uint64 `gorm:"primaryKey"`
	Username string `gorm:"unique"`
	Password string
	Role     string
	IsActive bool

	CreatedAt time.Time
	UpdatedAt time.Time
}
