import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartItem, CartService } from '../services/cart.service';
import { PhotoService } from '../services/photo.service';
import { AuthService } from '../services/auth.service';
import { ClientService } from '../services/client.service';
import { OrderService } from '../services/order.service';

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
    this.clients.getAll().subscribe({
      next: (clients) => {
        const client = (clients || []).find(c => c.user?.id === user.id);
        if (!client) {
          this.loading = false;
          this.error = 'Aucun client lie a ce compte. Creez un client d abord.';
          return;
        }

        const payload: any = {
          orderDate: new Date().toISOString().slice(0, 10),
          status: 'EN_ATTENTE',
          client: { id: client.id },
          products: this.items.map(i => ({ id: i.product.id }))
        };

        this.orders.create(payload).subscribe({
          next: () => {
            this.loading = false;
            this.message = 'Commande enregistree avec succes.';
            this.cart.clear();
          },
          error: () => {
            // Fallback for backends that do not persist product lines yet.
            const fallbackPayload: any = {
              orderDate: payload.orderDate,
              status: payload.status,
              client: payload.client
            };
            this.orders.create(fallbackPayload).subscribe({
              next: () => {
                this.loading = false;
                this.message = 'Commande enregistree avec succes.';
                this.cart.clear();
              },
              error: (err2) => {
                this.loading = false;
                this.error = err2?.error?.message || err2?.message || 'Erreur lors de la commande.';
              }
            });
          }
        });
      },
      error: () => {
        this.loading = false;
        this.error = 'Impossible de verifier le client utilisateur.';
      }
    });
  }
}
