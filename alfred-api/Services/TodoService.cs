using alfred_api.Models;
using alfred_api.Configs;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace alfred_api.Services;

public class TodoService
{
    private readonly IMongoCollection<TodoModel> _todoCollection;

    public TodoService(
        IOptions<TodoMongoDBSettings> todoMongoDBSettings)
    {
        var mongoClient = new MongoClient(
            todoMongoDBSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            todoMongoDBSettings.Value.DatabaseName);

        _todoCollection = mongoDatabase.GetCollection<TodoModel>(
            todoMongoDBSettings.Value.TodoCollectionName);
    }

    public async Task<List<TodoModel>> GetAsync() =>
        await _todoCollection.Find(_ => true).ToListAsync();

    public async Task<TodoModel?> GetAsync(string id) =>
        await _todoCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task CreateAsync(TodoModel newTodo) =>
        await _todoCollection.InsertOneAsync(newTodo);

    public async Task UpdateAsync(string id, TodoModel updateTodo) =>
        await _todoCollection.ReplaceOneAsync(x => x.Id == id, updateTodo);

    public async Task RemoveAsync(string id) =>
        await _todoCollection.DeleteOneAsync(x => x.Id == id);
}