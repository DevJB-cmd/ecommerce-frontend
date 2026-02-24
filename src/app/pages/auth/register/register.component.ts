import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  form: FormGroup;
  loading = false;
  error = '';
  success = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submit() {
    this.error = '';
    this.success = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error = 'Veuillez corriger les champs invalides.';
      return;
    }

    this.loading = true;
    this.auth.register(this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Inscription reussie. Connexion en cours...';
        setTimeout(() => this.router.navigate(['/home']), 900);
      },
      error: () => {
        this.loading = false;
        this.error = 'Echec inscription. Email peut-etre deja utilise.';
      }
    });
  }
}
