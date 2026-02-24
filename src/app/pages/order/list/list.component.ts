import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { PhotoService } from '../../services/photo.service';

@Component({ selector: 'app-order-list', standalone: true, imports: [CommonModule, RouterModule], templateUrl: './list.component.html', styleUrls: ['./list.component.css'] })
export class OrderListComponent implements OnInit {
  items: Order[] = []; loading=false; error=''; message='';
  constructor(private s: OrderService, private photoService: PhotoService) {}
  ngOnInit(): void { this.load(); }
  load(){ this.loading=true; this.s.getAll().subscribe({ next: d => { this.items = d; this.loading=false; }, error: ()=> { this.error='Erreur'; this.loading=false } }); }
  deleteOne(id:number){ if(!confirm('Confirmer?')) return; this.s.delete(id).subscribe({ next: ()=> this.load(), error: ()=> this.error='Erreur suppression' }); }
  photo(id: number): string | null { return this.photoService.get('order', id); }
}
