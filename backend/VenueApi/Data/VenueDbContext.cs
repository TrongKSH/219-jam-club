using Microsoft.EntityFrameworkCore;
using VenueApi.Entities;

namespace VenueApi.Data;

public class VenueDbContext : DbContext
{
    public VenueDbContext(DbContextOptions<VenueDbContext> options) : base(options) { }

    public DbSet<Event> Events => Set<Event>();
    public DbSet<SiteContent> SiteContents => Set<SiteContent>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Event>().HasKey(e => e.Id);
        modelBuilder.Entity<SiteContent>().HasKey(s => s.Id);
        modelBuilder.Entity<SiteContent>().HasIndex(s => s.Key).IsUnique();
    }
}
