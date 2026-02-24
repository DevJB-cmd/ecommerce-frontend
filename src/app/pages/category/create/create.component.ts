import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-category-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CategoryCreateComponent {
  form: FormGroup;
  message = '';
  error = '';
  loading = false;

  constructor(private fb: FormBuilder, private s: CategoryService, private router: Router) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.error = 'Formulaire invalide';
      return;
    }

    this.loading = true;
    this.error = '';
    this.message = '';

    const payload: Partial<Category> = {
      name: String(this.form.value.name || '').trim()
    };

    this.s.create(payload).subscribe({
      next: () => {
        this.message = 'Categorie creee avec succes';
        this.loading = false;
        this.form.reset();
        this.router.navigate(['/admin', 'categories']);
      },
      error: (err: HttpErrorResponse) => {
        const backendMessage = typeof err.error === 'string'
          ? err.error
          : err.error?.message || err.message;
        this.error = backendMessage || 'Erreur lors de la creation de la categorie';
        this.loading = false;
      }
    });
  }
}
