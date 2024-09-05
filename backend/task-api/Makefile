install:
	go mod tidy
	go install github.com/air-verse/air@latest

dev:
	make dc "-d"
	air

dc:
	docker-compose -f config/docker-compose.yml --env-file config/.env up

dc-stop:
	docker-compose -f config/docker-compose.yml --env-file config/.env stop

dc-start:
	docker-compose -f config/docker-compose.yml --env-file config/.env start

replica-key:
	openssl rand -base64 756 > config/dev/some.key

### Kubernetes ###
NS := srf-savetask
make ns:
	kubectl -n $(NS) $(filter-out $@,$(MAKECMDGOALS))

HELM_DIR := task-api-helm
HELM_NAME := taskapirelease
helm-create:
	# helm create $(HELM_DIR)
	cd $(HELM_DIR)/charts && helm create task-mongodb

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
d-access-vol:
	docker run -it --rm --volume config_user-db-volume:/var \
		--name user-db-volume-access alpine /bin/sh

docker-build:
	docker build \
	-t registry.shereif.com/srf-savetask/task-api:latest \
	-f config/Dockerfile .

docker-exec:
	docker exec -it $(filter-out $@,$(MAKECMDGOALS)) /bin/bash

docker-run:
	$(eval cmd := $(filter-out $@,$(MAKECMDGOALS)))
	if [ -z "$(cmd)" ]; then \
		echo "Running docker without command"; \
		docker run \
			-p 8001:8001 \
			registry.shereif.com/srf-savetask/task-api:latest; \
	else \
		echo "Running docker with command"; \
		docker run \
			-it --entrypoint /bin/sh \
			registry.shereif.com/srf-savetask/task-api:latest; \
	fi

docker-push:
	docker login registry.shereif.com && \
	docker push \
		registry.shereif.com/srf-savetask/task-api:latest

docker-pull:
	docker login registry.shereif.com && \
	docker pull \
		registry.shereif.com/srf-savetask/task-api:latest

exec:
	kubectl -n $(NS) \
		exec -it $(filter-out $@,$(MAKECMDGOALS)) -- /bin/bash

# Curl requests
DOMAIN := http://localhost:8001
# DOMAIN := https://savetask.shereif.com
curl-add:
	curl -X POST $(DOMAIN)/api/task -H "Content-Type: application/json" -H "ADMIN_PASS_MUST_REMOVE: something" -d '{"name":"task2","description":"description1","status":"pending"}'

curl-list:
	curl -X GET $(DOMAIN)/api/task -H "ADMIN_PASS_MUST_REMOVE: something"

curl-update:
	curl -X PUT $(DOMAIN)/api/task/66cec55a4232a7c904621038 -H "Content-Type: application/json" -d '{"id":"66cec55a4232a7c904621038", "name":"task2","description":"description1-updated","status":"completed"}'

curl-delete:
	curl -X DELETE $(DOMAIN)/api/task/66cec55a4232a7c904621038	
