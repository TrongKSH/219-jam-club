namespace VenueApi.Entities;

public class Event
{
    public int Id { get; set; }
    public string Date { get; set; } = string.Empty;   // e.g. "March 12"
    public string Day { get; set; } = string.Empty;    // e.g. "Thursday"
    public string Band { get; set; } = string.Empty;
    public string Genre { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string PosterUrl { get; set; } = string.Empty;
    public DateTime SortDate { get; set; }  // for ordering/upcoming
}
