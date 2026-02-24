import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subcategory } from '../../models/subcategory.model';
import { SubcategoryService } from '../../services/subcategory.service';
import { RouterLink } from "@angular/router";

@Component({ selector: 'app-subcategory-list', 
  standalone: true, 
  imports: [CommonModule, RouterLink], 
  templateUrl: './list.component.html', 
  styleUrls: ['./list.component.css'] })
  
export class SubcategoryListComponent implements OnInit {
  items: Subcategory[] = []; loading=false; error='';
  constructor(private s: SubcategoryService) {}
  ngOnInit(): void { this.s.getAll().subscribe({ next: d => this.items = d, error: ()=> this.error='Erreur' }); }
  deleteOne(id:number){ if(!confirm('Confirmer?')) return; this.s.delete(id).subscribe({ next: ()=> this.items = this.items.filter(x=> x.id!==id), error: ()=> this.error='Erreur' }); }
}
