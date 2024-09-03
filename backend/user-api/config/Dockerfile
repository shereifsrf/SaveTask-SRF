FROM golang:1.23-alpine3.20 as builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o /go/bin/task-api

FROM alpine:3.20

COPY --from=builder /go/bin/task-api /go/bin/task-api

CMD ["/go/bin/task-api"]
