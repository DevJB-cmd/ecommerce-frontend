import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DriverService } from '../../services/driver.service';
import { Driver } from '../../models/driver.model';

@Component({ selector: 'app-driver-create', standalone: true, imports: [CommonModule, ReactiveFormsModule], templateUrl: './create.component.html', styleUrls: ['./create.component.css'] })
export class DriverCreateComponent {
  form: FormGroup; message=''; error=''; loading=false;
  constructor(private fb: FormBuilder, private s: DriverService){ this.form = this.fb.group({ name:['', [Validators.required]], phone:['', [Validators.required]], licenseNumber:['', [Validators.required]] }); }
  submit(){ if(this.form.invalid){ this.error='Formulaire invalide'; return; } this.loading=true; this.s.create(this.form.value as Driver).subscribe({ next: ()=>{ this.message='Créé'; this.loading=false; this.form.reset(); }, error: ()=>{ this.error='Erreur'; this.loading=false } }); }
}
