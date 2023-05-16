using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace alfred_api.Models;

public class TodoModel
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("Name")]
    public string TodoName { get; set; } = "";

    public string? Details { get; set; }
    public DateTime DueDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public bool IsCompleted { get; set; }
}