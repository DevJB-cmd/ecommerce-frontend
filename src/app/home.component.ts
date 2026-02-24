import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from './pages/models/product.model';
import { Category } from './pages/models/category.model';
import { ProductService } from './pages/services/product.service';
import { CategoryService } from './pages/services/category.service';
import { PhotoService } from './pages/services/photo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="home-hero">
      <div class="hero-left">
        <p class="eyebrow">Premium commerce experience</p>
        <h1>Decouvrez les produits par categories</h1>
        <p class="hero-sub">
          Parcourez rapidement le catalogue avec visuels, categories et informations utiles.
        </p>
        <div class="hero-cta">
          <a class="btn btn-primary" routerLink="/products">Explorer les produits</a>
          <a class="btn btn-outline-secondary" routerLink="/categories">Voir les categories</a>
        </div>
      </div>

      <div class="hero-right">
        <article class="glass-card">
          <h3>Catalogue dynamique</h3>
          <p>Mise a jour automatique des elements en fonction de vos donnees backend.</p>
          <div class="kpis">
            <div><strong>{{ products.length }}</strong><span>Produits</span></div>
            <div><strong>{{ categories.length }}</strong><span>Categories</span></div>
            <div><strong>{{ productsWithPhoto }}</strong><span>Avec photo</span></div>
          </div>
        </article>
      </div>
    </section>

    <section class="feature-band">
      <div class="feature-item">Tri par categorie</div>
      <div class="feature-item">Fiches produits visuelles</div>
      <div class="feature-item">Navigation rapide</div>
      <div class="feature-item">Catalogue en temps reel</div>
    </section>

    <section class="spotlight">
      <h2>Produits disponibles</h2>

      <div *ngIf="loading" class="alert alert-secondary">Chargement des produits...</div>
      <div *ngIf="error" class="alert alert-danger">{{ error }}</div>

      <div class="home-products" *ngIf="!loading">
        <article class="home-product-card" *ngFor="let p of products | slice:0:12">
          <div class="home-product-image-wrap">
            <img *ngIf="productPhoto(p)" [src]="productPhoto(p)!" class="home-product-image" alt="Photo produit" />
            <div *ngIf="!productPhoto(p)" class="home-product-image home-product-placeholder">PHOTO</div>
          </div>

          <div class="home-product-body">
            <h3>{{ p.name }}</h3>
            <p class="home-product-category">Categorie: {{ categoryLabel(p) }}</p>
            <p class="home-product-price">{{ p.price | number:'1.0-2' }} EUR</p>
            <a class="btn btn-outline-secondary btn-sm" [routerLink]="['/products']">Voir</a>
          </div>
        </article>
      </div>
    </section>
  `
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  loading = false;
  error = '';

  constructor(
    private productsService: ProductService,
    private categoriesService: CategoryService,
    private photos: PhotoService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.error = '';

    this.productsService.getAll().subscribe({
      next: data => {
        this.products = this.toItems<Product>(data);
        this.loading = false;
      },
      error: () => {
        this.error = 'Impossible de charger les produits.';
        this.loading = false;
      }
    });

    this.categoriesService.getAll().subscribe({
      next: data => (this.categories = this.toItems<Category>(data)),
      error: () => {}
    });
  }

  get productsWithPhoto(): number {
    return this.products.filter(p => !!this.productPhoto(p)).length;
  }

  productPhoto(product: Product): string | null {
    return this.photos.get('product', product.id) || product.imageUrl || null;
  }

  categoryLabel(product: Product): string {
    if (product.subCategory?.name) return product.subCategory.name;
    if (typeof product.category === 'number') {
      return this.categories.find(c => c.id === product.category)?.name || '-';
    }
    return '-';
  }

  private toItems<T>(payload: any): T[] {
    if (Array.isArray(payload)) return payload as T[];
    if (payload && Array.isArray(payload.content)) return payload.content as T[];
    if (payload && Array.isArray(payload.data)) return payload.data as T[];
    if (payload && Array.isArray(payload.items)) return payload.items as T[];
    return [];
  }
}
