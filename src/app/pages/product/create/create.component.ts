import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class ProductCreateComponent {
  form: FormGroup;
  loading = false;
  message = '';
  error = '';

  constructor(private fb: FormBuilder, private service: ProductService) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      price: [0, [Validators.required]],
      stock: [0, [Validators.required]],
      imageUrl: ['', [Validators.required]],
      category: [null]
    });
  }

  submit(): void {
    if (this.form.invalid) { this.error = 'Formulaire invalide'; return; }
    this.loading = true;
    const payload = this.form.value as Product;
    this.service.create(payload).subscribe({
      next: () => { this.message = 'Produit créé'; this.loading = false; this.form.reset(); },
      error: () => { this.error = 'Erreur création'; this.loading = false; }
    });
  }
}
