using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace alfred_api.Models;

public class SessionModel
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = "";

    [BsonElement("Name")]
    public string UserName { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.Now;
}