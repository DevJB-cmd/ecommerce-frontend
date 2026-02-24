import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
@Component({ selector: 'app-category-create', standalone: true, imports: [CommonModule, ReactiveFormsModule], templateUrl: './create.component.html', styleUrls: ['./create.component.css'] })
export class CategoryCreateComponent {
  form: FormGroup; message=''; error=''; loading=false;
  constructor(private fb: FormBuilder, private s: CategoryService, private router: Router){
    this.form = this.fb.group({ name: ['', [Validators.required, Validators.minLength(2)]], description: [''] });
  }
  submit(){
    if(this.form.invalid){ this.error='Formulaire invalide'; return; }
    this.loading=true;
    const payload = this.form.value as Category;
    this.s.create(payload).subscribe({
      next: ()=>{
        this.message='Créé';
        this.loading=false;
        this.form.reset();
        this.router.navigate(['/admin','categories']);
      },
      error: ()=>{ this.error='Erreur'; this.loading=false }
    });
  }
}
