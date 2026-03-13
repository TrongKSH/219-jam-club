import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AdminApiService } from '../../../services/admin-api.service';
import type { EventItem } from '../../../services/venue.service';

@Component({
  selector: 'app-events-manager',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './events-manager.component.html',
  styleUrl: './events-manager.component.css',
})
export class EventsManagerComponent implements OnInit {
  private api = inject(AdminApiService);
  private fb = inject(FormBuilder);

  events = signal<EventItem[]>([]);
  loading = signal(true);
  message = signal<{ type: 'success' | 'error'; text: string } | null>(null);
  editingId = signal<number | null>(null);
  posterUploading = signal(false);
  posterUrl = signal<string>('');

  eventForm = this.fb.nonNullable.group({
    dateTime: [''],
    band: [''],
    genre: [''],
    description: [''],
    posterUrl: [''],
  });

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading.set(true);
    this.api.getEvents().subscribe({
      next: (list) => {
        this.events.set(list);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  add(): void {
    this.editingId.set(null);
    this.posterUrl.set('');
    this.eventForm.reset({
      dateTime: '',
      band: '',
      genre: '',
      description: '',
      posterUrl: '',
    });
  }

  edit(event: EventItem): void {
    this.editingId.set(event.id);
    const dateTime = this.eventDisplayToDateTimeLocal(event.date, event.time);
    this.posterUrl.set(event.posterUrl ?? '');
    this.eventForm.patchValue({
      dateTime,
      band: event.band,
      genre: event.genre,
      description: event.description,
      posterUrl: event.posterUrl,
    });
  }

  /** Convert API date (e.g. "March 12") + time (e.g. "9:00 PM") to datetime-local value. */
  private eventDisplayToDateTimeLocal(dateStr: string, timeStr: string): string {
    if (!dateStr?.trim() || !timeStr?.trim()) return '';
    const d = this.parseDisplayDateAndTime(dateStr.trim(), timeStr.trim());
    return d ? this.toDateTimeLocal(d) : '';
  }

  private parseDisplayDateAndTime(dateStr: string, timeStr: string): Date | null {
    // Parse "March 12" (MMMM d)
    const datePart = new Date(dateStr + ' ' + new Date().getFullYear());
    if (isNaN(datePart.getTime())) return null;
    let year = datePart.getFullYear();
    if (datePart < new Date() && datePart.getMonth() <= new Date().getMonth())
      year += 1;
    // Parse "9:00 PM" (h:mm a)
    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    let hours = 0, minutes = 0;
    if (match) {
      hours = parseInt(match[1], 10) % 12;
      minutes = parseInt(match[2], 10);
      if ((match[3] || '').toUpperCase() === 'PM') hours += 12;
    }
    const d = new Date(year, datePart.getMonth(), datePart.getDate(), hours, minutes, 0, 0);
    return isNaN(d.getTime()) ? null : d;
  }

  private toDateTimeLocal(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${day}T${h}:${min}`;
  }

  /** From datetime-local value to API date, day, time and optional sortDate. */
  private dateTimeLocalToApi(dateTimeLocal: string): { date: string; day: string; time: string; sortDate: string } | null {
    if (!dateTimeLocal?.trim()) return null;
    const d = new Date(dateTimeLocal);
    if (isNaN(d.getTime())) return null;
    const date = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    const day = d.toLocaleDateString('en-US', { weekday: 'long' });
    const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const sortDate = d.toISOString();
    return { date, day, time, sortDate };
  }

  cancel(): void {
    this.editingId.set(null);
  }

  save(): void {
    const id = this.editingId();
    const body = this.eventForm.getRawValue();
    const parsed = this.dateTimeLocalToApi(body.dateTime);
    if (!parsed) {
      this.message.set({ type: 'error', text: 'Please pick a date and time.' });
      return;
    }
    const payload = {
      date: parsed.date,
      day: parsed.day,
      band: body.band,
      genre: body.genre,
      time: parsed.time,
      description: body.description || undefined,
      posterUrl: body.posterUrl || undefined,
      sortDate: parsed.sortDate,
    };
    this.message.set(null);
    if (id != null) {
      this.api.putEvent(id, payload).subscribe({
        next: () => {
          this.message.set({ type: 'success', text: 'Event updated.' });
          this.editingId.set(null);
          this.loadEvents();
        },
        error: () => this.message.set({ type: 'error', text: 'Failed to update event.' }),
      });
    } else {
      this.api.postEvent(payload).subscribe({
        next: () => {
          this.message.set({ type: 'success', text: 'Event added.' });
          this.editingId.set(null);
          this.loadEvents();
        },
        error: () => this.message.set({ type: 'error', text: 'Failed to add event.' }),
      });
    }
  }

  onPosterUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.message.set(null);
    this.posterUploading.set(true);
    this.api.uploadImage(file).subscribe({
      next: (res) => {
        this.eventForm.patchValue({ posterUrl: res.url });
        this.posterUrl.set(res.url);
        this.posterUploading.set(false);
        this.message.set({ type: 'success', text: 'Poster uploaded from your computer. Save the gig to keep it.' });
      },
      error: () => {
        this.posterUploading.set(false);
        this.message.set({ type: 'error', text: 'Upload failed. Check file type (jpg, png, gif, webp) and try again.' });
      },
    });
    input.value = '';
  }

  delete(event: EventItem): void {
    if (!confirm(`Delete "${event.band}"?`)) return;
    this.message.set(null);
    this.api.deleteEvent(event.id).subscribe({
      next: () => {
        this.message.set({ type: 'success', text: 'Event deleted.' });
        if (this.editingId() === event.id) this.editingId.set(null);
        this.loadEvents();
      },
      error: () => this.message.set({ type: 'error', text: 'Failed to delete event.' }),
    });
  }
}
