import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GalleryService } from '../../services/gallery.service';
import { Gallery } from '../../models/gallery.model';

@Component({ selector: 'app-gallery-create', standalone: true, imports: [CommonModule, ReactiveFormsModule], templateUrl: './create.component.html', styleUrls: ['./create.component.css'] })
export class GalleryCreateComponent {
  form: FormGroup; message=''; error=''; loading=false;
  constructor(private fb: FormBuilder, private s: GalleryService){ this.form = this.fb.group({ imageUrl:['', [Validators.required]], productId:[null, [Validators.required]] }); }
  submit(){ if(this.form.invalid){ this.error='Formulaire invalide'; return; } this.loading=true; this.s.create(this.form.value as Gallery).subscribe({ next: ()=>{ this.message='Créé'; this.loading=false; this.form.reset(); }, error: ()=>{ this.error='Erreur'; this.loading=false } }); }
}
