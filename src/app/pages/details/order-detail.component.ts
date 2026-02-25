import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrderService } from '../services/order.service';
import { PhotoService } from '../services/photo.service';
import { Order } from '../models/order.model';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="container">
      <article class="card p-4" *ngIf="item">
        <h2 class="mb-3">Details commande</h2>
        <div class="detail-layout">
          <img *ngIf="photo(item.id)" [src]="photo(item.id)!" class="detail-photo" alt="Photo commande" />
          <div *ngIf="!photo(item.id)" class="detail-photo detail-photo-placeholder">Pas de photo</div>
          <div class="detail-grid">
            <div><strong>ID</strong><span>#{{ item.id }}</span></div>
            <div><strong>Date</strong><span>{{ item.orderDate }}</span></div>
            <div><strong>Statut</strong><span>{{ item.status }}</span></div>
            <div><strong>Client</strong><span>{{ item.client?.id || '-' }}</span></div>
            <div><strong>Adresse client</strong><span>{{ item.client?.address || '-' }}</span></div>
            <div><strong>Produits lies</strong><span>{{ item.products?.length || 0 }}</span></div>
          </div>
        </div>
      </article>
      <div *ngIf="loading" class="alert alert-secondary">Chargement...</div>
      <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
    </section>
  `
})
export class OrderDetailComponent implements OnInit {
  item: Order | null = null;
  loading = false;
  error = '';

  constructor(private route: ActivatedRoute, private service: OrderService, private photos: PhotoService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error = 'Commande introuvable.';
      return;
    }

    this.loading = true;
    this.service.getById(id).subscribe({
      next: (data) => {
        this.item = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur chargement commande.';
        this.loading = false;
      }
    });
  }

  photo(id: number): string | null {
    return this.photos.get('order', id);
  }
}
