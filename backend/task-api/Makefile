install:
	go mod tidy
	go install github.com/air-verse/air@latest

dev:
	go run main.go

dc:
	docker-compose -f config/docker-compose.yml --env-file config/.env up

dc-stop:
	docker-compose -f config/docker-compose.yml --env-file config/.env stop

dc-start:
	docker-compose -f config/docker-compose.yml --env-file config/.env start

replica-key:
	openssl rand -base64 756 > config/dev/some.key

curl-add:
	curl -X POST -H "Content-Type: application/json" -d '{"name":"task2","description":"description1","status":"pending"}' http://localhost:8080/api/task

curl-list:
	curl -X GET http://localhost:8080/api/task

curl-update:
	curl -X PUT -H "Content-Type: application/json" -d '{"id":"66cec55a4232a7c904621038", "name":"task2","description":"description1-updated","status":"completed"}' http://localhost:8080/api/task/66cec55a4232a7c904621038

curl-delete:
	curl -X DELETE http://localhost:8080/api/task/66cec55a4232a7c904621038	


### Kubernetes ###
NS := srf-business
make ns:
	kubectl -n $(NS) $(filter-out $@,$(MAKECMDGOALS))

HELM_DIR := spend-api-helm
HELM_NAME := spendapirelease
helm-create:
	# helm create $(HELM_DIR)
	cd $(HELM_DIR)/charts && helm create spend-mongodb

helm-install:
	$(eval context:=$(shell kubectl config current-context))
			# --debug --dry-run; 
	if [ "$(context)" = "minikube" ]; then \
		helm upgrade --install \
			$(HELM_NAME) \
			-n $(NS) \
			-f $(HELM_DIR)/values-env.yaml \
			$(HELM_DIR); \
	else \
		echo "Confim? [y/n]"; \
		read confirm; \
		if [ "$$confirm" = "y" ]; then \
			helm upgrade --install \
				$(HELM_NAME) \
				-n $(NS) \
				-f $(HELM_DIR)/values-env.yaml \
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
		# | grep spend
