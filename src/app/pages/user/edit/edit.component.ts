import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({ selector: 'app-user-edit', standalone: true, imports: [CommonModule, ReactiveFormsModule], templateUrl: './edit.component.html', styleUrls: ['./edit.component.css'] })
export class UserEditComponent implements OnInit {
  form: FormGroup; id!: number; message=''; error=''; loading=false;
  constructor(private fb: FormBuilder, private s: UserService, private route: ActivatedRoute){ this.form = this.fb.group({ name:['', Validators.required], email:['', [Validators.required, Validators.email]], role:['USER'] }); }
  ngOnInit(): void { const p = this.route.snapshot.paramMap.get('id'); if(p){ this.id = Number(p); this.s.getById(this.id).subscribe({ next: d => this.form.patchValue(d), error: ()=> this.error='Erreur' }); } }
  submit(){ if(this.form.invalid){ this.error='Formulaire invalide'; return; } this.loading=true; const raw = this.form.value; const payload: User = { name: raw.name, email: raw.email, roles:[raw.role] } as any; this.s.update(this.id, payload).subscribe({ next: ()=>{ this.message='Modifié'; this.loading=false; }, error: ()=>{ this.error='Erreur'; this.loading=false } }); }
}
