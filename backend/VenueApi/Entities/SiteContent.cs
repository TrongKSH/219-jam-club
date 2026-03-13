namespace VenueApi.Entities;

public class SiteContent
{
    public int Id { get; set; }
    public string Key { get; set; } = string.Empty;  // hero, about, contact, gallery, infoStrip, footer, etc.
    public string JsonValue { get; set; } = "{}";
}
