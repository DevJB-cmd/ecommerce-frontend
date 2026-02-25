import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="container">
      <article class="card p-4 profile-card" *ngIf="auth.currentUser as user; else notConnected">
        <div class="profile-head">
          <img *ngIf="avatar(user.id)" [src]="avatar(user.id)!" class="profile-avatar" alt="Avatar" />
          <div *ngIf="!avatar(user.id)" class="profile-avatar profile-avatar-fallback">{{ initials(user.firstName, user.lastName, user.email) }}</div>
          <div>
            <h2 class="m-0">{{ user.firstName || 'Utilisateur' }} {{ user.lastName || '' }}</h2>
            <p class="text-muted mb-0">{{ user.email }}</p>
          </div>
        </div>

        <div class="profile-grid mt-4">
          <div><strong>ID</strong><span>#{{ user.id }}</span></div>
          <div><strong>Telephone</strong><span>{{ user.phone || '-' }}</span></div>
          <div><strong>Roles</strong><span>{{ user.roles?.join(', ') || 'USER' }}</span></div>
        </div>

        <div class="mt-4 d-flex gap-2">
          <a class="btn btn-primary" routerLink="/settings">Modifier mes informations</a>
          <a class="btn btn-outline-secondary" routerLink="/home">Retour accueil</a>
        </div>
      </article>

      <ng-template #notConnected>
        <article class="card p-4">
          <h3>Session non connectee</h3>
          <p>Connectez-vous pour consulter votre profil.</p>
          <a class="btn btn-primary" routerLink="/auth/login">Se connecter</a>
        </article>
      </ng-template>
    </section>
  `
})
export class ProfileComponent {
  constructor(public auth: AuthService, private photos: PhotoService) {}

  avatar(userId?: number): string | null {
    if (!userId) return null;
    return this.photos.get('user', userId);
  }

  initials(firstName?: string | null, lastName?: string | null, email?: string): string {
    const first = (firstName || '').trim();
    const last = (lastName || '').trim();
    if (first || last) return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
    return String(email || 'U').charAt(0).toUpperCase();
  }
}
