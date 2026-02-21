import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubcategoryService } from '../../services/subcategory.service';
import { Subcategory } from '../../models/subcategory.model';

@Component({ selector: 'app-subcategory-create', standalone: true, imports: [CommonModule, ReactiveFormsModule], templateUrl: './create.component.html', styleUrls: ['./create.component.css'] })
export class SubcategoryCreateComponent {
  form: FormGroup; message=''; error=''; loading=false;
  constructor(private fb: FormBuilder, private s: SubcategoryService){ this.form = this.fb.group({ name:['', [Validators.required]], categoryId:[null, [Validators.required]] }); }
  submit(){ if(this.form.invalid){ this.error='Formulaire invalide'; return; } this.loading=true; this.s.create(this.form.value as Subcategory).subscribe({ next: ()=>{ this.message='Créé'; this.loading=false; this.form.reset(); }, error: ()=>{ this.error='Erreur'; this.loading=false } }); }
}
