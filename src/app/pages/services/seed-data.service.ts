import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_BASE } from './base.service';
import { PhotoService } from './photo.service';
import { Category } from '../models/category.model';
import { Subcategory } from '../models/subcategory.model';
import { Provider } from '../models/provider.model';
import { Product } from '../models/product.model';
import { Client } from '../models/client.model';
import { User } from '../models/user.model';

export interface SeedSummary {
  categoriesCreated: number;
  subcategoriesCreated: number;
  providersCreated: number;
  usersCreated: number;
  clientsCreated: number;
  productsCreated: number;
  ordersCreated: number;
}

@Injectable({ providedIn: 'root' })
export class SeedDataService {
  constructor(private http: HttpClient, private photos: PhotoService) {}

  async seedLargeDemoData(): Promise<SeedSummary> {
    const summary: SeedSummary = {
      categoriesCreated: 0,
      subcategoriesCreated: 0,
      providersCreated: 0,
      usersCreated: 0,
      clientsCreated: 0,
      productsCreated: 0,
      ordersCreated: 0
    };

    const categories = await this.ensureCategories(summary);
    const subcategories = await this.ensureSubcategories(categories, summary);
    const providers = await this.ensureProviders(summary);
    const users = await this.ensureUsers(summary);
    const clients = await this.ensureClients(users, summary);
    const products = await this.ensureProducts(providers, subcategories, summary);
    await this.ensureOrders(clients, products, summary);

    return summary;
  }

  private async ensureCategories(summary: SeedSummary): Promise<Category[]> {
    const wanted = ['Vetements', 'Chaussures', 'Accessoires', 'Sport', 'Maison', 'Tech', 'Beaute', 'Enfants'];
    const existing = await this.fetchList<Category>(`${API_BASE}/categories/findAll`);
    const byName = new Set(existing.map(c => String(c.name || '').toLowerCase()));

    for (const name of wanted) {
      if (byName.has(name.toLowerCase())) continue;
      const created = await this.safePost<Category>(`${API_BASE}/categories/save`, { name });
      if (created) {
        summary.categoriesCreated += 1;
        existing.push(created);
        byName.add(name.toLowerCase());
      }
    }
    return existing;
  }

  private async ensureSubcategories(categories: Category[], summary: SeedSummary): Promise<Subcategory[]> {
    const wanted: Array<{ name: string; category: string }> = [
      { name: 'T-shirts', category: 'Vetements' },
      { name: 'Pantalons', category: 'Vetements' },
      { name: 'Robes', category: 'Vetements' },
      { name: 'Sneakers', category: 'Chaussures' },
      { name: 'Sandales', category: 'Chaussures' },
      { name: 'Sacs', category: 'Accessoires' },
      { name: 'Montres', category: 'Accessoires' },
      { name: 'Fitness', category: 'Sport' },
      { name: 'Cuisine', category: 'Maison' },
      { name: 'Smartphones', category: 'Tech' },
      { name: 'Audio', category: 'Tech' },
      { name: 'Parfum', category: 'Beaute' },
      { name: 'Jouets', category: 'Enfants' }
    ];

    const existing = await this.fetchList<Subcategory>(`${API_BASE}/subcategories/findAll`);
    const keys = new Set(existing.map(s => `${String(s.name || '').toLowerCase()}::${s.category?.id || 0}`));

    for (const item of wanted) {
      const category = categories.find(c => String(c.name || '').toLowerCase() === item.category.toLowerCase());
      if (!category?.id) continue;
      const key = `${item.name.toLowerCase()}::${category.id}`;
      if (keys.has(key)) continue;

      const created = await this.safePost<Subcategory>(`${API_BASE}/subcategories/save`, {
        name: item.name,
        category: { id: category.id }
      });
      if (created) {
        summary.subcategoriesCreated += 1;
        existing.push(created);
        keys.add(key);
      }
    }
    return existing;
  }

  private async ensureProviders(summary: SeedSummary): Promise<Provider[]> {
    const companies = [
      'Atlas Mode', 'Nova Shoes', 'Urban Factory', 'Pulse Sport', 'Maison Alpha', 'TechLink',
      'Beauty Craft', 'Kids Planet', 'Trendline', 'Global Select', 'Prime Goods', 'Elite Market'
    ];
    const existing = await this.fetchList<Provider>(`${API_BASE}/providers/findAll`);
    const byName = new Set(existing.map(p => String(p.companyName || p.name || '').toLowerCase()));

    for (let i = 0; i < companies.length; i += 1) {
      const companyName = companies[i];
      if (byName.has(companyName.toLowerCase())) continue;

      const created = await this.safePost<Provider>(`${API_BASE}/providers/save`, {
        companyName,
        phone: `+22890000${String(100 + i)}`
      });
      if (created?.id) {
        summary.providersCreated += 1;
        existing.push(created);
        byName.add(companyName.toLowerCase());
        this.photos.set('provider', created.id, this.providerPhoto(i));
      }
    }
    return existing;
  }

