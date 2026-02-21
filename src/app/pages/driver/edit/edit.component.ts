import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DriverService } from '../../services/driver.service';
import { Driver } from '../../models/driver.model';

@Component({ selector: 'app-driver-edit', standalone: true, imports: [CommonModule, ReactiveFormsModule], templateUrl: './edit.component.html', styleUrls: ['./edit.component.css'] })
export class DriverEditComponent implements OnInit {
  form: FormGroup; id!: number; message=''; error=''; loading=false;
  constructor(private fb: FormBuilder, private s: DriverService, private route: ActivatedRoute){ this.form = this.fb.group({ name:['', Validators.required], phone:['', Validators.required], licenseNumber:['', Validators.required] }); }
  ngOnInit(): void { const p = this.route.snapshot.paramMap.get('id'); if(p){ this.id = Number(p); this.s.getById(this.id).subscribe({ next: d => this.form.patchValue(d), error: ()=> this.error='Erreur' }); } }
  submit(){ if(this.form.invalid){ this.error='Formulaire invalide'; return; } this.loading=true; this.s.update(this.id, this.form.value as Driver).subscribe({ next: ()=>{ this.message='Modifié'; this.loading=false }, error: ()=>{ this.error='Erreur'; this.loading=false } }); }
}
