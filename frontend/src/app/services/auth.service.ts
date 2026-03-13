import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

const TOKEN_KEY = 'venue_admin_token';

export interface LoginResponse {
  token: string;
  expiresAt?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private tokenSignal = signal<string | null>(this.getStoredToken());

  token = this.tokenSignal.asReadonly();
  isLoggedIn = computed(() => !!this.tokenSignal());

  private getStoredToken(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  login(username: string, password: string) {
    return this.http
      .post<LoginResponse>('/api/auth/login', { username, password })
      .pipe(
        tap((res: LoginResponse) => {
          if (res.token) {
            this.tokenSignal.set(res.token);
            localStorage.setItem(TOKEN_KEY, res.token);
          }
        })
      );
  }

  logout(): void {
    this.tokenSignal.set(null);
    localStorage.removeItem(TOKEN_KEY);
    this.router.navigate(['/admin/login']);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }
}
