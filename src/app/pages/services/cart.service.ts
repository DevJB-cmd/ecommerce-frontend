import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly key = 'cart_items';
  private readonly itemsSubject = new BehaviorSubject<CartItem[]>(this.read());
  readonly items$ = this.itemsSubject.asObservable();

  get items(): CartItem[] {
    return this.itemsSubject.value;
  }

  get count(): number {
    return this.items.reduce((sum, i) => sum + i.quantity, 0);
  }

  add(product: Product, quantity = 1): void {
    if (!product || !product.id || quantity <= 0) return;
    const items = [...this.items];
    const idx = items.findIndex(i => i.product.id === product.id);
    if (idx >= 0) {
      items[idx] = { ...items[idx], quantity: items[idx].quantity + quantity };
    } else {
      items.push({ product, quantity });
    }
    this.save(items);
  }

  update(productId: number, quantity: number): void {
    const items = [...this.items];
    const idx = items.findIndex(i => i.product.id === productId);
    if (idx < 0) return;

    if (quantity <= 0) {
      items.splice(idx, 1);
    } else {
      items[idx] = { ...items[idx], quantity };
    }
    this.save(items);
  }

  remove(productId: number): void {
    this.save(this.items.filter(i => i.product.id !== productId));
  }

  clear(): void {
    this.save([]);
  }

  subtotal(): number {
    return this.items.reduce((sum, i) => sum + ((i.product.price || 0) * i.quantity), 0);
  }

  private save(items: CartItem[]): void {
    try {
      localStorage.setItem(this.key, JSON.stringify(items));
    } catch {}
    this.itemsSubject.next(items);
  }

  private read(): CartItem[] {
    try {
      const raw = localStorage.getItem(this.key);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}
