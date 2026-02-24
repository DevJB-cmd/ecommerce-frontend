import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { Provider } from '../../models/provider.model';
import { Subcategory } from '../../models/subcategory.model';
import { ProviderService } from '../../services/provider.service';
import { SubcategoryService } from '../../services/subcategory.service';
import { PhotoService } from '../../services/photo.service';

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
    private route: ActivatedRoute,
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
  }

  ngOnInit(): void {
    this.loadDependencies();
    const param = this.route.snapshot.paramMap.get('id');
    if (param) {
      this.id = Number(param);
      this.form.patchValue({ photoUrl: this.photoService.get('product', this.id) || '' });
      this.service.getById(this.id).subscribe({
        next: p =>
          this.form.patchValue({
            name: p.name,
            price: p.price,
            quantity: p.quantity,
            providerId: p.provider?.id ?? null,
            subCategoryId: p.subCategory?.id ?? null
          }),
        error: () => (this.error = 'Erreur chargement')
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.error = 'Formulaire invalide';
      return;
    }
    this.loading = true;
    const value = this.form.value;
    const payload: Product = {
      id: this.id,
      name: value.name,
      price: Number(value.price),
      quantity: Number(value.quantity),
      provider: value.providerId ? { id: Number(value.providerId) } : null,
      subCategory: value.subCategoryId ? { id: Number(value.subCategoryId) } : null
    };

    this.service.update(this.id, payload).subscribe({
      next: () => {
        this.savePhoto();
        this.message = 'Modifie';
        this.loading = false;
        this.router.navigate(['/admin', 'products']);
      },
      error: () => {
        this.error = 'Erreur mise a jour';
        this.loading = false;
      }
    });
  }

  private loadDependencies(): void {
    this.providerService.getAll().subscribe({ next: data => (this.providers = data) });
    this.subCategoryService.getAll().subscribe({ next: data => (this.subCategories = data) });
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
    if (this.id) this.photoService.remove('product', this.id);
  }

  private savePhoto(): void {
    const manualUrl = String(this.form.value.photoUrl || '').trim();
    const source = this.photoPreview || manualUrl;
    if (!source) return;
    this.photoService.set('product', this.id, source);
  }
}
