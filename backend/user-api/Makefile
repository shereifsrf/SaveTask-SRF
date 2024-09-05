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
	make dc "-d"
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
	docker-compose -f config/docker-compose.yml --env-file config/.env up

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
curl-add:
	curl -X POST $(DOMAIN)/api/user \
		-H "Content-Type: application/json" \
		-d '{"username": "tester2", "password": "password", "role": "admin"}'

curl-list:
	curl -iX GET $(DOMAIN)/api/user -H "Authorization: Bearer "

curl-get:
	curl -X GET $(DOMAIN)/api/user/2

curl-update:
	curl -X PUT $(DOMAIN)/api/user/4 \
		-H "Content-Type: application/json" \
		-d '{"isActive": false, "username": "tester3-c3"}'

curl-delete:
	curl -X DELETE $(DOMAIN)/api/user/4
