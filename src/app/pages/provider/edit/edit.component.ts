import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProviderService } from '../../services/provider.service';
import { PhotoService } from '../../services/photo.service';

@Component({ selector: 'app-provider-edit', standalone: true, imports:[CommonModule, ReactiveFormsModule], templateUrl: './edit.component.html', styleUrls: ['./edit.component.css'] })
export class ProviderEditComponent implements OnInit {
  form: any; error=''; message=''; loading = false; id = 0;
  photoPreview: string | null = null;
  photoError = '';

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private s: ProviderService, private photoService: PhotoService, private router: Router){
    this.form = this.fb.group({ companyName:['', Validators.required], phone:[''], photoUrl: [''] });
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id') || '0');
    this.form.patchValue({ photoUrl: this.photoService.get('provider', this.id) || '' });
    this.s.getById(this.id).subscribe({
      next: (d: any) => this.form.patchValue({ companyName: d.companyName, phone: d.phone }),
      error: ()=> this.error='Erreur chargement fournisseur'
    });
  }

  submit(){
    if(this.form.invalid){ this.error='Formulaire invalide'; return; }
    this.loading = true;
    this.s.update(this.id, { id: this.id, companyName: this.form.value.companyName, phone: this.form.value.phone }).subscribe({
      next: ()=> {
        this.savePhoto();
        this.loading = false;
        this.message='Fournisseur modifie';
        this.router.navigate(['/admin','providers']);
      },
      error: ()=> { this.loading = false; this.error='Erreur mise a jour fournisseur'; }
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
    if (this.id) this.photoService.remove('provider', this.id);
  }

  private savePhoto(): void {
    const manualUrl = String(this.form.value.photoUrl || '').trim();
    const source = this.photoPreview || manualUrl;
    if (!source) return;
    this.photoService.set('provider', this.id, source);
  }
}
