import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';

@Component({ selector: 'app-category-edit', standalone: true, imports: [CommonModule, ReactiveFormsModule, RouterModule], templateUrl: './edit.component.html', styleUrls: ['./edit.component.css'] })
export class CategoryEditComponent implements OnInit {
  form: FormGroup; id!: number; message=''; error=''; loading=false;
  constructor(private fb: FormBuilder, private s: CategoryService, private route: ActivatedRoute){ this.form = this.fb.group({ name:['', [Validators.required]], description: [''] }); }
  ngOnInit(): void { const p = this.route.snapshot.paramMap.get('id'); if(p){ this.id = Number(p); this.s.getById(this.id).subscribe({ next: d => this.form.patchValue(d), error: ()=> this.error='Erreur' }); } }
  submit(){ if(this.form.invalid){ this.error='Formulaire invalide'; return; } this.loading=true; this.s.update(this.id, this.form.value as Category).subscribe({ next: ()=> { this.message='Modifié'; this.loading=false }, error: ()=> { this.error='Erreur'; this.loading=false } }); }
}
