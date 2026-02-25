import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartItem, CartService } from '../services/cart.service';
import { PhotoService } from '../services/photo.service';
import { AuthService } from '../services/auth.service';
import { ClientService } from '../services/client.service';
import { OrderService } from '../services/order.service';
import { Client } from '../models/client.model';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="container py-3">
      <article class="card p-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 class="m-0">Mon panier</h2>
          <span class="muted-chip">{{ itemCount }} article(s)</span>
        </div>

        <div *ngIf="!items.length" class="alert alert-secondary">
          Votre panier est vide. <a routerLink="/products">Voir les produits</a>
        </div>

        <div *ngIf="items.length" class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Prix</th>
                <th>Quantite</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of items">
                <td>
                  <div class="d-flex align-items-center gap-2">
                    <img *ngIf="photo(item.product.id)" class="entity-photo-thumb" [src]="photo(item.product.id)!" alt="photo produit" />
                    <span>{{ item.product.name }}</span>
                  </div>
                </td>
                <td>{{ item.product.price | number:'1.0-2' }} FCFA</td>
                <td>
                  <div class="d-flex align-items-center gap-2">
                    <button class="btn btn-sm btn-outline-secondary" (click)="decrease(item)">-</button>
                    <strong>{{ item.quantity }}</strong>
                    <button class="btn btn-sm btn-outline-secondary" (click)="increase(item)">+</button>
                  </div>
                </td>
                <td>{{ (item.product.price || 0) * item.quantity | number:'1.0-2' }} FCFA</td>
                <td>
                  <button class="btn btn-sm btn-danger" (click)="remove(item)">Retirer</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div *ngIf="items.length" class="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
          <div>
            <h4 class="m-0">Total: {{ total | number:'1.0-2' }} FCFA</h4>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-secondary" (click)="clearCart()">Vider le panier</button>
            <button class="btn btn-primary" (click)="checkout()" [disabled]="loading">Passer commande</button>
          </div>
        </div>

        <div *ngIf="message" class="alert alert-success mt-3">{{ message }}</div>
        <div *ngIf="error" class="alert alert-danger mt-3">{{ error }}</div>
      </article>
    </section>
  `
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];
  total = 0;
  itemCount = 0;
  loading = false;
  message = '';
  error = '';

  constructor(
    private cart: CartService,
    private photos: PhotoService,
    private auth: AuthService,
    private clients: ClientService,
    private orders: OrderService
  ) {}

  ngOnInit(): void {
    this.cart.items$.subscribe(items => {
      this.items = items;
      this.total = this.cart.subtotal();
      this.itemCount = this.cart.count;
    });
  }

  photo(id: number): string | null {
    return this.photos.get('product', id);
  }

  increase(item: CartItem): void {
    this.cart.update(item.product.id, item.quantity + 1);
  }

  decrease(item: CartItem): void {
    this.cart.update(item.product.id, item.quantity - 1);
  }

  remove(item: CartItem): void {
    this.cart.remove(item.product.id);
  }

  clearCart(): void {
    this.cart.clear();
  }

  checkout(): void {
    this.error = '';
    this.message = '';

    const user = this.auth.currentUser;
    if (!user) {
      this.error = 'Connectez-vous pour passer une commande.';
      return;
    }

    if (!this.items.length) {
      this.error = 'Votre panier est vide.';
      return;
    }

    this.loading = true;
    this.getOrCreateClient(user).subscribe({
      next: (client) => {
        const date = new Date().toISOString().slice(0, 10);
        const productIds = this.items.map(i => i.product.id).filter((id) => !!id);
        const payloads: any[] = [
          {
            orderDate: date,
            date,
            status: 'EN_ATTENTE',
            client: { id: client.id },
            products: productIds.map((id) => ({ id })),
            productIds
          },
          {
            orderDate: date,
            status: 'PENDING',
            client: { id: client.id },
            products: productIds.map((id) => ({ id }))
          },
          {
            date,
            status: 'PENDING',
            clientId: client.id,
            productIds
          },
          {
            orderDate: date,
            status: 'PENDING',
            client: { id: client.id }
          }
        ];

        this.tryCreateOrder(payloads, 0);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || err?.message || 'Impossible de preparer le client pour la commande.';
      }
    });
  }

  private getOrCreateClient(user: User): Observable<Client> {
    return new Observable<Client>((observer) => {
      this.clients.getAll().subscribe({
        next: (clients) => {
          const existing = (clients || []).find(c => c.user?.id === user.id);
          if (existing) {
            observer.next(existing);
            observer.complete();
            return;
          }
          const payload: Partial<Client> = {
            address: user.email ? `Adresse a completer - ${user.email}` : 'Adresse a completer',
            user: { id: user.id }
          };
          this.clients.create(payload).subscribe({
            next: (created) => {
              observer.next(created);
              observer.complete();
            },
            error: (err) => observer.error(err)
          });
        },
        error: (err) => observer.error(err)
      });
    });
  }

  private tryCreateOrder(payloads: any[], index: number): void {
    if (index >= payloads.length) {
      this.loading = false;
      this.error = 'Erreur lors de la commande. Le backend a rejete tous les formats envoyes.';
      return;
    }

    this.orders.create(payloads[index]).subscribe({
      next: () => {
        this.loading = false;
        this.message = 'Commande enregistree avec succes.';
        this.cart.clear();
      },
      error: (err) => {
        if (index < payloads.length - 1) {
          this.tryCreateOrder(payloads, index + 1);
          return;
        }
        this.loading = false;
        this.error = err?.error?.message || err?.message || 'Erreur lors de la commande.';
      }
    });
  }
}
