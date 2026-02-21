import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';

@Component({ selector: 'app-category-list', standalone: true, imports: [CommonModule], templateUrl: './list.component.html', styleUrls: ['./list.component.css'] })
export class CategoryListComponent implements OnInit {
  items: Category[] = []; loading = false; message = ''; error = '';
  constructor(private s: CategoryService) {}
  ngOnInit(): void { this.load(); }
  load(): void { this.loading = true; this.s.getAll().subscribe({ next: d => { this.items = d; this.loading=false; }, error: () => { this.error='Erreur'; this.loading=false; } }); }
  deleteOne(id: number): void { if(!confirm('Confirmer?')) return; this.s.delete(id).subscribe({ next: ()=> this.load(), error: ()=> this.error='Erreur suppression' }); }
}
