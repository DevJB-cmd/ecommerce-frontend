import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { PhotoService } from '../../services/photo.service';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class UserEditComponent implements OnInit {
  form: FormGroup;
  id!: number;
  message = '';
  error = '';
  loading = false;
  photoPreview: string | null = null;
  photoError = '';
  private currentPassword: string | null = null;

  constructor(
    private fb: FormBuilder,
    private s: UserService,
    private photoService: PhotoService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      role: ['USER', Validators.required],
      photoUrl: ['']
    });
  }

  ngOnInit(): void {
    const p = this.route.snapshot.paramMap.get('id');
    if (!p) return;

    this.id = Number(p);
    this.form.patchValue({ photoUrl: this.photoService.get('user', this.id) || '' });
    this.s.getById(this.id).subscribe({
      next: (d: User) => {
        this.form.patchValue({
          firstName: d.firstName,
          lastName: d.lastName,
          username: d.username,
          email: d.email,
          phone: d.phone,
          role: d.roles?.[0] || 'USER'
        });
        this.currentPassword = d.password || null;
      },
      error: () => (this.error = 'Erreur chargement utilisateur')
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.error = 'Formulaire invalide';
      return;
    }

    this.loading = true;
    const v = this.form.value;
    const payload: User = {
      id: this.id,
      firstName: v.firstName,
      lastName: v.lastName,
      username: v.username,
      email: v.email,
      phone: v.phone,
      password: this.currentPassword,
      roles: [v.role]
    };

    this.s.update(this.id, payload).subscribe({
      next: () => {
        this.savePhoto();
        this.message = 'Utilisateur modifie';
        this.loading = false;
        this.router.navigate(['/admin', 'users']);
      },
      error: () => {
        this.error = 'Echec de mise a jour';
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
    if (this.id) this.photoService.remove('user', this.id);
  }

  private savePhoto(): void {
    const manualUrl = String(this.form.value.photoUrl || '').trim();
    const source = this.photoPreview || manualUrl;
    if (!source) return;
    this.photoService.set('user', this.id, source);
  }
}
