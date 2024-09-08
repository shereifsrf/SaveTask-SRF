package service

import (
	"context"
	"shereifsrf/SaveTask-SRF/task-api/common"
	"shereifsrf/SaveTask-SRF/task-api/dao"
	"shereifsrf/SaveTask-SRF/task-api/dao/model"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type ITask interface {
	ListTask(ctx context.Context, query model.ListTaskQuery) ([]model.Task, error)
	GetTask(ctx context.Context, id primitive.ObjectID) (model.Task, error)
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

func (ts *taskService) ListTask(ctx context.Context, query model.ListTaskQuery) ([]model.Task, error) {
	filter := primitive.M{
		"userId": query.UserId,
	}

	common.Log.Print(query)
	if query.Status != "" {
		filter["status"] = query.Status
	}

	// sort by desc order
	opts := options.Find().SetSort(primitive.D{{Key: "order", Value: -1}})
	opts.SetSkip(int64((query.Page - 1) * query.Limit)).SetLimit(int64(query.Limit))

	cursor, err := ts.taskCollection.Find(ctx, filter, opts)
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

func (ts *taskService) GetTask(ctx context.Context, id primitive.ObjectID) (model.Task, error) {
	filter := primitive.M{"_id": id}

	var task model.Task
	err := ts.taskCollection.FindOne(ctx, filter).Decode(&task)
	if err != nil {
		return model.Task{}, err
	}

	return task, nil
}

func (ts *taskService) AddTask(ctx context.Context, task model.Task) error {
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
