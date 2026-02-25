import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
import { PhotoService } from '../services/photo.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="container">
      <article class="card p-4" *ngIf="item">
        <h2 class="mb-3">Details utilisateur</h2>
        <div class="detail-layout">
          <img *ngIf="photo(item.id)" [src]="photo(item.id)!" class="detail-photo" alt="Photo utilisateur" />
          <div *ngIf="!photo(item.id)" class="detail-photo detail-photo-placeholder">Pas de photo</div>
          <div class="detail-grid">
            <div><strong>ID</strong><span>#{{ item.id }}</span></div>
            <div><strong>Email</strong><span>{{ item.email }}</span></div>
            <div><strong>Prenom</strong><span>{{ item.firstName || '-' }}</span></div>
            <div><strong>Nom</strong><span>{{ item.lastName || '-' }}</span></div>
            <div><strong>Telephone</strong><span>{{ item.phone || '-' }}</span></div>
            <div><strong>Roles</strong><span>{{ item.roles?.join(', ') || '-' }}</span></div>
          </div>
        </div>
      </article>
      <div *ngIf="loading" class="alert alert-secondary">Chargement...</div>
      <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
    </section>
  `
})
export class UserDetailComponent implements OnInit {
  item: User | null = null;
  loading = false;
  error = '';

  constructor(private route: ActivatedRoute, private service: UserService, private photos: PhotoService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error = 'Utilisateur introuvable.';
      return;
    }

    this.loading = true;
    this.service.getById(id).subscribe({
      next: (data) => {
        this.item = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur chargement utilisateur.';
        this.loading = false;
      }
    });
  }

  photo(id: number): string | null {
    return this.photos.get('user', id);
  }
}
