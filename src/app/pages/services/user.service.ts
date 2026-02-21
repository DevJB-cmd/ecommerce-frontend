import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { entityUrl } from './base.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private base = entityUrl('user');
  constructor(private http: HttpClient) {}
  getAll(): Observable<User[]> { return this.http.get<User[]>(`${this.base}/findAll`); }
  getById(id: number): Observable<User> { return this.http.get<User>(`${this.base}/findById/${id}`); }
  create(data: User): Observable<User> { return this.http.post<User>(`${this.base}/save`, data); }
  update(id: number, data: User): Observable<User> { return this.http.put<User>(`${this.base}/update/${id}`, data); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/delete/${id}`); }
}
