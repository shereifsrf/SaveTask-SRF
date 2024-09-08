package model

type User struct {
	ID   uint64 `json:"id"`
	Role string `json:"role"`
}

type Role string

const (
	Role_ADMIN Role = "admin"
	Role_USER  Role = "user"
)
