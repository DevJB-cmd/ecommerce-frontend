import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../models/user.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <section class="container">
      <article class="card p-4">
        <h2 class="mb-3">Parametres du compte</h2>

        <div *ngIf="!currentUser" class="alert alert-warning">Vous devez etre connecte pour modifier vos informations.</div>

        <form *ngIf="currentUser" [formGroup]="form" (ngSubmit)="save()">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Prenom</label>
              <input class="form-control" formControlName="firstName" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Nom</label>
              <input class="form-control" formControlName="lastName" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Email</label>
              <input class="form-control" type="email" formControlName="email" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Telephone</label>
              <input class="form-control" formControlName="phone" />
            </div>
          </div>

          <div class="mt-4 d-flex gap-2">
            <button class="btn btn-primary" [disabled]="loading || form.invalid" type="submit">Enregistrer</button>
            <a class="btn btn-outline-secondary" routerLink="/profile">Annuler</a>
          </div>
        </form>

        <div *ngIf="message" class="alert alert-success mt-3">{{ message }}</div>
        <div *ngIf="error" class="alert alert-danger mt-3">{{ error }}</div>
      </article>
    </section>
  `
})
export class SettingsComponent implements OnInit {
  form: FormGroup;
  loading = false;
  message = '';
  error = '';
  currentUser: User | null = null;
  private dbUserSnapshot: User | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private users: UserService,
    private router: Router
  ) {
    this.form = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['']
    });
  }

  ngOnInit(): void {
    this.currentUser = this.auth.currentUser;
    if (!this.currentUser) return;

    this.users.getById(this.currentUser.id).subscribe({
      next: (dbUser) => {
        this.dbUserSnapshot = dbUser;
        this.form.patchValue({
          firstName: dbUser.firstName || this.currentUser?.firstName || '',
          lastName: dbUser.lastName || this.currentUser?.lastName || '',
          email: dbUser.email || this.currentUser?.email || '',
          phone: dbUser.phone || this.currentUser?.phone || ''
        });
      },
      error: () => {
        // Fallback to current session data if backend profile read fails
        this.form.patchValue({
          firstName: this.currentUser?.firstName || '',
          lastName: this.currentUser?.lastName || '',
          email: this.currentUser?.email || '',
          phone: this.currentUser?.phone || ''
        });
      }
    });
  }

  save(): void {
    if (!this.currentUser || this.form.invalid) return;

    this.loading = true;
    this.message = '';
    this.error = '';

    const payload: User = {
      ...(this.dbUserSnapshot || this.currentUser),
      ...this.form.value,
      id: this.currentUser.id,
      username: this.dbUserSnapshot?.username || this.currentUser.username || this.form.value.email,
      password: this.dbUserSnapshot?.password || this.currentUser.password || '',
      roles: this.dbUserSnapshot?.roles || this.currentUser.roles || ['USER']
    };

    this.users.update(this.currentUser.id, payload).subscribe({
      next: (updated) => {
        this.dbUserSnapshot = updated;
        this.auth.updateCurrentUser({ ...updated, password: null });
        this.message = 'Profil mis a jour avec succes.';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/profile']), 800);
      },
      error: (err: HttpErrorResponse) => {
        this.error = err.error?.message || err.message || 'Echec de la mise a jour.';
        this.loading = false;
      }
    });
  }
}
