import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: FormGroup;
  error = '';
  success = '';
  loading = false;
  private returnUrl = '/home';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private route: ActivatedRoute) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    const q = this.route.snapshot.queryParamMap.get('returnUrl');
    if (q) this.returnUrl = q;
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
    const { email, password } = this.form.value;
    this.auth.login(email, password).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Connexion reussie. Redirection...';
        setTimeout(() => this.router.navigateByUrl(this.returnUrl), 700);
      },
      error: () => {
        this.loading = false;
        this.error = 'Identifiants invalides.';
      }
    });
  }
}
