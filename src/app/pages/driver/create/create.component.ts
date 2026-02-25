import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DriverService } from '../../services/driver.service';
import { UserService } from '../../services/user.service';
import { Driver } from '../../models/driver.model';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { PhotoService } from '../../services/photo.service';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';

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
    this.loadAvailableUsers();
  }

  submit(){
    if (!this.users.length) {
      this.error = "Aucun utilisateur disponible. Creez un nouvel utilisateur d'abord.";
      return;
    }
    if(this.form.invalid){ this.error='Formulaire invalide'; return; }
    this.error = '';
    this.message = '';
    this.loading=true;
    const v = this.form.value;
    const payload: Partial<Driver> = { licenseNumber: String(v.licenseNumber || '').trim(), user: { id: Number(v.userId) } };
    this.s.create(payload).subscribe({
      next: (created)=>{
        this.photoService.set('driver', created?.id, this.photoPreview || String(v.photoUrl || '').trim());
        this.message='Chauffeur cree';
        this.loading=false;
        this.photoPreview = null;
        this.photoError = '';
        this.router.navigate(['/admin','drivers']);
      },
      error: (err: HttpErrorResponse)=>{
        const backendMessage = typeof err.error === 'string'
          ? err.error
          : err.error?.message || err.message;
        if (err.status === 403 || err.status === 409 || err.status === 500) {
          this.error = "Cet utilisateur est deja associe a un chauffeur. Choisissez un autre utilisateur.";
        } else {
          this.error = backendMessage || 'Erreur creation chauffeur';
        }
        this.loading=false;
        this.loadAvailableUsers();
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

  private loadAvailableUsers(): void {
    forkJoin({
      users: this.usersService.getAll(),
      drivers: this.s.getAll()
    }).subscribe({
      next: ({ users, drivers }) => {
        const usedUserIds = new Set<number>(
          (drivers || [])
            .map(d => d.user?.id)
            .filter((id): id is number => typeof id === 'number')
        );
        this.users = (users || []).filter(u => !usedUserIds.has(u.id));
      },
      error: () => {
        this.users = [];
      }
    });
  }
}
