import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  message = '';
  error = '';

  constructor(private service: ProductService, private router: Router) {}

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

  deleteOne(id: number): void {
    if (!confirm('Confirmer suppression ?')) { return; }
    this.service.delete(id).subscribe({
      next: () => { this.message = 'Supprimé'; this.load(); },
      error: () => { this.error = 'Erreur suppression'; }
    });
  }

  onEdit(id: number): void {
    this.router.navigate(['/product', 'edit', id]);
  }
}
