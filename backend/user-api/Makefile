NS := srf-savetask
HELM_DIR := user-api-helm
HELM_NAME := taskapirelease
DOCKER_IMAGE := registry.shereif.com/srf-savetask/user-api:latest

init:
	go mod init github.com/shereifsrf/SaveTask-SRF/user-api

install:
	# go install github.com/air-verse/air@latest
	go mod tidy
	go get -u gorm.io/gorm
	go get -u github.com/joho/godotenv

dev:
	make dc $(filter-out $@,$(MAKECMDGOALS)) || echo all good
	air

### Kubernetes ###
make ns:
	kubectl -n $(NS) $(filter-out $@,$(MAKECMDGOALS))

helm-create:
	# helm create $(HELM_DIR)
	cd $(HELM_DIR)/charts && helm create user-pgdb

helm-install:
	$(eval context:=$(shell kubectl config current-context))
			# --debug --dry-run; 
	if [ "$(context)" = "minikube" ]; then \
		helm upgrade --install \
			$(HELM_NAME) \
			-n $(NS) \
			$(HELM_DIR); \
	else \
		echo "Confim? [y/n]"; \
		read confirm; \
		if [ "$$confirm" = "y" ]; then \
			helm upgrade --install \
				$(HELM_NAME) \
				-n $(NS) \
				-f $(HELM_DIR)/values.prod.yaml \
				$(HELM_DIR); \
		else \
			echo "Canceled"; \
		fi; \
	fi

helm-uninstall:
	helm uninstall $(HELM_NAME) -n $(NS)

helm-show:
	# helm list -n $(NS)
	# helm get all $(HELM_NAME) -n $(NS)
	kubectl -n $(NS) get svc,pvc,pv,configmap,secret,ingress,cronjob,job,deployment,pods,statefulset \
		-l app=$(HELM_NAME)
		# | grep task

### Docker ###
dc:
	$(eval commands := $(filter-out $@,$(MAKECMDGOALS)))
	if [ "$(commands)" = "mac" ]; then \
		docker-compose -f config/docker-compose.yml --env-file config/.env up -d; \
	else \
		docker-compose -f config/docker-compose.yml --env-file config/.env up; \
	fi

dc-down:
	docker-compose -f config/docker-compose.yml down

dc-stop:
	docker-compose -f config/docker-compose.yml --env-file config/.env stop

dc-start:
	docker-compose -f config/docker-compose.yml --env-file config/.env start
	docker-compose -f config/docker-compose.yml up -d

d-access-vol:
	docker run -it --rm --volume config_user-db-volume:/var \
		--name user-db-volume-access alpine /bin/sh

docker-build:
	docker build \
	-t $(DOCKER_IMAGE) \
	-f config/Dockerfile .

docker-exec:
	docker exec -it $(filter-out $@,$(MAKECMDGOALS)) /bin/bash

docker-run:
	$(eval cmd := $(filter-out $@,$(MAKECMDGOALS)))
	if [ -z "$(cmd)" ]; then \
		echo "Running docker without command"; \
		docker run \
			-p 8001:8001 \
			$(DOCKER_IMAGE); \
	else \
		echo "Running docker with command"; \
		docker run \
			-it --entrypoint /bin/sh \
			$(DOCKER_IMAGE); \
	fi

docker-push:
	docker login registry.shereif.com && \
	docker push \
		$(DOCKER_IMAGE)

docker-pull:
	docker login registry.shereif.com && \
	docker pull \
		$(DOCKER_IMAGE)


# Curl Commands
DOMAIN := http://localhost:8002
# admin
# Authorization := "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RlcjEiLCJyb2xlIjoiYWRtaW4iLCJpc3MiOiJhdXRoLXNlcnZpY2UiLCJhdWQiOlsiYXV0aC1zZXJ2aWNlIl0sImV4cCI6MTcyNjE1NDAyNn0.O-hn_rAhsZkgAn0isHnVHNqKu332RgALtH0ZgfDwZRc"
# user
Authorization := "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RlciIsInJvbGUiOiJ1c2VyIiwiaXNzIjoiYXV0aC1zZXJ2aWNlIiwiYXVkIjpbImF1dGgtc2VydmljZSJdLCJleHAiOjE3MjYyMTgzNzV9.OiSrax2lrL3B-XBm_4fCp0SwAClwCkzYmW5GMl8ZUsw"
curl-add:
	curl -X POST $(DOMAIN)/api/user \
		-H "Content-Type: application/json" \
		-d '{"username": "tester1", "password": "password", "role": "admin"}'

curl-list:
	curl -iX GET $(DOMAIN)/api/user -H "Authorization: Bearer $(Authorization)"

curl-get:
	curl -X GET $(DOMAIN)/api/user/35 -H "Authorization: Bearer $(Authorization)"

curl-update:
	curl -X PUT $(DOMAIN)/api/user/1 \
		-H "Content-Type: application/json" \
		-d '{"password": "password"}'

curl-delete:
	curl -X DELETE $(DOMAIN)/api/user/3 -H "Authorization: Bearer $(Authorization)"

curl-login:
	curl -iX POST $(DOMAIN)/api/auth/login \
		-H "Content-Type: application/json" \
		-d '{"username": "tester", "password": "password"}'

curl-verify:
	curl -iX GET $(DOMAIN)/api/auth/verify -H "Authorization: Bearer $(Authorization)"