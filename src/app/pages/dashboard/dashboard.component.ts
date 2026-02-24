import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/order.service';
import { UserService } from '../services/user.service';
import { CategoryService } from '../services/category.service';
import { ProviderService } from '../services/provider.service';
import { SubcategoryService } from '../services/subcategory.service';
import { ClientService } from '../services/client.service';
import { DriverService } from '../services/driver.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  loading = false;
  error = '';
  pendingRequests = 0;

  cards = [
    { key: 'users', label: 'Utilisateurs', count: 0, list: '/admin/users', create: '/admin/users/create' },
    { key: 'categories', label: 'Categories', count: 0, list: '/admin/categories', create: '/admin/categories/create' },
    { key: 'products', label: 'Produits', count: 0, list: '/admin/products', create: '/admin/products/create' },
    { key: 'providers', label: 'Fournisseurs', count: 0, list: '/admin/providers', create: '/admin/providers/create' },
    { key: 'subcategories', label: 'Sous-categories', count: 0, list: '/admin/subcategories', create: '/admin/subcategories/create' },
    { key: 'orders', label: 'Commandes', count: 0, list: '/admin/orders', create: '/admin/orders/create' },
    { key: 'clients', label: 'Clients', count: 0, list: '/admin/clients', create: '/admin/clients/create' },
    { key: 'drivers', label: 'Chauffeurs', count: 0, list: '/admin/drivers', create: '/admin/drivers/create' }
  ];

  recentOrders: Array<{ id: number; orderDate?: string; status?: string }> = [];

  constructor(
    private products: ProductService,
    private orders: OrderService,
    private users: UserService,
    private categories: CategoryService,
    private providers: ProviderService,
    private subcategories: SubcategoryService,
    private clients: ClientService,
    private drivers: DriverService
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading = true;
    this.error = '';
    this.pendingRequests = 8;

    this.loadCount('users', this.users.getAll());
    this.loadCount('categories', this.categories.getAll());
    this.loadCount('products', this.products.getAll());
    this.loadCount('providers', this.providers.getAll());
    this.loadCount('subcategories', this.subcategories.getAll());
    this.loadCount('clients', this.clients.getAll());
    this.loadCount('drivers', this.drivers.getAll());

    this.orders.getAll().subscribe({
      next: data => {
        const items = this.toItems<any>(data);
        this.setCount('orders', items.length);
        this.recentOrders = items.slice(0, 6);
        this.finishRequest();
      },
      error: () => {
        this.error = "Certaines donnees n'ont pas pu etre chargees.";
        this.finishRequest();
      }
    });
  }

  private setCount(key: string, count: number): void {
    const card = this.cards.find(c => c.key === key);
    if (card) card.count = Number.isFinite(count) ? count : 0;
  }

  private loadCount(key: string, request$: Observable<any>): void {
    request$.subscribe({
      next: data => {
        this.setCount(key, this.extractCount(data));
        this.finishRequest();
      },
      error: () => {
        this.error = "Certaines donnees n'ont pas pu etre chargees.";
        this.finishRequest();
      }
    });
  }

  private finishRequest(): void {
    this.pendingRequests -= 1;
    if (this.pendingRequests <= 0) {
      this.loading = false;
    }
  }

  private toItems<T>(payload: any): T[] {
    if (Array.isArray(payload)) return payload as T[];
    if (payload && Array.isArray(payload.content)) return payload.content as T[];
    if (payload && Array.isArray(payload.data)) return payload.data as T[];
    if (payload && Array.isArray(payload.items)) return payload.items as T[];
    return [];
  }

  private extractCount(payload: any): number {
    if (payload && typeof payload.totalElements === 'number') return payload.totalElements;
    if (payload && typeof payload.count === 'number') return payload.count;
    if (payload && typeof payload.total === 'number') return payload.total;
    return this.toItems<any>(payload).length;
  }
}
