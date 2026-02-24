import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubcategoryService } from '../../services/subcategory.service';
import { CategoryService } from '../../services/category.service';
import { Subcategory } from '../../models/subcategory.model';
import { Category } from '../../models/category.model';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({ selector: 'app-subcategory-create', standalone: true, imports: [CommonModule, ReactiveFormsModule], templateUrl: './create.component.html', styleUrls: ['./create.component.css'] })
export class SubcategoryCreateComponent {
  form: FormGroup; message=''; error=''; loading=false;
  categories: Category[] = [];

  constructor(private fb: FormBuilder, private s: SubcategoryService, private c: CategoryService, private router: Router){
    this.form = this.fb.group({ name:['', [Validators.required]], categoryId:[null, [Validators.required]] });
    this.c.getAll().subscribe({ next: d => this.categories = d });
  }

  submit(){
    if(this.form.invalid){ this.error='Formulaire invalide'; return; }
    this.error = '';
    this.message = '';
    this.loading=true;
    const v = this.form.value;
    const payload: Partial<Subcategory> = { name: String(v.name || '').trim(), category: { id: Number(v.categoryId) } };
    this.s.create(payload).subscribe({
      next: ()=>{ this.message='Sous-categorie creee'; this.loading=false; this.router.navigate(['/admin','subcategories']); },
      error: (err: HttpErrorResponse)=>{
        const backendMessage = typeof err.error === 'string'
          ? err.error
          : err.error?.message || err.message;
        this.error = backendMessage || 'Erreur creation sous-categorie';
        this.loading=false;
      }
    });
  }
}
