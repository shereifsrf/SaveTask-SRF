using Microsoft.EntityFrameworkCore;

namespace alfred_api.Data;
public class TaskContext : DbContext
{
    public TaskContext()
    {
    }
    public TaskContext(DbContextOptions<TaskContext> options) : base(options)
    {
    }

    public DbSet<UserModel> Users { get; set; }
}
