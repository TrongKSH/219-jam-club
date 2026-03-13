namespace VenueApi.Models;

public record HeroContent(
    string Headline,
    string Tagline,
    string HeroImageUrl,
    string PrimaryCtaText,
    string PrimaryCtaLink,
    string SecondaryCtaText,
    string SecondaryCtaLink
);

public record GalleryContent(string Title, string[] ImageUrls);

public record InfoItem(string Title, string Description);

public record AboutContent(
    string HeroImageUrl,
    string[] StoryParagraphs,
    InfoItem[] Values,
    StatItem[] Stats,
    string TeamCopy
);

public record StatItem(string Number, string Label);

public record ContactContent(
    string AddressLine1,
    string AddressLine2,
    string AddressLine3,
    string Phone1,
    string Phone2,
    string Email1,
    string Email2,
    string HoursText,
    string[] SocialLinks,
    string BookingInfo
);

public record FooterContent(string Tagline, string CopyrightText);

public record LandingContent(
    string SiteName,
    HeroContent Hero,
    GalleryContent Gallery,
    InfoItem[] InfoStrip,
    AboutContent About,
    ContactContent Contact,
    FooterContent Footer,
    string BookYourSpotHeading,
    string BookYourSpotBody,
    string BookYourSpotCtaText
);
