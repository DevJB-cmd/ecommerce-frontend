import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../services/product.service';
import { PhotoService } from '../services/photo.service';
import { Product } from '../models/product.model';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="container">
      <article class="card p-4" *ngIf="item">
        <h2 class="mb-3">Details produit</h2>
        <div class="detail-layout">
          <img *ngIf="photo(item.id)" [src]="photo(item.id)!" class="detail-photo" alt="Photo produit" />
          <div *ngIf="!photo(item.id)" class="detail-photo detail-photo-placeholder">Aucune photo</div>
          <div class="detail-grid">
            <div><strong>ID</strong><span>#{{ item.id }}</span></div>
            <div><strong>Nom</strong><span>{{ item.name }}</span></div>
            <div><strong>Prix</strong><span>{{ item.price | number:'1.0-2' }} EUR</span></div>
            <div><strong>Quantite</strong><span>{{ item.quantity }}</span></div>
            <div><strong>Fournisseur</strong><span>{{ item.provider?.companyName || '-' }}</span></div>
            <div><strong>Sous-categorie</strong><span>{{ item.subCategory?.name || '-' }}</span></div>
          </div>
        </div>
        <div class="mt-3 d-flex gap-2">
          <button class="btn btn-primary" (click)="addToCart(item)">Ajouter au panier</button>
          <a class="btn btn-outline-secondary" routerLink="/products">Retour produits</a>
        </div>
      </article>
      <div *ngIf="loading" class="alert alert-secondary">Chargement...</div>
      <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
    </section>
  `
})
export class ProductDetailComponent implements OnInit {
  item: Product | null = null;
  loading = false;
  error = '';

  constructor(private route: ActivatedRoute, private service: ProductService, private photos: PhotoService, private cart: CartService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error = 'Produit introuvable.';
      return;
    }

    this.loading = true;
    this.service.getById(id).subscribe({
      next: (data) => {
        this.item = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur chargement produit.';
        this.loading = false;
      }
    });
  }

  photo(id: number): string | null {
    return this.photos.get('product', id);
  }

  addToCart(product: Product): void {
    this.cart.add(product, 1);
  }
}
