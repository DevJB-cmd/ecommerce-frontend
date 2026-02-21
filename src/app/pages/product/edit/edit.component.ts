import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class ProductEditComponent implements OnInit {
  form: FormGroup;
  loading = false;
  message = '';
  error = '';
  id!: number;

  constructor(private fb: FormBuilder, private service: ProductService, private route: ActivatedRoute) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      price: [0, [Validators.required]],
      stock: [0, [Validators.required]],
      imageUrl: [''],
      category: [null]
    });
  }

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    if (param) {
      this.id = Number(param);
      this.service.getById(this.id).subscribe({
        next: (p) => this.form.patchValue(p),
        error: () => this.error = 'Erreur chargement'
      });
    }
  }

  submit(): void {
    if (this.form.invalid) { this.error = 'Formulaire invalide'; return; }
    this.loading = true;
    const payload = this.form.value as Product;
    this.service.update(this.id, payload).subscribe({
      next: () => { this.message = 'Modifié'; this.loading = false; },
      error: () => { this.error = 'Erreur mise à jour'; this.loading = false; }
    });
  }
}
