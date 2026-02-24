import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProviderService } from '../../services/provider.service';
import { PhotoService } from '../../services/photo.service';

@Component({ selector: 'app-provider-create', standalone: true, imports:[CommonModule, ReactiveFormsModule], templateUrl: './create.component.html', styleUrls: ['./create.component.css'] })
export class ProviderCreateComponent {
  form: any; error=''; message=''; loading = false;
  photoPreview: string | null = null;
  photoError = '';
  constructor(private fb: FormBuilder, private s: ProviderService, private photoService: PhotoService, private router: Router) {
    this.form = this.fb.group({ companyName: ['', Validators.required], phone: [''], photoUrl: [''] });
  }
  submit(){
    if(this.form.invalid){ this.error='Formulaire invalide'; return; }
    this.loading = true;
    this.s.create({ id: 0, companyName: this.form.value.companyName, phone: this.form.value.phone }).subscribe({
      next: (created)=> {
        this.photoService.set('provider', created?.id, this.photoPreview || String(this.form.value.photoUrl || '').trim());
        this.loading = false;
        this.message='Fournisseur cree';
        this.photoPreview = null;
        this.photoError = '';
        this.router.navigate(['/admin','providers']);
      },
      error: ()=> { this.loading = false; this.error='Erreur creation fournisseur'; }
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
}
