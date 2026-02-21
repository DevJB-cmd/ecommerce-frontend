import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gallery } from '../models/gallery.model';
import { entityUrl } from './base.service';

@Injectable({ providedIn: 'root' })
export class GalleryService {
  private base = entityUrl('gallery');
  constructor(private http: HttpClient) {}
  getAll(): Observable<Gallery[]> { return this.http.get<Gallery[]>(`${this.base}/findAll`); }
  getById(id: number): Observable<Gallery> { return this.http.get<Gallery>(`${this.base}/findById/${id}`); }
  create(data: Gallery): Observable<Gallery> { return this.http.post<Gallery>(`${this.base}/save`, data); }
  update(id: number, data: Gallery): Observable<Gallery> { return this.http.put<Gallery>(`${this.base}/update/${id}`, data); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/delete/${id}`); }
}
