package service

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"shereifsrf/SaveTask-SRF/task-api/common"
	"shereifsrf/SaveTask-SRF/task-api/dao/model"
)

type IUserApi interface {
	AuthVerify(token string) (*model.User, error)
}

func NewUserApiService() IUserApi {
	return &userApi{}
}

type userApi struct {
}

func (u *userApi) AuthVerify(token string) (*model.User, error) {
	url := common.Env.USER_BACKEND_API_URL + "/auth/verify"

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set(common.Authorization, token)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		if resp.StatusCode >= 500 {
			return nil, errors.New("user Api is down")
		}
		var errRes map[string]interface{}
		json.Unmarshal(body, &errRes)
		return nil, errors.New(errRes["error"].(string))
	}

	var user *model.User
	json.Unmarshal(body, &user)

	return user, nil
}
