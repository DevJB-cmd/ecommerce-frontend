import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { PhotoService } from '../../services/photo.service';

@Component({ selector: 'app-user-create', standalone: true, imports: [CommonModule, ReactiveFormsModule], templateUrl: './create.component.html', styleUrls: ['./create.component.css'] })
export class UserCreateComponent {
  form: FormGroup;
  message=''; error=''; loading=false;
  photoPreview: string | null = null;
  photoError = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private photoService: PhotoService, private router: Router){
    this.form = this.fb.group({
      firstName:['', [Validators.required]],
      lastName:['', [Validators.required]],
      email:['', [Validators.required, Validators.email]],
      password:['', [Validators.required, Validators.minLength(6)]],
      photoUrl: ['']
    });
  }

  submit(){
    if(this.form.invalid){ this.error='Formulaire invalide'; return; }
    this.loading=true;
    const v = this.form.value;
    this.auth.register({ firstName: v.firstName, lastName: v.lastName, email: v.email, password: v.password }).subscribe({
      next: (res)=>{
        this.photoService.set('user', res.user?.id, this.photoPreview || String(v.photoUrl || '').trim());
        this.message='Utilisateur cree avec succes';
        this.loading=false;
        this.form.reset();
        this.photoPreview = null;
        this.photoError = '';
        this.router.navigate(['/admin','users']);
      },
      error: ()=>{ this.error='Echec de creation utilisateur'; this.loading=false; }
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
