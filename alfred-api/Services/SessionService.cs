using alfred_api.Models;
using alfred_api.Configs;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace alfred_api.Services;

public class SessionService
{
    private readonly IMongoCollection<SessionModel> _sessionCollection;

    public SessionService(
        IOptions<TodoMongoDBSettings> todoMongoDBSettings)
    {
        var mongoClient = new MongoClient(
            todoMongoDBSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            todoMongoDBSettings.Value.DatabaseName);

        _sessionCollection = mongoDatabase.GetCollection<SessionModel>(
            todoMongoDBSettings.Value.SessionCollectionName);
    }

    // add session
    public async Task<SessionModel> CreateAsync(SessionModel newSession)
    {
        await _sessionCollection.InsertOneAsync(newSession);
        return newSession;
    }
}