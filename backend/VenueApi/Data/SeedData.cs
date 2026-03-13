using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using VenueApi.Entities;

namespace VenueApi.Data;

internal static class JsonOpts
{
    public static readonly JsonSerializerOptions Camel = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
}

public static class SeedData
{
    public static async Task EnsureSeededAsync(VenueDbContext db)
    {
        await db.Database.EnsureCreatedAsync();

        if (await db.Events.AnyAsync())
            return;

        var events = new[]
        {
            new Event { Date = "March 12", Day = "Thursday", Band = "The Crimson Echoes", Genre = "Rock / Alternative", Time = "9:00 PM", Description = "High-energy rock with a modern edge. The Crimson Echoes bring raw power and emotional depth to every performance.", PosterUrl = "https://images.unsplash.com/photo-1759835715024-11684a8109e7?w=1080", SortDate = new DateTime(2026, 3, 12) },
            new Event { Date = "March 13", Day = "Friday", Band = "Jazz Fusion Collective", Genre = "Jazz / Fusion", Time = "8:30 PM", Description = "Smooth jazz meets experimental fusion in an unforgettable evening of musical exploration.", PosterUrl = "https://images.unsplash.com/photo-1768935434604-2301398d92d1?w=1080", SortDate = new DateTime(2026, 3, 13) },
            new Event { Date = "March 14", Day = "Saturday", Band = "Electric Souls", Genre = "Electronic / Indie", Time = "10:00 PM", Description = "Electronic beats with indie sensibilities. Electric Souls creates an immersive sonic landscape.", PosterUrl = "https://images.unsplash.com/photo-1692176548571-86138128e36c?w=1080", SortDate = new DateTime(2026, 3, 14) },
            new Event { Date = "March 15", Day = "Sunday", Band = "Acoustic Sundays", Genre = "Folk / Acoustic", Time = "7:00 PM", Description = "Intimate acoustic performances that strip music down to its essence.", PosterUrl = "https://images.unsplash.com/photo-1616620377931-9b22bc292ead?w=1080", SortDate = new DateTime(2026, 3, 15) },
            new Event { Date = "March 16", Day = "Monday", Band = "Blues Brothers Tribute", Genre = "Blues / Soul", Time = "8:00 PM", Description = "Classic blues and soul covers that will have you on your feet.", PosterUrl = "https://images.unsplash.com/photo-1760160741899-636fc5dce84c?w=1080", SortDate = new DateTime(2026, 3, 16) },
            new Event { Date = "March 17", Day = "Tuesday", Band = "Irish Session Night", Genre = "Celtic / Traditional", Time = "8:00 PM", Description = "Celebrating St. Patrick's with traditional Irish music, dance, and revelry.", PosterUrl = "https://images.unsplash.com/photo-1712397589914-ac7eb91b1302?w=1080", SortDate = new DateTime(2026, 3, 17) },
            new Event { Date = "March 18", Day = "Wednesday", Band = "Open Mic Night", Genre = "Various", Time = "7:30 PM", Description = "Showcase your talent or discover new artists. Open Mic Night is where stars are born.", PosterUrl = "https://images.unsplash.com/photo-1560709560-f3be0054a1b7?w=1080", SortDate = new DateTime(2026, 3, 18) },
        };

        await db.Events.AddRangeAsync(events);

        var hero = new { Headline = "219", HeadlineAccent = " JAM CLUB", Tagline = "LIVE MUSIC EVERY NIGHT", HeroImageUrl = "https://images.unsplash.com/photo-1718959046429-33cff57d58eb?w=1080", PrimaryCtaText = "View Calendar", PrimaryCtaLink = "#calendar", SecondaryCtaText = "Contact Us", SecondaryCtaLink = "#contact" };
        var gallery = new { Title = "THE VENUE", ImageUrls = new[] { "https://images.unsplash.com/photo-1669459846550-c60006acdec6?w=1080", "https://images.unsplash.com/photo-1552595458-e8ad6af8aa10?w=1080" } };
        var infoStrip = new[]
        {
            new { Title = "LIVE EVERY NIGHT", Description = "Experience the best local and touring acts 7 nights a week" },
            new { Title = "365 DAYS A YEAR", Description = "Never miss a night of incredible music at 219 Jam Club" },
            new { Title = "PRIME LOCATION", Description = "Easy to find, impossible to forget" }
        };
        var about = new
        {
            HeroImageUrl = "https://images.unsplash.com/photo-1766360884068-b83757593c2f?w=1080",
            StoryParagraphs = new[]
            {
                "Founded in the heart of the city, 219 Jam Club has been the premier destination for live music since day one. Our mission is simple: bring the best live music to our community every single night of the year.",
                "What started as a small underground venue has grown into a beloved institution where music lovers gather to experience unforgettable performances.",
                "Our intimate 200-capacity venue creates an electric atmosphere where artists and audiences connect on a deeper level."
            },
            Values = new[] { new { Title = "LIVE MUSIC", Description = "Nothing beats the energy of live performance." }, new { Title = "COMMUNITY", Description = "We're more than a venue—we're a gathering place." }, new { Title = "PASSION", Description = "Every show is curated with love and dedication." }, new { Title = "EXCELLENCE", Description = "We maintain the highest standards." } },
            Stats = new[] { new { Number = "365", Label = "Shows Per Year" }, new { Number = "200", Label = "Capacity" }, new { Number = "50+", Label = "Genres Hosted" }, new { Number = "1000+", Label = "Artists Hosted" } },
            TeamCopy = "Behind every great show is a dedicated team of music lovers. From our booking agents who discover incredible talent, to our sound engineers who ensure every note sounds perfect—everyone at 219 Jam Club is committed to creating unforgettable experiences."
        };
        var contact = new
        {
            AddressLine1 = "219 Music Avenue",
            AddressLine2 = "Downtown District",
            AddressLine3 = "City, State 12345",
            Phone1 = "(555) 219-JAMZ",
            Phone2 = "(555) 219-5269",
            Email1 = "info@219jamclub.com",
            Email2 = "booking@219jamclub.com",
            HoursText = "Monday - Sunday. Doors open at 7:00 PM. Show times vary (check calendar).",
            SocialLinks = new[] { "#", "#", "#", "#" },
            BookingInfo = "Interested in performing? Send your EPK to booking@219jamclub.com with band name, genre, links to music, photos, bio, and preferred dates. We book 2-3 months in advance."
        };
        var footer = new { Tagline = "Your destination for live music every night.", CopyrightText = "219 Jam Club. All rights reserved." };

        await db.SiteContents.AddRangeAsync(
            new SiteContent { Key = "hero", JsonValue = JsonSerializer.Serialize(hero, JsonOpts.Camel) },
            new SiteContent { Key = "gallery", JsonValue = JsonSerializer.Serialize(gallery, JsonOpts.Camel) },
            new SiteContent { Key = "infoStrip", JsonValue = JsonSerializer.Serialize(infoStrip, JsonOpts.Camel) },
            new SiteContent { Key = "about", JsonValue = JsonSerializer.Serialize(about, JsonOpts.Camel) },
            new SiteContent { Key = "contact", JsonValue = JsonSerializer.Serialize(contact, JsonOpts.Camel) },
            new SiteContent { Key = "footer", JsonValue = JsonSerializer.Serialize(footer, JsonOpts.Camel) }
        );

        await db.SaveChangesAsync();
    }
}
