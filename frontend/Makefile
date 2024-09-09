dev:
	npm run dev

build:
	npm run build

NS := srf-savetask
make ns:
	kubectl -n $(NS) $(filter-out $@,$(MAKECMDGOALS))

### Docker ###
DOCKER_IMAGE := registry.shereif.com/srf-savetask/task-nextjs-fe
docker-build:
	docker build \
	--rm \
	-t $(DOCKER_IMAGE):latest \
	-f config/Dockerfile .

docker-run:
	$(eval mode:=$(dev))
	$(eval cmd := $(filter-out $@,$(MAKECMDGOALS)))


	if [ -z "$(cmd)" ]; then \
		echo "mode: $(mode)"; \
		docker run \
			-p 3000:3000 \
			-e NEXT_PUBLIC_TASK_API_URL=http://localhost:8080 \
			-e NEXT_PUBLIC_TASK_BACKEND_URL=http://localhost:8080 \
			$(DOCKER_IMAGE):latest; \
	else \
		echo "entry to container with mode: $(mode)"; \
		docker run \
			-it --entrypoint /bin/sh \
			$(DOCKER_IMAGE):latest; \
	fi

docker-br:
	make docker-build
	make docker-run

docker-push:
	docker login registry.shereif.com && \
	docker push \
		$(DOCKER_IMAGE):latest; \

docker-pull:
	docker login registry.shereif.com && \
	docker pull \
		$(DOCKER_IMAGE):latest; \

### Helm ###
HELM_DIR := task-nextjs-helm
HELM_NAME := tasknextjsrelease
helm-create:
	helm create $(HELM_DIR)

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
	helm list -n $(NS)
	# helm get all $(HELM_NAME) -n $(NS)
	kubectl -n $(NS) get svc,pvc,pv,configmap,secret,ingress,cronjob,job,deployment,pods,statefulset \
		-l app=$(HELM_NAME)

exec:
	kubectl -n $(NS) \
		exec -it $(filter-out $@,$(MAKECMDGOALS)) -- /bin/bash