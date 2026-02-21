import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Driver } from '../models/driver.model';
import { entityUrl } from './base.service';

@Injectable({ providedIn: 'root' })
export class DriverService {
  private base = entityUrl('driver');
  constructor(private http: HttpClient) {}
  getAll(): Observable<Driver[]> { return this.http.get<Driver[]>(`${this.base}/findAll`); }
  getById(id: number): Observable<Driver> { return this.http.get<Driver>(`${this.base}/findById/${id}`); }
  create(data: Driver): Observable<Driver> { return this.http.post<Driver>(`${this.base}/save`, data); }
  update(id: number, data: Driver): Observable<Driver> { return this.http.put<Driver>(`${this.base}/update/${id}`, data); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/delete/${id}`); }
}
