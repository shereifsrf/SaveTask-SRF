package middleware

import (
	"fmt"
	"shereifsrf/SaveTask-SRF/task-api/common"
	"shereifsrf/SaveTask-SRF/task-api/dao/service"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware(us service.IUserApi) gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader(common.Authorization)
		user, err := us.AuthVerify(token)
		if err != nil {
			msg := fmt.Sprintf("Unauthorized: %s", err.Error())
			c.JSON(401, gin.H{"error": msg})
			c.Abort()
			return
		}

		c.Set(common.UserData, user)

		c.Next()
	}
}
