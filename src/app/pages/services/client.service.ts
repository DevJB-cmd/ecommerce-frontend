import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/client.model';
import { entityUrl } from './base.service';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private base = entityUrl('client');
  constructor(private http: HttpClient) {}
  getAll(): Observable<Client[]> { return this.http.get<Client[]>(`${this.base}/findAll`); }
  getById(id: number): Observable<Client> { return this.http.get<Client>(`${this.base}/findById/${id}`); }
  create(data: Partial<Client>): Observable<Client> { return this.http.post<Client>(`${this.base}/save`, data); }
  update(id: number, data: Client): Observable<Client> { return this.http.put<Client>(`${this.base}/update/${id}`, data); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/delete/${id}`); }
}
