package model

type User struct {
	Username string
	Role     string `json:"role"`
}

type Role string

const (
	Role_ADMIN Role = "admin"
	Role_USER  Role = "user"
)
