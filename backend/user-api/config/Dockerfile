FROM golang:1.23-alpine3.20 as builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o /go/bin/user-api

FROM alpine:3.20

COPY --from=builder /go/bin/user-api /go/bin/user-api

CMD ["/go/bin/user-api"]
