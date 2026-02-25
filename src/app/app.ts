import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagesModule } from './pages/pages.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/auth.interceptor';
import { AuthService } from './pages/services/auth.service';
import { PhotoService } from './pages/services/photo.service';
import { User } from './pages/models/user.model';
import { CartService } from './pages/services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterModule, PagesModule, HttpClientModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('ecommerce-frontend');
  readonly year = new Date().getFullYear();
  theme: 'light' | 'dark' = 'light';
  searchTerm = '';
  cartCount = 0;
  newsletterEmail = '';
  newsletterMessage = '';

  constructor(private auth: AuthService, private photos: PhotoService, private router: Router, private cart: CartService) {
    this.theme = this.readStoredTheme();
    this.applyTheme(this.theme);
    this.cart.items$.subscribe(() => {
      this.cartCount = this.cart.count;
    });
  }

  get user$() { return this.auth.user$; }

  logout() { this.auth.logout(); }

  isAdmin(user: User | null | undefined): boolean {
    return !!user && Array.isArray(user.roles) && user.roles.includes('ADMIN');
  }

  userAvatar(user: User | null | undefined): string | null {
    return this.photos.get('user', user?.id);
  }

  userInitials(user: User | null | undefined): string {
    if (!user) return 'U';
    const first = String(user.firstName || '').trim();
    const last = String(user.lastName || '').trim();
    if (first || last) return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
    return String(user.email || 'U').charAt(0).toUpperCase();
  }

  toggleTheme(): void {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.applyTheme(this.theme);
    try {
      localStorage.setItem('theme_mode', this.theme);
    } catch {}
  }

  searchProducts(): void {
    const q = String(this.searchTerm || '').trim();
    this.router.navigate(['/products'], { queryParams: q ? { q } : {} });
  }

  subscribeNewsletter(): void {
    const email = String(this.newsletterEmail || '').trim();
    if (!email) return;
    this.newsletterMessage = `Inscription enregistree pour ${email}`;
    this.newsletterEmail = '';
    setTimeout(() => (this.newsletterMessage = ''), 2500);
  }

  private readStoredTheme(): 'light' | 'dark' {
    try {
      const v = localStorage.getItem('theme_mode');
      return v === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  }

  private applyTheme(mode: 'light' | 'dark'): void {
    try {
      document.documentElement.setAttribute('data-theme', mode);
    } catch {}
  }
}
