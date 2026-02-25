import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProviderService } from '../services/provider.service';
import { PhotoService } from '../services/photo.service';
import { Provider } from '../models/provider.model';

@Component({
  selector: 'app-provider-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="container">
      <article class="card p-4" *ngIf="item">
        <h2 class="mb-3">Details fournisseur</h2>
        <div class="detail-layout">
          <img *ngIf="photo(item.id)" [src]="photo(item.id)!" class="detail-photo" alt="Photo fournisseur" />
          <div *ngIf="!photo(item.id)" class="detail-photo detail-photo-placeholder">Pas de photo</div>
          <div class="detail-grid">
            <div><strong>ID</strong><span>#{{ item.id }}</span></div>
            <div><strong>Societe</strong><span>{{ item.companyName || item.name || '-' }}</span></div>
            <div><strong>Telephone</strong><span>{{ item.phone || '-' }}</span></div>
          </div>
        </div>
      </article>
      <div *ngIf="loading" class="alert alert-secondary">Chargement...</div>
      <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
    </section>
  `
})
export class ProviderDetailComponent implements OnInit {
  item: Provider | null = null;
  loading = false;
  error = '';

  constructor(private route: ActivatedRoute, private service: ProviderService, private photos: PhotoService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error = 'Fournisseur introuvable.';
      return;
    }

    this.loading = true;
    this.service.getById(id).subscribe({
      next: (data) => {
        this.item = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur chargement fournisseur.';
        this.loading = false;
      }
    });
  }

  photo(id: number): string | null {
    return this.photos.get('provider', id);
  }
}
