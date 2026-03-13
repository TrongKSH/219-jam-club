import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type {
  HeroContent,
  GalleryContent,
  InfoItem,
  AboutContent,
  ContactContent,
  FooterContent,
  LandingContent,
  EventItem,
} from './venue.service';

export type ContentKey = 'hero' | 'gallery' | 'infoStrip' | 'about' | 'contact' | 'footer';

export interface EventCreate {
  date: string;
  day: string;
  band: string;
  genre: string;
  time: string;
  description?: string;
  posterUrl?: string;
  sortDate?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private http = inject(HttpClient);

  getLanding(): Observable<LandingContent> {
    return this.http.get<LandingContent>('/api/content/landing');
  }

  putContent(key: ContentKey, body: unknown): Observable<void> {
    return this.http.put<void>(`/api/content/${key}`, body);
  }

  getEvents(): Observable<EventItem[]> {
    return this.http.get<EventItem[]>('/api/events');
  }

  postEvent(body: EventCreate): Observable<{ id: number }> {
    return this.http.post<{ id: number }>('/api/events', body);
  }

  putEvent(id: number, body: EventCreate): Observable<void> {
    return this.http.put<void>(`/api/events/${id}`, body);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`/api/events/${id}`);
  }

  uploadImage(file: File): Observable<{ url: string }> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<{ url: string }>('/api/uploads', form);
  }
}
