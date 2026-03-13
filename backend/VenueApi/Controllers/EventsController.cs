using System.Globalization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VenueApi.Data;
using VenueApi.Entities;

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

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Post([FromBody] EventCreateDto dto, CancellationToken ct)
    {
        var sortDate = ParseSortDate(dto.Date, dto.SortDate);
        var e = new Event
        {
            Date = dto.Date,
            Day = dto.Day,
            Band = dto.Band,
            Genre = dto.Genre,
            Time = dto.Time,
            Description = dto.Description ?? "",
            PosterUrl = dto.PosterUrl ?? "",
            SortDate = sortDate
        };
        _db.Events.Add(e);
        await _db.SaveChangesAsync(ct);
        return CreatedAtAction(nameof(Get), new { id = e.Id }, new { e.Id, e.Date, e.Day, e.Band, e.Genre, e.Time, e.Description, e.PosterUrl });
    }

    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Put(int id, [FromBody] EventCreateDto dto, CancellationToken ct)
    {
        var e = await _db.Events.FindAsync([id], ct);
        if (e == null) return NotFound();
        var sortDate = ParseSortDate(dto.Date, dto.SortDate);
        e.Date = dto.Date;
        e.Day = dto.Day;
        e.Band = dto.Band;
        e.Genre = dto.Genre;
        e.Time = dto.Time;
        e.Description = dto.Description ?? "";
        e.PosterUrl = dto.PosterUrl ?? "";
        e.SortDate = sortDate;
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }

    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        var e = await _db.Events.FindAsync([id], ct);
        if (e == null) return NotFound();
        _db.Events.Remove(e);
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }

    private static DateTime ParseSortDate(string dateStr, string? sortDateIso)
    {
        if (!string.IsNullOrWhiteSpace(sortDateIso) && DateTime.TryParse(sortDateIso, CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsed))
            return parsed;
        if (DateTime.TryParseExact(dateStr.Trim(), "MMMM d", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedMd))
            return new DateTime(DateTime.UtcNow.Year, parsedMd.Month, parsedMd.Day, 0, 0, 0, DateTimeKind.Utc);
        return DateTime.UtcNow.Date;
    }
}

public record EventCreateDto(string Date, string Day, string Band, string Genre, string Time, string? Description, string? PosterUrl, string? SortDate);
