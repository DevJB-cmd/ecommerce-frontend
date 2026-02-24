import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProviderService } from '../../services/provider.service';

@Component({ selector: 'app-provider-create', standalone: true, imports:[CommonModule, ReactiveFormsModule], templateUrl: './create.component.html', styleUrls: ['./create.component.css'] })
export class ProviderCreateComponent {
  form: any; error=''; loading = false;
  constructor(private fb: FormBuilder, private s: ProviderService) { this.form = this.fb.group({ name: ['', Validators.required] }); }
  submit(){ if(this.form.invalid) return; this.loading = true; this.s.create(this.form.value).subscribe({ next: ()=> { this.loading = false; alert('Enregistré'); }, error: ()=> { this.loading = false; this.error='Erreur' } }); }
}
