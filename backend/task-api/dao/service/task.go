package service

import (
	"context"
	"shereifsrf/SaveTask-SRF/task-api/dao"
	"shereifsrf/SaveTask-SRF/task-api/dao/model"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type ITask interface {
	ListTask(ctx context.Context) ([]model.Task, error)
	AddTask(ctx context.Context, task model.Task) error
	UpdateTask(ctx context.Context, task model.Task) error
	DeleteTask(ctx context.Context, id primitive.ObjectID) error
}

func NewTaskService() ITask {
	return &taskService{
		taskCollection: dao.MongoDB.Collection(model.TaskCollection),
	}
}

type taskService struct {
	taskCollection *mongo.Collection
}

func (ts *taskService) ListTask(ctx context.Context) ([]model.Task, error) {
	// sort by desc order
	opts := options.Find().SetSort(primitive.D{{Key: "order", Value: -1}})

	cursor, err := ts.taskCollection.Find(ctx, primitive.M{}, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var tasks []model.Task
	for cursor.Next(ctx) {
		var task model.Task
		err := cursor.Decode(&task)
		if err != nil {
			return nil, err
		}
		tasks = append(tasks, task)
	}

	return tasks, nil
}

func (ts *taskService) AddTask(ctx context.Context, task model.Task) error {
	if task.ID == nil {
		id := primitive.NewObjectID()
		task.ID = &id
	}

	_, err := ts.taskCollection.InsertOne(ctx, task)
	if err != nil {
		return err
	}

	return nil
}

func (ts *taskService) UpdateTask(ctx context.Context, task model.Task) error {
	filter := primitive.M{"_id": task.ID}
	update := primitive.M{"$set": task}

	_, err := ts.taskCollection.UpdateOne(ctx, filter, update)
	if err != nil {
		return err
	}

	return nil
}

func (ts *taskService) DeleteTask(ctx context.Context, id primitive.ObjectID) error {
	filter := primitive.M{"_id": id}

	_, err := ts.taskCollection.DeleteOne(ctx, filter)
	if err != nil {
		return err
	}

	return nil
}
