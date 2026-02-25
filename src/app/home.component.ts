import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
          <p class="hero-discount">Selection du moment</p>
          <h1>{{ heroProduct?.name || 'Elegance & Style' }}</h1>
          <div class="hero-meta" *ngIf="heroProduct as hp">
            <span class="hero-price-chip">{{ hp.price | number:'1.0-0' }} FCFA</span>
            <span class="hero-stock-chip">Stock: {{ hp.quantity }}</span>
          </div>
          <div class="hero-actions">
            <button class="btn btn-primary" type="button" *ngIf="heroProduct as hp" (click)="addToCart(hp, $event)">Ajouter au panier</button>
            <button class="btn btn-outline-light" type="button" *ngIf="heroProduct as hp" (click)="openProduct(hp.id)">Voir details</button>
          </div>
        </div>
        <div class="hero-dots">
          <span *ngFor="let _ of heroProducts; let i = index" [class.active]="i === heroIndex"></span>
        </div>
      </article>

      <section class="shop-section card border-0 shadow-sm">
        <div class="section-header">
          <h2>Produits en Vedette <small *ngIf="activeCategoryLabel">{{ activeCategoryLabel }}</small></h2>
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
          <a class="category-box" *ngFor="let c of popularCategories" [routerLink]="['/home']" [queryParams]="{ category: c }">
            <span>{{ c }}</span>
            <small>&gt;</small>
          </a>
        </div>
      </section>

      <section class="shop-section card border-0 shadow-sm">
        <div class="section-header">
          <h2>{{ sectionTitle }}</h2>
          <button class="btn btn-sm btn-outline-secondary" type="button" (click)="openCatalogBelow()">
            {{ catalogExpanded ? 'Voir plus bas' : 'Voir plus' }}
          </button>
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

      <section id="home-catalog-continue" class="shop-section card border-0 shadow-sm" *ngIf="catalogExpanded">
        <div class="section-header">
          <h2>Catalogue Produits</h2>
          <span class="muted-chip">{{ catalogVisibleProducts.length }} / {{ catalogPool.length }}</span>
        </div>
        <div class="catalog-grid">
          <article class="new-card" *ngFor="let p of catalogVisibleProducts" (click)="openProduct(p.id)">
            <img *ngIf="productPhoto(p)" [src]="productPhoto(p)!" class="new-img" alt="catalogue produit" />
            <div *ngIf="!productPhoto(p)" class="new-img featured-placeholder">PHOTO</div>
            <div class="new-body">
              <h3>{{ p.name }}</h3>
              <button class="btn btn-sm btn-outline-secondary" (click)="addToCart(p, $event)">Ajouter</button>
            </div>
          </article>
        </div>
        <div class="catalog-actions" *ngIf="canLoadMoreCatalog">
          <button class="btn btn-primary" type="button" (click)="loadMoreCatalog()">Charger plus de produits</button>
        </div>
      </section>

      <div *ngIf="!productsLoading && !catalogPool.length" class="alert alert-warning">
        Aucun produit trouve pour ce filtre.
      </div>

      <div *ngIf="addedMessage" class="cart-toast">{{ addedMessage }}</div>
    </section>
  `
})
export class HomeComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  featuredProducts: Product[] = [];
  newProducts: Product[] = [];
  popularCategories: string[] = [];
  heroProducts: Product[] = [];
  catalogPool: Product[] = [];
  catalogVisibleCount = 0;
  catalogStep = 10;
  catalogExpanded = false;
  heroIndex = 0;
  addedMessage = '';
  sectionTitle = 'Nouveautes';
  activeCategory = '';
  activeQuery = '';
  productsLoading = true;
  private sliderTimer: any;
  private toastTimer: any;

  constructor(
    private productsService: ProductService,
    private categoriesService: CategoryService,
    private photos: PhotoService,
    private cart: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.activeCategory = String(params.get('category') || '').trim();
      this.activeQuery = String(params.get('q') || '').trim();
      this.applyFilterView();
    });

    this.categoriesService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories || [];
        this.popularCategories = this.categories.map(c => c.name).filter(Boolean).slice(0, 5);
        this.applyFilterView();
      },
      error: () => {}
    });

    this.productsService.getAll().subscribe({
      next: (products) => {
        this.products = products || [];
        this.productsLoading = false;
        this.applyFilterView();
      },
      error: () => {
        this.productsLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.sliderTimer) clearInterval(this.sliderTimer);
    if (this.toastTimer) clearTimeout(this.toastTimer);
  }

  get currentHeroImage(): string | null {
    return this.heroProduct ? this.productPhoto(this.heroProduct) : null;
  }

  get heroProduct(): Product | null {
    if (!this.heroProducts.length) return null;
    return this.heroProducts[this.heroIndex % this.heroProducts.length];
  }

  get catalogVisibleProducts(): Product[] {
    return this.catalogPool.slice(0, this.catalogVisibleCount);
  }

  get canLoadMoreCatalog(): boolean {
    return this.catalogVisibleCount < this.catalogPool.length;
  }

  get activeCategoryLabel(): string {
    if (!this.activeCategory) return '';
    return `- ${this.activeCategory}`;
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

  openCatalogBelow(): void {
    if (!this.catalogExpanded) {
      this.catalogExpanded = true;
      this.catalogVisibleCount = Math.min(this.catalogStep, this.catalogPool.length);
      setTimeout(() => {
        try {
          document.getElementById('home-catalog-continue')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch {}
      }, 60);
      return;
    }
    try {
      document.getElementById('home-catalog-continue')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch {}
  }

  loadMoreCatalog(): void {
    this.catalogVisibleCount = Math.min(this.catalogVisibleCount + this.catalogStep, this.catalogPool.length);
  }

  private startSlider(): void {
    if (this.sliderTimer) clearInterval(this.sliderTimer);
    if (this.heroProducts.length <= 1) return;
    this.sliderTimer = setInterval(() => {
      this.heroIndex = (this.heroIndex + 1) % this.heroProducts.length;
    }, 5000);
  }

  private applyFilterView(): void {
    const q = this.activeQuery.toLowerCase();
    const cat = this.activeCategory.toLowerCase();
    this.filteredProducts = (this.products || []).filter((p) => {
      const name = String(p.name || '').toLowerCase();
      const provider = String(p.provider?.companyName || '').toLowerCase();
      const category = this.productCategory(p).toLowerCase();
      const textOk = !q || name.includes(q) || provider.includes(q) || category.includes(q);
      const categoryOk = !cat || category === cat;
      return textOk && categoryOk;
    });

    const source = this.filteredProducts;
    this.featuredProducts = source.slice(0, 5);
    this.newProducts = [...source].slice(-5).reverse();
    this.heroProducts = source.slice(0, 10);
    this.catalogPool = [...source];
    if (!this.catalogExpanded) {
      this.catalogVisibleCount = 0;
    } else {
      this.catalogVisibleCount = Math.min(Math.max(this.catalogVisibleCount, this.catalogStep), this.catalogPool.length);
    }

    this.heroIndex = 0;
    this.sectionTitle = this.computeSectionTitle();
    this.startSlider();
  }

  private productCategory(product: Product): string {
    if (typeof product.category === 'number') {
      return this.categories.find(c => c.id === product.category)?.name || '';
    }
    return String(product.subCategory?.category?.name || '');
  }

  private computeSectionTitle(): string {
    if (this.activeCategory) return `Nouveautes - ${this.activeCategory}`;
    if (this.activeQuery) return `Resultats - ${this.activeQuery}`;
    return 'Nouveautes';
  }
}