  private async ensureUsers(summary: SeedSummary): Promise<User[]> {
    const existing = await this.fetchList<User>(`${API_BASE}/users/findAll`);
    const needed = Math.max(0, 26 - existing.length);
    if (!needed) return existing;

    const firstNames = ['Aminata', 'Jean', 'Koffi', 'Mireille', 'Sami', 'Nora', 'Paul', 'Lea', 'Ibrahim', 'Anna'];
    const lastNames = ['Kossi', 'Mensah', 'Diallo', 'Toure', 'Smith', 'Brown', 'Garcia', 'Lopez', 'Johnson', 'Lee'];
    const token = Date.now();

    for (let i = 0; i < needed; i += 1) {
      const firstName = firstNames[i % firstNames.length];
      const lastName = lastNames[i % lastNames.length];
      const email = `demo.user.${token}.${i}@chezjb.test`;
      const registered = await this.safePost<{ user?: User }>(`${API_BASE}/auth/register`, {
        firstName,
        lastName,
        email,
        password: 'Demo1234!'
      });
      const user = registered?.user;
      if (!user?.id) continue;

      summary.usersCreated += 1;
      existing.push(user);
      this.photos.set('user', user.id, `https://i.pravatar.cc/300?img=${(i % 70) + 1}`);
    }

    return existing;
  }

  private async ensureClients(users: User[], summary: SeedSummary): Promise<Client[]> {
    const existing = await this.fetchList<Client>(`${API_BASE}/clients/findAll`);
    const linkedUserIds = new Set<number>(
      existing.map(c => c.user?.id).filter((id): id is number => typeof id === 'number')
    );

    const candidates = users.filter(u => !!u.id && !linkedUserIds.has(u.id)).slice(0, 20);
    for (let i = 0; i < candidates.length; i += 1) {
      const user = candidates[i];
      const created = await this.safePost<Client>(`${API_BASE}/clients/save`, {
        address: `Quartier Demo ${i + 1}, Lome`,
        user: { id: user.id }
      });
      if (!created?.id) continue;

      summary.clientsCreated += 1;
      existing.push(created);
      linkedUserIds.add(user.id);
      this.photos.set('client', created.id, `https://picsum.photos/seed/client-${user.id}/400/400`);
    }
    return existing;
  }

  private async ensureProducts(
    providers: Provider[],
    subcategories: Subcategory[],
    summary: SeedSummary
  ): Promise<Product[]> {
    const existing = await this.fetchList<Product>(`${API_BASE}/products/findAll`);
    const needed = Math.max(0, 80 - existing.length);
    if (!needed || !providers.length || !subcategories.length) return existing;

    const labels = ['Premium', 'Urban', 'Classic', 'Smart', 'Eco', 'Pro', 'Deluxe', 'Street'];
    const nouns = ['Pack', 'Edition', 'Series', 'Collection', 'Model', 'Set', 'Style', 'Line'];

    for (let i = 0; i < needed; i += 1) {
      const provider = providers[i % providers.length];
      const subCategory = subcategories[i % subcategories.length];
      if (!provider?.id || !subCategory?.id) continue;

      const name = `${subCategory.name || 'Produit'} ${labels[i % labels.length]} ${nouns[i % nouns.length]} ${i + 1}`;
      const created = await this.safePost<Product>(`${API_BASE}/products/save`, {
        name,
        price: 3500 + ((i * 650) % 90000),
        quantity: 5 + (i % 40),
        provider: { id: provider.id },
        subCategory: { id: subCategory.id }
      });

      if (!created?.id) continue;

      summary.productsCreated += 1;
      existing.push(created);
      this.photos.set('product', created.id, this.productPhoto(i));
    }

    return existing;
  }

  private async ensureOrders(clients: Client[], products: Product[], summary: SeedSummary): Promise<void> {
    const existing = await this.fetchList<any>(`${API_BASE}/orders/findAll`);
    const needed = Math.max(0, 40 - existing.length);
    if (!needed || !clients.length) return;

    for (let i = 0; i < needed; i += 1) {
      const client = clients[i % clients.length];
      if (!client?.id) continue;

      const date = this.randomDate(i);
      const candidateProducts = products.slice(i % Math.max(products.length - 3, 1), (i % Math.max(products.length - 3, 1)) + 3)
        .filter(p => !!p.id)
        .map(p => ({ id: p.id }));

      const payloads = [
        { orderDate: date, status: 'EN_ATTENTE', client: { id: client.id }, products: candidateProducts },
        { orderDate: date, status: 'PENDING', client: { id: client.id }, products: candidateProducts },
        { date, status: 'PENDING', client: { id: client.id } },
        { orderDate: date, status: 'PENDING', clientId: client.id }
      ];

      let created: any = null;
      for (const payload of payloads) {
        created = await this.safePost<any>(`${API_BASE}/orders/save`, payload);
        if (created) break;
      }
      if (!created?.id) continue;

      summary.ordersCreated += 1;
      this.photos.set('order', created.id, `https://picsum.photos/seed/order-${created.id}/600/400`);
    }
  }

  private randomDate(i: number): string {
    const now = new Date();
    const d = new Date(now.getTime() - (i % 25) * 24 * 60 * 60 * 1000);
    return d.toISOString().slice(0, 10);
  }

  private providerPhoto(i: number): string {
    return `https://picsum.photos/seed/provider-${i + 1}/400/400`;
  }

  private productPhoto(i: number): string {
    return `https://picsum.photos/seed/product-${i + 1}/900/900`;
  }

  private async fetchList<T>(url: string): Promise<T[]> {
    try {
      const data = await firstValueFrom(this.http.get<any>(url));
      if (Array.isArray(data)) return data as T[];
      if (data && Array.isArray(data.content)) return data.content as T[];
      if (data && Array.isArray(data.data)) return data.data as T[];
      if (data && Array.isArray(data.items)) return data.items as T[];
      return [];
    } catch {
      return [];
    }
  }

  private async safePost<T>(url: string, payload: any): Promise<T | null> {
    try {
      return await firstValueFrom(this.http.post<T>(url, payload));
    } catch {
      return null;
    }
  }
}
