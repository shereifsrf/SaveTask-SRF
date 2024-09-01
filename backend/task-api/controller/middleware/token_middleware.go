package middleware

import (
	"shereifsrf/SaveTask-SRF/task-api/common"

	"github.com/gin-gonic/gin"
)

func TokenMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader(common.ADMIN_PASS_MUST_REMOVE)
		if token == "" || token != common.Env.ADMIN_PASS_MUST_REMOVE {
			c.JSON(401, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		c.Next()
	}
}
