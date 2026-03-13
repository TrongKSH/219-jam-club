import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

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

@Injectable({ providedIn: 'root' })
export class VenueService {
  private http = inject(HttpClient);

  private landing$ = this.http.get<LandingContent>('/api/content/landing').pipe(shareReplay(1));
  private events$ = this.http.get<EventItem[]>('/api/events').pipe(shareReplay(1));
  private upcoming$ = this.http.get<UpcomingShow[]>('/api/events/upcoming?count=3').pipe(shareReplay(1));

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
