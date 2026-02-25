import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { UserService } from '../../services/user.service';
import { Client } from '../../models/client.model';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { PhotoService } from '../../services/photo.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({ selector: 'app-client-create', standalone: true, imports: [CommonModule, ReactiveFormsModule], templateUrl: './create.component.html', styleUrls: ['./create.component.css'] })
export class ClientCreateComponent {
  form: FormGroup; message=''; error=''; loading=false;
  users: User[] = [];
  photoPreview: string | null = null;
  photoError = '';

  constructor(
    private fb: FormBuilder,
    private s: ClientService,
    private usersService: UserService,
    private photoService: PhotoService,
    private router: Router
  ){
    this.form = this.fb.group({ address:['', [Validators.required]], userId:[null, [Validators.required]], photoUrl: [''] });
    this.usersService.getAll().subscribe({ next: d => this.users = d });
  }

  submit(){
    if(this.form.invalid){ this.error='Formulaire invalide'; return; }
    this.error = '';
    this.message = '';
    this.loading=true;
    const v = this.form.value;
    const payload: Partial<Client> = { address: String(v.address || '').trim(), user: { id: Number(v.userId) } };
    this.s.create(payload).subscribe({
      next: (created)=>{
        this.photoService.set('client', created?.id, this.photoPreview || String(v.photoUrl || '').trim());
        this.message='Client cree';
        this.loading=false;
        this.photoPreview = null;
        this.photoError = '';
        this.router.navigate(['/admin','clients']);
      },
      error: (err: HttpErrorResponse)=>{
        const backendMessage = typeof err.error === 'string'
          ? err.error
          : err.error?.message || err.message;
        this.error = backendMessage || 'Erreur creation client';
        this.loading=false;
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
}
