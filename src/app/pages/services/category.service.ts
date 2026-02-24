import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { entityUrl } from './base.service';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private base = entityUrl('categories');
  constructor(private http: HttpClient) {}
  getAll(): Observable<Category[]> { return this.http.get<Category[]>(`${this.base}/findAll`); }
  search(query: string): Observable<Category[]> { return this.http.get<Category[]>(`${this.base}/search?q=${encodeURIComponent(query)}`); }
  getById(id: number): Observable<Category> { return this.http.get<Category>(`${this.base}/findById/${id}`); }
  create(data: Partial<Category>): Observable<Category> { return this.http.post<Category>(`${this.base}/save`, data); }
  update(id: number, data: Category): Observable<Category> { return this.http.put<Category>(`${this.base}/update/${id}`, data); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/delete/${id}`); }
}
