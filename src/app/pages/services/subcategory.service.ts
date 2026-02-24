import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subcategory } from '../models/subcategory.model';
import { entityUrl } from './base.service';

@Injectable({ providedIn: 'root' })
export class SubcategoryService {
  private base = entityUrl('subcategory');
  constructor(private http: HttpClient) {}
  getAll(): Observable<Subcategory[]> { return this.http.get<Subcategory[]>(`${this.base}/findAll`); }
  getById(id: number): Observable<Subcategory> { return this.http.get<Subcategory>(`${this.base}/findById/${id}`); }
  create(data: Partial<Subcategory>): Observable<Subcategory> { return this.http.post<Subcategory>(`${this.base}/save`, data); }
  update(id: number, data: Subcategory): Observable<Subcategory> { return this.http.put<Subcategory>(`${this.base}/update/${id}`, data); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/delete/${id}`); }
}
