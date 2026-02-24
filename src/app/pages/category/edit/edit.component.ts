import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';

@Component({ selector: 'app-category-edit', standalone: true, imports: [CommonModule, ReactiveFormsModule, RouterModule], templateUrl: './edit.component.html', styleUrls: ['./edit.component.css'] })
export class CategoryEditComponent implements OnInit {
  form: FormGroup; id!: number; message=''; error=''; loading=false;

  constructor(private fb: FormBuilder, private s: CategoryService, private route: ActivatedRoute, private router: Router){
    this.form = this.fb.group({ name:['', [Validators.required]], description: [''] });
  }

  ngOnInit(): void {
    const p = this.route.snapshot.paramMap.get('id');
    if(p){
      this.id = Number(p);
      this.s.getById(this.id).subscribe({
        next: d => this.form.patchValue({ name: d.name }),
        error: ()=> this.error='Erreur chargement categorie'
      });
    }
  }

  submit(){
    if(this.form.invalid){ this.error='Formulaire invalide'; return; }
    this.loading=true;
    const payload = { id: this.id, name: this.form.value.name } as Category;
    this.s.update(this.id, payload).subscribe({
      next: ()=> { this.message='Categorie modifiee'; this.loading=false; this.router.navigate(['/admin','categories']); },
      error: ()=> { this.error='Erreur mise a jour categorie'; this.loading=false; }
    });
  }
}
