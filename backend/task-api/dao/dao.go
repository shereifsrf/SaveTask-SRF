package dao

import (
	"context"
	"fmt"
	"shereifsrf/SaveTask-SRF/task-api/common"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var MongoDB *mongo.Database
var client *mongo.Client

func InitMongoDB() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	credential := options.Credential{
		Username: common.Env.MONGO_DB_USER,
		Password: common.Env.MONGO_DB_PASS,
	}

	host := fmt.Sprintf("%s:%s", common.Env.MONGO_DB_HOST, common.Env.MONGO_DB_PORT)

	var err error
	client, err = mongo.Connect(
		ctx,
		options.Client().
			SetHosts([]string{host}).
			SetAuth(credential),
	)
	if err != nil {
		common.Log.Fatalf("Error pinging to MongoDB: %v", err)
	}

	err = client.Ping(ctx, nil)
	if err != nil {
		common.Log.Fatalf("Error pinging to MongoDB: %v", err)
	}

	MongoDB = client.Database(common.Env.MONGO_DB_NAME)
	common.Log.Println("Connected to MongoDB!")
}

func CloseMongoDB() {
	if client == nil {
		return
	}

	err := client.Disconnect(context.Background())
	if err != nil {
		common.Log.Fatalf("Error disconnecting from MongoDB: %v", err)
	}

	common.Log.Println("Disconnected from MongoDB!")
}
