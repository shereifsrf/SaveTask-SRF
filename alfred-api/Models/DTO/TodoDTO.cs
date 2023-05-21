
namespace alfred_api.Models.DTO;

public class TodoDTO
{
    public string? Id { get; set; }
    public string TodoName { get; set; } = "";
    public string? Details { get; set; }
    public DateTime DueDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public bool IsCompleted { get; set; }
}