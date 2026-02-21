import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/order.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalProducts = 0;
  totalOrders = 0;
  totalUsers = 0;
  recentOrders: any[] = [];
  loading = false;

  constructor(private p: ProductService, private o: OrderService, private u: UserService) {}

  ngOnInit(): void {
    this.loading = true;
    this.p.getAll().subscribe({ next: products => { this.totalProducts = products.length; }, error: () => {} });
    this.o.getAll().subscribe({ next: orders => { this.totalOrders = orders.length; this.recentOrders = orders.slice(0,5); }, error: () => {} });
    this.u.getAll().subscribe({ next: users => { this.totalUsers = users.length; this.loading = false; }, error: () => { this.loading = false; } });
  }
}
