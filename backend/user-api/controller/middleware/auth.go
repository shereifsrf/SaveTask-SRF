package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shereifsrf/SaveTask-SRF/user-api/common"
	"github.com/shereifsrf/SaveTask-SRF/user-api/dao/service"
)

func AuthMiddleware(jwtService service.IJwt) gin.HandlerFunc {
	return func(c *gin.Context) {
		authToken := c.GetHeader(common.Authorization)
		authToken = authToken[len("Bearer "):]
		if authToken == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization token is required"})
			c.Abort()
			return
		}

		// validate token
		user, err := jwtService.ValidateToken(authToken)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			c.Abort()
			return
		}

		c.Set(common.UserData, user)
		c.Next()
	}
}
