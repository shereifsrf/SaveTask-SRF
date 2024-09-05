package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shereifsrf/SaveTask-SRF/user-api/common"
	"github.com/shereifsrf/SaveTask-SRF/user-api/dao/service"
)

func AuthMiddleware(auth service.IAuth, must bool, needUInfo bool) gin.HandlerFunc {
	return func(c *gin.Context) {
		authToken := c.GetHeader(common.Authorization)
		if authToken == "" {
			if must {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization token is required"})
				c.Abort()
			}
			return
		}

		token := authToken[len(common.Bearer)+1:]
		user, err := auth.ValidateToken(token, needUInfo)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			c.Abort()
			return
		}

		c.Set(common.UserData, user)
		c.Next()
	}
}
