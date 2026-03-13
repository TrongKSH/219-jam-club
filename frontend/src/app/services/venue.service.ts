import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, combineLatest } from 'rxjs';
import { map, shareReplay, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface HeroContent {
  headline: string;
  headlineAccent: string;
  tagline: string;
  heroImageUrl: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
}

export interface GalleryContent {
  title: string;
  imageUrls: string[];
}

export interface InfoItem {
  title: string;
  description: string;
}

export interface AboutContent {
  heroImageUrl: string;
  storyParagraphs: string[];
  values: InfoItem[];
  stats: { number: string; label: string }[];
  teamCopy: string;
}

export interface ContactContent {
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  phone1: string;
  phone2: string;
  email1: string;
  email2: string;
  hoursText: string;
  socialLinks: string[];
  bookingInfo: string;
}

export interface FooterContent {
  tagline: string;
  copyrightText: string;
}

export interface LandingContent {
  siteName: string;
  hero: HeroContent;
  gallery: GalleryContent;
  infoStrip: InfoItem[];
  about: AboutContent;
  contact: ContactContent;
  footer: FooterContent;
  bookYourSpot: { heading: string; body: string; ctaText: string };
}

export interface EventItem {
  id: number;
  date: string;
  day: string;
  band: string;
  genre: string;
  time: string;
  description: string;
  posterUrl: string;
}

export interface UpcomingShow {
  date: string;
  day: string;
  band: string;
  genre: string;
  time: string;
}

/** Static content not managed in admin (hero, gallery, about, footer, etc.). */
const STATIC_LANDING: Omit<LandingContent, 'contact'> = {
  siteName: '219 JAM CLUB',
  hero: {
    headline: '219',
    headlineAccent: ' JAM CLUB',
    tagline: 'WHERE MUSIC COMES ALIVE',
    heroImageUrl: 'https://images.unsplash.com/photo-1647168285321-7509a33bf1d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZlJTIwbXVzaWMlMjB2ZW51ZSUyMHN0YWdlJTIwbGlnaHRzfGVufDF8fHx8MTc3MzE1MjA0MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    primaryCtaText: 'View Calendar',
    primaryCtaLink: '#calendar',
    secondaryCtaText: 'Contact Us',
    secondaryCtaLink: '#contact',
  },
  gallery: {
    title: 'THE VENUE',
    imageUrls: [
      'https://images.unsplash.com/photo-1669459846550-c60006acdec6?w=1080',
      'https://images.unsplash.com/photo-1552595458-e8ad6af8aa10?w=1080',
    ],
  },
  infoStrip: [
    { title: 'LIVE EVERY NIGHT', description: 'Experience the best local and touring acts 7 nights a week' },
    { title: '365 DAYS A YEAR', description: 'Never miss a night of incredible music at 219 Jam Club' },
    { title: 'PRIME LOCATION', description: 'Easy to find, impossible to forget' },
  ],
  about: {
    heroImageUrl: 'https://images.unsplash.com/photo-1766360884068-b83757593c2f?w=1080',
    storyParagraphs: [
      'Founded in the heart of the city, 219 Jam Club has been the premier destination for live music since day one. Our mission is simple: bring the best live music to our community every single night of the year.',
      "What started as a small underground venue has grown into a beloved institution where music lovers gather to experience unforgettable performances.",
      'Our intimate 200-capacity venue creates an electric atmosphere where artists and audiences connect on a deeper level.',
    ],
    values: [
      { title: 'LIVE MUSIC', description: 'Nothing beats the energy of live performance.' },
      { title: 'COMMUNITY', description: "We're more than a venue—we're a gathering place." },
      { title: 'PASSION', description: 'Every show is curated with love and dedication.' },
      { title: 'EXCELLENCE', description: 'We maintain the highest standards.' },
    ],
    stats: [
      { number: '365', label: 'Shows Per Year' },
      { number: '200', label: 'Capacity' },
      { number: '50+', label: 'Genres Hosted' },
      { number: '1000+', label: 'Artists Hosted' },
    ],
    teamCopy: 'Behind every great show is a dedicated team of music lovers. From our booking agents who discover incredible talent, to our sound engineers who ensure every note sounds perfect—everyone at 219 Jam Club is committed to creating unforgettable experiences.',
  },
  footer: {
    tagline: 'Your destination for live music every night.',
    copyrightText: '219 Jam Club. All rights reserved.',
  },
  bookYourSpot: {
    heading: 'BOOK YOUR SPOT',
    body: 'Reserve your table or contact us for group bookings',
    ctaText: 'Contact Us',
  },
};

const DEFAULT_CONTACT: ContactContent = {
  addressLine1: '219 Music Avenue',
  addressLine2: 'Downtown District',
  addressLine3: 'City, State 12345',
  phone1: '(555) 219-JAMZ',
  phone2: '(555) 219-5269',
  email1: 'info@219jamclub.com',
  email2: 'booking@219jamclub.com',
  hoursText: 'Monday - Sunday. Doors open at 7:00 PM. Show times vary (check calendar).',
  socialLinks: ['#', '#', '#', '#'],
  bookingInfo: 'Interested in performing? Send your EPK to booking@219jamclub.com with band name, genre, links to music, photos, bio, and preferred dates. We book 2-3 months in advance.',
};

@Injectable({ providedIn: 'root' })
export class VenueService {
  private http = inject(HttpClient);

  private apiBase = environment.apiBase;

  /** Only contact is loaded from API (admin-editable). Rest is static. */
  private contact$ = this.http.get<ContactContent>(`${this.apiBase}/api/content/contact`).pipe(
    catchError(() => of(DEFAULT_CONTACT)),
    shareReplay(1),
  );

  private landing$ = combineLatest([of(STATIC_LANDING), this.contact$]).pipe(
    map(([staticPart, contact]) => ({ ...staticPart, contact } as LandingContent)),
    shareReplay(1),
  );

  private events$ = this.http.get<EventItem[]>(`${this.apiBase}/api/events`).pipe(shareReplay(1));
  private upcoming$ = this.http.get<UpcomingShow[]>(`${this.apiBase}/api/events/upcoming?count=3`).pipe(shareReplay(1));

  getLanding(): Observable<LandingContent> {
    return this.landing$;
  }

  getEvents(): Observable<EventItem[]> {
    return this.events$;
  }

  getUpcomingShows(): Observable<UpcomingShow[]> {
    return this.upcoming$;
  }
}
