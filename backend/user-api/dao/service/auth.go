package service

import (
	"crypto/rand"
	"encoding/base64"
	"errors"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/shereifsrf/SaveTask-SRF/user-api/common"
	"github.com/shereifsrf/SaveTask-SRF/user-api/dao/model"
	"golang.org/x/crypto/argon2"
)

type IAuth interface {
	GenerateToken(user model.User) (string, error)
	ValidateToken(token string, needUInfo bool) (*model.User, error)
	GenerateHashSalt(password string, salt *string) (string, string, error)
	VerifyPassword(password, hash, salt string) bool
}

func NewAuthService(userService IUser) IAuth {
	return &authService{
		us: userService,
		ap: &model.AuthParam{
			Memory:      32 * 1024,
			Iterations:  3,
			Parallelism: 2,
			SaltLength:  16,
			KeyLength:   32,
		},
	}
}

type authService struct {
	us IUser
	ap *model.AuthParam
}

func (s *authService) GenerateToken(user model.User) (string, error) {
	// get token that contain jwt properties
	expiry := time.Now().Add(time.Second * time.Duration(common.Env.JWT_EXPIRE))
	audience := jwt.ClaimStrings{common.Env.JWT_AUDIENCE}
	claims := &model.Jwt{
		ID:   user.ID,
		Role: user.Role,
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

func (s *authService) ValidateToken(token string, needUInfo bool) (*model.User, error) {
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

	// check if the user exist
	if needUInfo {
		user, err := s.us.Get(&claims.ID, nil)
		if err != nil {
			return nil, err
		}
		return user, nil
	}

	return &model.User{ID: claims.ID, Role: claims.Role}, nil
}

func (s *authService) generateSalt() ([]byte, error) {
	salt := make([]byte, s.ap.SaltLength)
	_, err := rand.Read(salt)
	if err != nil {
		return nil, err
	}

	return salt, nil
}

func (s *authService) GenerateHashSalt(password string, salt *string) (string, string, error) {
	var (
		saltToCheck []byte
		err         error
	)

	if salt == nil {
		saltToCheck, err = s.generateSalt()
		if err != nil {
			return "", "", err
		}
	} else {
		saltToCheck, err = base64.RawStdEncoding.DecodeString(*salt)
		if err != nil {
			return "", "", err
		}
	}

	pepperedPass := password + common.Env.PASS_PEPPER
	hash := argon2.IDKey([]byte(pepperedPass), saltToCheck, s.ap.Iterations, s.ap.Memory, s.ap.Parallelism, s.ap.KeyLength)

	return base64.RawStdEncoding.EncodeToString(hash), base64.RawStdEncoding.EncodeToString(saltToCheck), nil
}

func (s *authService) VerifyPassword(password, hash, salt string) bool {
	newHash, _, err := s.GenerateHashSalt(password, &salt)
	if err != nil {
		return false
	}

	return hash == newHash
}
