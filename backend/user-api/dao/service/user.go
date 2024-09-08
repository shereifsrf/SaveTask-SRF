package service

import (
	"github.com/shereifsrf/SaveTask-SRF/user-api/common"
	"github.com/shereifsrf/SaveTask-SRF/user-api/dao"
	"github.com/shereifsrf/SaveTask-SRF/user-api/dao/model"
	"gorm.io/gorm"
)

type IUser interface {
	List() ([]model.User, error)
	Get(id *uint64, username *string) (*model.User, error)
	Add(user model.User) (model.User, error)
	Update(user *model.User) (*model.User, error)
	Delete(id uint64) error
}

func NewUserService() IUser {
	return &userService{
		db: dao.UserDB,
	}
}

type userService struct {
	db *gorm.DB
}

func (s *userService) List() ([]model.User, error) {
	var users []model.User
	err := s.db.Find(&users).Error
	return users, err
}

func (s *userService) Get(id *uint64, username *string) (*model.User, error) {
	// if username if passed, then check with username, otherwise id
	var (
		user model.User
		err  error
	)
	if id != nil {
		err = s.db.First(&user, id).Error
	} else {
		err = s.db.Where("username = ?", username).First(&user).Error
	}

	return &user, err
}

func (s *userService) Add(user model.User) (model.User, error) {
	if result := s.db.Create(&user); result.Error != nil {
		common.Log.Printf("Error: %v", result.Error)
		return user, result.Error
	}

	return user, nil
}

func (s *userService) Update(user *model.User) (*model.User, error) {
	if result := s.db.Model(&model.User{}).Where("id = ?", user.ID).
		Select("username", "password", "role").
		Updates(user); result.Error != nil {
		common.Log.Printf("Error: %v", result.Error)
		return nil, result.Error
	}
	return user, nil
}

func (s *userService) Delete(id uint64) error {
	// err := s.db.Delete(&model.User{}, id).Error
	var user *model.User
	err := s.db.Model(&user).Where("id = ?", id).Update("is_active", false).Error
	return err
}
