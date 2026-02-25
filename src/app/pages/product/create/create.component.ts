import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { Provider } from '../../models/provider.model';
import { Subcategory } from '../../models/subcategory.model';
import { ProviderService } from '../../services/provider.service';
import { SubcategoryService } from '../../services/subcategory.service';
import { PhotoService } from '../../services/photo.service';

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
  providers: Provider[] = [];
  subCategories: Subcategory[] = [];
  photoPreview: string | null = null;
  photoError = '';

  constructor(
    private fb: FormBuilder,
    private service: ProductService,
    private providerService: ProviderService,
    private subCategoryService: SubcategoryService,
    private photoService: PhotoService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      price: [0, [Validators.required]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      providerId: [null, [Validators.required]],
      subCategoryId: [null, [Validators.required]],
      photoUrl: ['']
    });
    this.loadDependencies();
  }

  submit(): void {
    if (this.form.invalid) {
      this.error = 'Formulaire invalide';
      return;
    }
    this.loading = true;
    const value = this.form.value;
    const payload: Partial<Product> = {
      name: value.name,
      price: Number(value.price),
      quantity: Number(value.quantity),
      provider: value.providerId ? { id: Number(value.providerId) } : null,
      subCategory: value.subCategoryId ? { id: Number(value.subCategoryId) } : null
    };

    this.service.create(payload).subscribe({
      next: created => {
        const createdId = created?.id ?? 0;
        this.savePhoto(createdId);
        this.message = 'Produit cree';
        this.loading = false;
        this.form.reset();
        this.photoPreview = null;
        this.photoError = '';
        this.router.navigate(['/admin', 'products']);
      },
      error: () => {
        this.error = 'Erreur creation';
        this.loading = false;
      }
    });
  }

  onPhotoFileSelected(event: Event): void {
    this.photoError = '';
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.photoError = 'Veuillez choisir une image valide.';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => (this.photoPreview = String(reader.result || ''));
    reader.onerror = () => (this.photoError = 'Impossible de lire le fichier image.');
    reader.readAsDataURL(file);
  }

  clearPhoto(): void {
    this.form.patchValue({ photoUrl: '' });
    this.photoPreview = null;
    this.photoError = '';
  }

  private savePhoto(id: number): void {
    const manualUrl = String(this.form.value.photoUrl || '').trim();
    const source = this.photoPreview || manualUrl;
    if (!source) return;
    this.photoService.set('product', id, source);
  }

  private loadDependencies(): void {
    this.providerService.getAll().subscribe({ next: data => (this.providers = data) });
    this.subCategoryService.getAll().subscribe({ next: data => (this.subCategories = data) });
  }
}
