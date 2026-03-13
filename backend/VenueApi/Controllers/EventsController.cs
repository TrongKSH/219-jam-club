using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VenueApi.Data;

namespace VenueApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
    private readonly VenueDbContext _db;

    public EventsController(VenueDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken ct)
    {
        var events = await _db.Events
            .OrderBy(e => e.SortDate)
            .Select(e => new
            {
                e.Id,
                e.Date,
                e.Day,
                e.Band,
                e.Genre,
                e.Time,
                e.Description,
                e.PosterUrl
            })
            .ToListAsync(ct);
        return Ok(events);
    }

    [HttpGet("upcoming")]
    public async Task<IActionResult> GetUpcoming(int count = 3, CancellationToken ct = default)
    {
        var from = DateTime.UtcNow.Date;
        var events = await _db.Events
            .Where(e => e.SortDate >= from)
            .OrderBy(e => e.SortDate)
            .Take(count)
            .Select(e => new
            {
                e.Date,
                e.Day,
                e.Band,
                e.Genre,
                e.Time
            })
            .ToListAsync(ct);
        return Ok(events);
    }
}
