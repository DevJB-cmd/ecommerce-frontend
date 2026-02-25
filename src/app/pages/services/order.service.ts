import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';
import { entityUrl } from './base.service';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private base = entityUrl('order');
  constructor(private http: HttpClient) {}
  getAll(): Observable<Order[]> { return this.http.get<Order[]>(`${this.base}/findAll`); }
  getById(id: number): Observable<Order> { return this.http.get<Order>(`${this.base}/findById/${id}`); }
  create(data: Partial<Order>): Observable<Order> { return this.http.post<Order>(`${this.base}/save`, data); }
  update(id: number, data: Order): Observable<Order> { return this.http.put<Order>(`${this.base}/update/${id}`, data); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/delete/${id}`); }
}
