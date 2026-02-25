import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { ProductService } from '../../services/product.service';
import { PhotoService } from '../../services/photo.service';
import { CategoryService } from '../../services/category.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filtered: Product[] = [];
  loading = false;
  message = '';
  error = '';

  query = '';
  selectedCategory = '';
  selectedProvider = '';
  sortBy: 'name' | 'priceAsc' | 'priceDesc' = 'name';

  categories: string[] = [];
  providers: string[] = [];
  categoriesData: Category[] = [];

  constructor(
    private service: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    public auth: AuthService,
    private photoService: PhotoService,
    private cart: CartService
  ) {}

  ngOnInit(): void {
    this.load();

    this.route.queryParamMap.subscribe(params => {
      this.query = params.get('q') || '';
      this.selectedCategory = params.get('category') || '';
      this.applyFilters();
    });
  }

  load(): void {
    this.loading = true;
    this.categoryService.getAll().subscribe({
      next: (c) => {
        this.categoriesData = c || [];
        this.buildFacets();
        this.applyFilters();
      },
      error: () => {}
    });
    this.service.getAll().subscribe({
      next: (data) => {
        this.products = data || [];
        this.buildFacets();
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur chargement';
        this.loading = false;
      }
    });
  }

  search(): void {
    const q = String(this.query || '').trim();
    const category = String(this.selectedCategory || '').trim();
    this.router.navigate(['/products'], { queryParams: { q: q || null, category: category || null }, queryParamsHandling: '' });
    this.applyFilters();
  }

  applyFilters(): void {
    const q = String(this.query || '').trim().toLowerCase();
    const cat = String(this.selectedCategory || '').trim().toLowerCase();
    const prov = String(this.selectedProvider || '').trim().toLowerCase();

    let result = [...this.products].filter(p => {
      const name = String(p.name || '').toLowerCase();
      const provider = String(p.provider?.companyName || '').toLowerCase();
      const category = String(this.categoryOf(p) || '').toLowerCase();

      const textOk = !q || name.includes(q) || provider.includes(q) || category.includes(q);
      const catOk = !cat || category === cat;
      const provOk = !prov || provider === prov;
      return textOk && catOk && provOk;
    });

    if (this.sortBy === 'priceAsc') result.sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (this.sortBy === 'priceDesc') result.sort((a, b) => (b.price || 0) - (a.price || 0));
    else result.sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));

    this.filtered = result;
  }

  clearFilters(): void {
    this.query = '';
    this.selectedCategory = '';
    this.selectedProvider = '';
    this.sortBy = 'name';
    this.router.navigate(['/products']);
    this.applyFilters();
  }

  deleteOne(id: number): void {
    if (!confirm('Confirmer suppression ?')) return;
    this.service.delete(id).subscribe({
      next: () => {
        this.message = 'Produit supprime';
        this.load();
      },
      error: () => {
        this.error = 'Erreur suppression';
      }
    });
  }

  onEdit(id: number): void {
    this.router.navigate(['/admin', 'products', 'edit', id]);
  }

  photo(id: number): string | null {
    return this.photoService.get('product', id);
  }

  detailsLink(id: number): any[] {
    return this.auth.isAdmin() ? ['/admin', 'products', 'details', id] : ['/products', id];
  }

  addToCart(product: Product): void {
    this.cart.add(product, 1);
    this.message = `${product.name} ajoute au panier`;
    setTimeout(() => (this.message = ''), 1500);
  }

  private buildFacets(): void {
    this.categories = Array.from(new Set((this.products || []).map(p => this.categoryOf(p)).filter(Boolean))).sort();
    this.providers = Array.from(new Set((this.products || []).map(p => p.provider?.companyName || '').filter(Boolean))).sort();
  }

  categoryOf(product: Product): string {
    if (typeof product.category === 'number') {
      return this.categoriesData.find(c => c.id === product.category)?.name || 'Sans categorie';
    }
    return product.subCategory?.category?.name || 'Sans categorie';
  }
}
