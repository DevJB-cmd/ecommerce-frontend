import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { entityUrl } from './base.service';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private base = entityUrl('products');
  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.base}/findAll`);
  }
  search(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.base}/search?q=${encodeURIComponent(query)}`);
  }
  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.base}/findById/${id}`);
  }
  create(data: Product): Observable<Product> {
    return this.http.post<Product>(`${this.base}/save`, data);
  }
  update(id: number, data: Product): Observable<Product> {
    return this.http.put<Product>(`${this.base}/update/${id}`, data);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/delete/${id}`);
  }
}
