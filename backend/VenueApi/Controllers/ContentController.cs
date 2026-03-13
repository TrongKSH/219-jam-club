using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VenueApi.Data;
using VenueApi.Entities;

namespace VenueApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContentController : ControllerBase
{
    private static readonly HashSet<string> AllowedKeys = new(StringComparer.OrdinalIgnoreCase)
        { "hero", "gallery", "infoStrip", "about", "contact", "footer" };

    private static readonly JsonSerializerOptions CamelOpts = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    private readonly VenueDbContext _db;

    public ContentController(VenueDbContext db) => _db = db;

    [HttpGet("landing")]
    public async Task<IActionResult> GetLanding(CancellationToken ct)
    {
        var contents = await _db.SiteContents.ToDictionaryAsync(c => c.Key, c => c.JsonValue, ct);
        var opts = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

        object? Get(string key)
        {
            return contents.TryGetValue(key, out var json) ? JsonSerializer.Deserialize<JsonElement>(json) : null;
        }

        var hero = Get("hero");
        var gallery = Get("gallery");
        var infoStrip = Get("infoStrip");
        var about = Get("about");
        var contact = Get("contact");
        var footer = Get("footer");

        var payload = new
        {
            siteName = "219 JAM CLUB",
            hero,
            gallery,
            infoStrip,
            about,
            contact,
            footer,
            bookYourSpot = new { heading = "BOOK YOUR SPOT", body = "Reserve your table or contact us for group bookings", ctaText = "Contact Us" }
        };

        return Ok(payload);
    }

    [Authorize]
    [HttpPut("{key}")]
    public async Task<IActionResult> PutContent(string key, [FromBody] JsonElement body, CancellationToken ct)
    {
        if (!AllowedKeys.Contains(key))
            return BadRequest(new { message = $"Invalid content key. Allowed: {string.Join(", ", AllowedKeys)}" });

        var jsonValue = JsonSerializer.Serialize(body, CamelOpts);
        var existing = await _db.SiteContents.FirstOrDefaultAsync(c => c.Key == key, ct);
        if (existing != null)
        {
            existing.JsonValue = jsonValue;
        }
        else
        {
            _db.SiteContents.Add(new SiteContent { Key = key, JsonValue = jsonValue });
        }

        await _db.SaveChangesAsync(ct);
        return NoContent();
    }
}
