using chat.Data.DbSets;

namespace chat.Data;

using Microsoft.EntityFrameworkCore;

public class ChatContext : DbContext
{
    public ChatContext(DbContextOptions<ChatContext> options) : base(options)
    {
    }

    // DbSet properties for database entities
    public DbSet<User> User { get; set; } = null!;
    public DbSet<User> User2 { get; set; } = null!;
}