import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';
 
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({ selector: 'app-category-list', standalone: true, imports: [CommonModule, RouterModule, FormsModule], templateUrl: './list.component.html', styleUrls: ['./list.component.css'] })
export class CategoryListComponent implements OnInit {
  items: Category[] = []; loading = false; message = ''; error = ''; query = '';
  constructor(private s: CategoryService, public auth: AuthService) {}
  ngOnInit(): void { this.load(); }
  load(): void { this.loading = true; this.s.getAll().subscribe({ next: d => { this.items = d; this.loading=false; }, error: () => { this.error='Erreur'; this.loading=false; } }); }
  search(): void {
    const q = (this.query || '').trim().toLowerCase();
    this.loading = true;
    this.s.getAll().subscribe({ next: d => { this.items = d.filter(c => c.name?.toLowerCase().includes(q) || (c.description||'').toLowerCase().includes(q)); this.loading = false; }, error: () => { this.error = 'Erreur recherche'; this.loading = false; } });
  }
  deleteOne(id: number): void { if(!confirm('Confirmer?')) return; this.s.delete(id).subscribe({ next: ()=> this.load(), error: ()=> this.error='Erreur suppression' }); }
}
