import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { PhotoService } from '../../services/photo.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  message = '';
  error = '';
  query = '';

  constructor(
    private service: ProductService,
    private router: Router,
    public auth: AuthService,
    private photoService: PhotoService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (data) => { this.products = data; this.loading = false; },
      error: (err) => { this.error = 'Erreur chargement'; this.loading = false; }
    });
  }

  search() {
    const q = (this.query || '').trim().toLowerCase();
    this.loading = true;
    this.service.getAll().subscribe({
      next: d => {
        this.products = d.filter(
          p =>
            p.name?.toLowerCase().includes(q) ||
            p.provider?.companyName?.toLowerCase().includes(q) ||
            p.subCategory?.name?.toLowerCase().includes(q)
        );
        this.loading = false;
      },
      error: () => { this.error = 'Erreur recherche'; this.loading = false; }
    });
  }

  deleteOne(id: number): void {
    if (!confirm('Confirmer suppression ?')) { return; }
    this.service.delete(id).subscribe({
      next: () => { this.message = 'Supprimé'; this.load(); },
      error: () => { this.error = 'Erreur suppression'; }
    });
  }

  onEdit(id: number): void {
    this.router.navigate(['/admin','products','edit', id]);
  }

  photo(id: number): string | null {
    return this.photoService.get('product', id);
  }
}
