install:
	go mod tidy
	go install github.com/air-verse/air@latest

dev:
	go run main.go

dc:
	docker-compose -f config/docker-compose.yml --env-file config/.env up

dc-down:
	docker-compose -f config/docker-compose.yml --env-file config/.env down

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