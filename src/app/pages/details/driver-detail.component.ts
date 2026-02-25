import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DriverService } from '../services/driver.service';
import { PhotoService } from '../services/photo.service';
import { Driver } from '../models/driver.model';

@Component({
  selector: 'app-driver-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="container">
      <article class="card p-4" *ngIf="item">
        <h2 class="mb-3">Details chauffeur</h2>
        <div class="detail-layout">
          <img *ngIf="photo(item.id)" [src]="photo(item.id)!" class="detail-photo" alt="Photo chauffeur" />
          <div *ngIf="!photo(item.id)" class="detail-photo detail-photo-placeholder">Pas de photo</div>
          <div class="detail-grid">
            <div><strong>ID</strong><span>#{{ item.id }}</span></div>
            <div><strong>Numero permis</strong><span>{{ item.licenseNumber }}</span></div>
            <div><strong>Utilisateur</strong><span>{{ item.user?.firstName || '-' }} {{ item.user?.lastName || '' }}</span></div>
            <div><strong>Email</strong><span>{{ item.user?.email || '-' }}</span></div>
            <div><strong>Telephone</strong><span>{{ item.user?.phone || '-' }}</span></div>
          </div>
        </div>
      </article>
      <div *ngIf="loading" class="alert alert-secondary">Chargement...</div>
      <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
    </section>
  `
})
export class DriverDetailComponent implements OnInit {
  item: Driver | null = null;
  loading = false;
  error = '';

  constructor(private route: ActivatedRoute, private service: DriverService, private photos: PhotoService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error = 'Chauffeur introuvable.';
      return;
    }

    this.loading = true;
    this.service.getById(id).subscribe({
      next: (data) => {
        this.item = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur chargement chauffeur.';
        this.loading = false;
      }
    });
  }

  photo(id: number): string | null {
    return this.photos.get('driver', id);
  }
}
