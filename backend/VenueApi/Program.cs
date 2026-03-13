using Microsoft.EntityFrameworkCore;
using VenueApi.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<VenueDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=venue.db"));
builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors();
app.UseHttpsRedirection();
app.UseStaticFiles();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<VenueDbContext>();
    await SeedData.EnsureSeededAsync(db);
}

app.MapControllers();

app.Run();
