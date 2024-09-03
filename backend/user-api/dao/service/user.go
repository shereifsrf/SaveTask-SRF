package service

import (
	"github.com/shereifsrf/SaveTask-SRF/user-api/dao"
	"github.com/shereifsrf/SaveTask-SRF/user-api/dao/model"
	"gorm.io/gorm"
)

type IUser interface {
	List() ([]model.User, error)
	Get(id uint64) (model.User, error)
	Add(user model.User) (model.User, error)
	Update(id uint64, user model.User) (model.User, error)
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

func (s *userService) Get(id uint64) (model.User, error) {
	var user model.User
	err := s.db.First(&user, id).Error
	return user, err
}

func (s *userService) Add(user model.User) (model.User, error) {
	err := s.db.Create(&user).Error
	return user, err
}

func (s *userService) Update(id uint64, user model.User) (model.User, error) {
	err := s.db.Model(&model.User{}).Where("id = ?", id).Updates(user).Error
	return user, err
}

func (s *userService) Delete(id uint64) error {
	err := s.db.Delete(&model.User{}, id).Error
	return err
}
