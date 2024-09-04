package service

import (
	"errors"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/shereifsrf/SaveTask-SRF/user-api/common"
	"github.com/shereifsrf/SaveTask-SRF/user-api/dao/model"
)

type IJwt interface {
	GenerateToken(username string) (string, error)
	ValidateToken(token string) (*model.User, error)
}

func NewJwtService() IJwt {
	return &jwtService{}
}

type jwtService struct{}

func (s *jwtService) GenerateToken(username string) (string, error) {
	// get token that contain jwt properties
	expiry := time.Now().Add(time.Second * time.Duration(common.Env.JWT_EXPIRE))
	audience := jwt.ClaimStrings{common.Env.JWT_AUDIENCE}
	claims := &model.Jwt{
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expiry),
			Issuer:    common.Env.JWT_ISSUER,
			Audience:  audience,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString([]byte(common.Env.JWT_SECRET))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func (s *jwtService) ValidateToken(token string) (*model.User, error) {
	claims := &model.Jwt{}
	tkn, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(common.Env.JWT_SECRET), nil
	})
	if err != nil {
		return nil, err
	}

	if !tkn.Valid {
		return nil, errors.New(http.StatusText(http.StatusUnauthorized))
	}

	return &model.User{Username: claims.Username}, nil
}
