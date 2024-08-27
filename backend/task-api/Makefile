dev:
	go run main.go

dc:
	docker-compose -f config/docker-compose.yml --env-file config/.env up

replica-key:
	openssl rand -base64 756 > config/dev/some.key
