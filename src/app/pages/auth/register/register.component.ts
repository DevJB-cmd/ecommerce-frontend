import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
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
  form!: FormGroup;
  loading = false;
  error = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({ email: [''], password: [''], firstName: [''], lastName: [''] });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.auth.register(this.form.value).subscribe({
      next: () => { this.loading = false; this.router.navigate(['/']); },
      error: () => { this.loading = false; this.error = 'Erreur inscription'; }
    });
  }
}
