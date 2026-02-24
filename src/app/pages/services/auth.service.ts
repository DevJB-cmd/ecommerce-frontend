import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = 'http://localhost:8081';
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';
  private _user$ = new BehaviorSubject<User | null>(this.loadUser());

  readonly user$ = this._user$.asObservable();

  constructor(private http: HttpClient) {}

  register(payload: Partial<User>) {
    return this.http.post<{ token: string; user: User }>(`${this.base}/auth/register`, payload).pipe(
      tap(res => this.saveSession(res.token, res.user))
    );
  }

  login(email: string, password: string) {
    return this.http.post<{ token: string; user: User }>(`${this.base}/auth/login`, { email, password }).pipe(
      tap(res => this.saveSession(res.token, res.user))
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this._user$.next(null);
  }

  private saveSession(token: string, user: User) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this._user$.next(user);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  get currentUser(): User | null {
    return this._user$.value;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const u = this.currentUser;
    return !!u && Array.isArray(u.roles) && u.roles.includes('ADMIN');
  }

  private loadUser(): User | null {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') return null;
    } catch {
      return null;
    }
    const raw = localStorage.getItem(this.userKey);
    if (!raw) return null;
    try { return JSON.parse(raw) as User; } catch { return null; }
  }
}
