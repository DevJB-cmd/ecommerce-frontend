import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Provider } from '../models/provider.model';
import { entityUrl } from './base.service';

@Injectable({ providedIn: 'root' })
export class ProviderService {
  private base = entityUrl('provider');
  constructor(private http: HttpClient) {}
  getAll(): Observable<Provider[]> { return this.http.get<Provider[]>(`${this.base}/findAll`); }
  getById(id: number): Observable<Provider> { return this.http.get<Provider>(`${this.base}/findById/${id}`); }
  create(data: Partial<Provider>): Observable<Provider> { return this.http.post<Provider>(`${this.base}/save`, data); }
  update(id: number, data: Provider): Observable<Provider> { return this.http.put<Provider>(`${this.base}/update/${id}`, data); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/delete/${id}`); }
}
