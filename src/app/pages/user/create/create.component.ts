import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({ selector: 'app-user-create', standalone: true, imports: [CommonModule, ReactiveFormsModule], templateUrl: './create.component.html', styleUrls: ['./create.component.css'] })
export class UserCreateComponent {
  form: FormGroup; message=''; error=''; loading=false;
  constructor(private fb: FormBuilder, private s: UserService){ this.form = this.fb.group({ name:['', [Validators.required]], email:['', [Validators.required, Validators.email]], password:['', [Validators.required, Validators.minLength(6)]], role:['user'] }); }
  submit(){ if(this.form.invalid){ this.error='Formulaire invalide'; return; } this.loading=true; this.s.create(this.form.value as User).subscribe({ next: ()=>{ this.message='Créé'; this.loading=false; this.form.reset(); }, error: ()=>{ this.error='Erreur'; this.loading=false } }); }
}
