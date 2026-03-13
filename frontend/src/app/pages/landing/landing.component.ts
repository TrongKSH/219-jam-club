import { Component, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { VenueService, type EventItem, type LandingContent, type UpcomingShow } from '../../services/venue.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent {
  private venue = inject(VenueService);

  landing = this.venue.getLanding();
  events = this.venue.getEvents();
  upcoming = this.venue.getUpcomingShows();

  mobileMenuOpen = signal(false);
  selectedGig = signal<EventItem | null>(null);

  navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Calendar', href: '#calendar' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  scrollTo(href: string) {
    this.mobileMenuOpen.set(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  }

  openGig(gig: EventItem) {
    this.selectedGig.set(gig);
  }

  closeGig() {
    this.selectedGig.set(null);
  }
}
