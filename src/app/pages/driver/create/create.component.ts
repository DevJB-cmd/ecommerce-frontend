import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DriverService } from '../../services/driver.service';
import { UserService } from '../../services/user.service';
import { Driver } from '../../models/driver.model';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { PhotoService } from '../../services/photo.service';

@Component({ selector: 'app-driver-create', standalone: true, imports: [CommonModule, ReactiveFormsModule], templateUrl: './create.component.html', styleUrls: ['./create.component.css'] })
export class DriverCreateComponent {
  form: FormGroup; message=''; error=''; loading=false;
  users: User[] = [];
  photoPreview: string | null = null;
  photoError = '';

  constructor(
    private fb: FormBuilder,
    private s: DriverService,
    private usersService: UserService,
    private photoService: PhotoService,
    private router: Router
  ){
    this.form = this.fb.group({ licenseNumber:['', [Validators.required]], userId:[null, [Validators.required]], photoUrl: [''] });
    this.usersService.getAll().subscribe({ next: d => this.users = d });
  }

  submit(){
    if(this.form.invalid){ this.error='Formulaire invalide'; return; }
    this.loading=true;
    const v = this.form.value;
    const payload: Driver = { id: 0, licenseNumber: v.licenseNumber, user: { id: Number(v.userId) } };
    this.s.create(payload).subscribe({
      next: (created)=>{
        this.photoService.set('driver', created?.id, this.photoPreview || String(v.photoUrl || '').trim());
        this.message='Chauffeur cree';
        this.loading=false;
        this.photoPreview = null;
        this.photoError = '';
        this.router.navigate(['/admin','drivers']);
      },
      error: ()=>{ this.error='Erreur creation chauffeur'; this.loading=false; }
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
