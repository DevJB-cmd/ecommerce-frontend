import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProviderService } from '../../services/provider.service';

@Component({ selector: 'app-provider-edit', standalone: true, imports:[CommonModule, ReactiveFormsModule], templateUrl: './edit.component.html', styleUrls: ['./edit.component.css'] })
export class ProviderEditComponent implements OnInit {
  form: any; error='';
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private s: ProviderService){ this.form = this.fb.group({ id: [0], name:['', Validators.required] }); }
  ngOnInit(): void {
    const idStr = this.route.snapshot.paramMap.get('id') || '0';
    const id = Number(idStr);
    this.s.getById(id).subscribe({ next: (d: any) => this.form.patchValue(d), error: ()=> this.error='Erreur' });
  }
  submit(){ if(this.form.invalid) return; const v = this.form.value; this.s.update(v.id, v).subscribe({ next: ()=> alert('Updated'), error: ()=> this.error='Erreur' }); }
}
