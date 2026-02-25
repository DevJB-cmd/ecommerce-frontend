import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Product } from './pages/models/product.model';
import { Category } from './pages/models/category.model';
import { ProductService } from './pages/services/product.service';
import { CategoryService } from './pages/services/category.service';
import { PhotoService } from './pages/services/photo.service';
import { CartService } from './pages/services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="home-shop container">
      <article class="hero-shop card border-0 shadow-sm">
        <img *ngIf="currentHeroImage" [src]="currentHeroImage" alt="Banniere" class="hero-bg" />
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <p class="hero-discount">-50% sur les chemises</p>
          <h1>Elegance & Style</h1>
          <a class="btn btn-primary" routerLink="/products">Acheter maintenant</a>
        </div>
        <div class="hero-dots">
          <span *ngFor="let _ of heroImages; let i = index" [class.active]="i === heroIndex"></span>
        </div>
      </article>

      <section class="shop-section card border-0 shadow-sm">
        <div class="section-header">
          <h2>Produits en Vedette</h2>
        </div>
        <div class="featured-grid">
          <article class="featured-card" *ngFor="let p of featuredProducts" (click)="openProduct(p.id)">
            <div class="featured-img-wrap">
              <img *ngIf="productPhoto(p)" [src]="productPhoto(p)!" class="featured-img" alt="produit" />
              <div *ngIf="!productPhoto(p)" class="featured-img featured-placeholder">PHOTO</div>
            </div>
            <div class="featured-body">
              <h3>{{ p.name }}</h3>
              <div class="stars">*****</div>
              <div class="price-row">
                <strong>{{ p.price | number:'1.0-0' }} FCFA</strong>
                <button class="btn btn-sm btn-dark" (click)="addToCart(p, $event)">Ajouter</button>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section class="shop-section card border-0 shadow-sm">
        <div class="section-header">
          <h2>Categories Populaires</h2>
        </div>
        <div class="categories-row">
          <a class="category-box" *ngFor="let c of popularCategories" [routerLink]="['/products']" [queryParams]="{ category: c }">
            <span>{{ c }}</span>
            <small>&gt;</small>
          </a>
        </div>
      </section>

      <section class="shop-section card border-0 shadow-sm">
        <div class="section-header">
          <h2>Nouveautes</h2>
          <a class="btn btn-sm btn-outline-secondary" routerLink="/products">Voir tout</a>
        </div>
        <div class="new-grid">
          <article class="new-card" *ngFor="let p of newProducts" (click)="openProduct(p.id)">
            <img *ngIf="productPhoto(p)" [src]="productPhoto(p)!" class="new-img" alt="nouveau produit" />
            <div *ngIf="!productPhoto(p)" class="new-img featured-placeholder">PHOTO</div>
            <div class="new-body">
              <h3>{{ p.name }}</h3>
              <button class="btn btn-sm btn-outline-secondary" (click)="addToCart(p, $event)">Ajouter</button>
            </div>
          </article>
        </div>
      </section>

      <div *ngIf="addedMessage" class="cart-toast">{{ addedMessage }}</div>
    </section>
  `
})
export class HomeComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  categories: Category[] = [];
  featuredProducts: Product[] = [];
  newProducts: Product[] = [];
  popularCategories: string[] = [];
  heroImages: string[] = [];
  heroIndex = 0;
  addedMessage = '';
  private sliderTimer: any;
  private toastTimer: any;

  constructor(
    private productsService: ProductService,
    private categoriesService: CategoryService,
    private photos: PhotoService,
    private cart: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoriesService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories || [];
        this.popularCategories = this.categories.map(c => c.name).filter(Boolean).slice(0, 5);
      },
      error: () => {}
    });

    this.productsService.getAll().subscribe({
      next: (products) => {
        this.products = products || [];
        this.featuredProducts = this.products.slice(0, 5);
        this.newProducts = [...this.products].slice(-5).reverse();
        this.heroImages = this.featuredProducts
          .map(p => this.productPhoto(p))
          .filter((x): x is string => !!x);
        this.startSlider();
      },
      error: () => {}
    });
  }

  ngOnDestroy(): void {
    if (this.sliderTimer) clearInterval(this.sliderTimer);
    if (this.toastTimer) clearTimeout(this.toastTimer);
  }

  get currentHeroImage(): string | null {
    if (!this.heroImages.length) return null;
    return this.heroImages[this.heroIndex % this.heroImages.length];
  }

  productPhoto(product: Product): string | null {
    return this.photos.get('product', product.id) || product.imageUrl || null;
  }

  openProduct(id: number): void {
    this.router.navigate(['/products', id]);
  }

  addToCart(product: Product, event: Event): void {
    event.stopPropagation();
    this.cart.add(product, 1);
    this.addedMessage = `${product.name} ajoute au panier.`;
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => (this.addedMessage = ''), 1800);
  }

  private startSlider(): void {
    if (this.sliderTimer) clearInterval(this.sliderTimer);
    if (this.heroImages.length <= 1) return;
    this.sliderTimer = setInterval(() => {
      this.heroIndex = (this.heroIndex + 1) % this.heroImages.length;
    }, 5000);
  }
}
