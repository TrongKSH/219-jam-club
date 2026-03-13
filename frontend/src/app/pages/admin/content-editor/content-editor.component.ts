import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormArray } from '@angular/forms';
import { AdminApiService } from '../../../services/admin-api.service';
import type { ContactContent } from '../../../services/venue.service';

@Component({
  selector: 'app-content-editor',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './content-editor.component.html',
  styleUrl: './content-editor.component.css',
})
export class ContentEditorComponent implements OnInit {
  private api = inject(AdminApiService);
  private fb = inject(FormBuilder);

  message = signal<{ type: 'success' | 'error'; text: string } | null>(null);
  loading = signal(true);

  contactForm = this.fb.nonNullable.group({
    addressLine1: [''],
    addressLine2: [''],
    addressLine3: [''],
    phone1: [''],
    phone2: [''],
    email1: [''],
    email2: [''],
    hoursText: [''],
    socialLinks: this.fb.nonNullable.array<string>([]),
    bookingInfo: [''],
  });

  ngOnInit(): void {
    this.api.getLanding().subscribe({
      next: (data) => {
        this.patchContact(data.contact);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  private patchContact(c: ContactContent): void {
    this.contactForm.patchValue({
      addressLine1: c.addressLine1,
      addressLine2: c.addressLine2,
      addressLine3: c.addressLine3,
      phone1: c.phone1,
      phone2: c.phone2,
      email1: c.email1,
      email2: c.email2,
      hoursText: c.hoursText,
      bookingInfo: c.bookingInfo,
    });
    const arr = this.contactForm.get('socialLinks') as FormArray;
    arr.clear();
    c.socialLinks?.forEach((url: string) => arr.push(this.fb.nonNullable.control(url)));
  }

  saveContact(): void {
    this.message.set(null);
    this.api.putContent('contact', this.contactForm.getRawValue()).subscribe({
      next: () => this.message.set({ type: 'success', text: 'Contact info saved.' }),
      error: () => this.message.set({ type: 'error', text: 'Failed to save contact info.' }),
    });
  }

  addSocialLink(): void {
    (this.contactForm.get('socialLinks') as FormArray).push(this.fb.nonNullable.control(''));
  }

  removeSocialLink(i: number): void {
    (this.contactForm.get('socialLinks') as FormArray).removeAt(i);
  }

  get socialLinks(): FormArray {
    return this.contactForm.get('socialLinks') as FormArray;
  }
}
