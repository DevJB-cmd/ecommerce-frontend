import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubcategoryService } from '../../services/subcategory.service';
import { CategoryService } from '../../services/category.service';
import { Subcategory } from '../../models/subcategory.model';
import { Category } from '../../models/category.model';

@Component({ selector: 'app-subcategory-edit', standalone: true, imports: [CommonModule, ReactiveFormsModule], templateUrl: './edit.component.html', styleUrls: ['./edit.component.css'] })
export class SubcategoryEditComponent implements OnInit {
  form: FormGroup; id!: number; message=''; error=''; loading=false;
  categories: Category[] = [];

  constructor(private fb: FormBuilder, private s: SubcategoryService, private c: CategoryService, private route: ActivatedRoute, private router: Router){
    this.form = this.fb.group({ name:['', Validators.required], categoryId:[null, Validators.required] });
  }

  ngOnInit(): void {
    this.c.getAll().subscribe({ next: d => this.categories = d });
    const p = this.route.snapshot.paramMap.get('id');
    if(p){
      this.id = Number(p);
      this.s.getById(this.id).subscribe({
        next: d => this.form.patchValue({ name: d.name, categoryId: d.category?.id }),
        error: ()=> this.error='Erreur chargement sous-categorie'
      });
    }
  }

  submit(){
    if(this.form.invalid){ this.error='Formulaire invalide'; return; }
    this.loading=true;
    const v = this.form.value;
    const payload: Subcategory = { id: this.id, name: v.name, category: { id: Number(v.categoryId) } };
    this.s.update(this.id, payload).subscribe({
      next: ()=>{ this.message='Sous-categorie modifiee'; this.loading=false; this.router.navigate(['/admin','subcategories']); },
      error: ()=>{ this.error='Erreur mise a jour sous-categorie'; this.loading=false; }
    });
  }
}
