import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GalleryService } from '../../services/gallery.service';
import { Gallery } from '../../models/gallery.model';

@Component({ selector: 'app-gallery-edit', standalone: true, imports: [CommonModule, ReactiveFormsModule], templateUrl: './edit.component.html', styleUrls: ['./edit.component.css'] })
export class GalleryEditComponent implements OnInit {
  form: FormGroup; id!: number; message=''; error=''; loading=false;
  constructor(private fb: FormBuilder, private s: GalleryService, private route: ActivatedRoute){ this.form = this.fb.group({ imageUrl:['', Validators.required], productId:[null, Validators.required] }); }
  ngOnInit(): void { const p = this.route.snapshot.paramMap.get('id'); if(p){ this.id = Number(p); this.s.getById(this.id).subscribe({ next: d => this.form.patchValue(d), error: ()=> this.error='Erreur' }); } }
  submit(){ if(this.form.invalid){ this.error='Formulaire invalide'; return; } this.loading=true; this.s.update(this.id, this.form.value as Gallery).subscribe({ next: ()=>{ this.message='Modifié'; this.loading=false }, error: ()=>{ this.error='Erreur'; this.loading=false } }); }
}
