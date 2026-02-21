import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';

@Component({ selector: 'app-order-edit', standalone: true, imports: [CommonModule, ReactiveFormsModule], templateUrl: './edit.component.html', styleUrls: ['./edit.component.css'] })
export class OrderEditComponent implements OnInit {
  form: FormGroup; id!: number; message=''; error=''; loading=false;
  constructor(private fb: FormBuilder, private s: OrderService, private route: ActivatedRoute){ this.form = this.fb.group({ date:['', Validators.required], total:[0, Validators.required], status:[''] }); }
  ngOnInit(): void { const p = this.route.snapshot.paramMap.get('id'); if(p){ this.id = Number(p); this.s.getById(this.id).subscribe({ next: d => this.form.patchValue(d), error: ()=> this.error='Erreur' }); } }
  submit(){ if(this.form.invalid){ this.error='Formulaire invalide'; return; } this.loading=true; this.s.update(this.id, this.form.value as Order).subscribe({ next: ()=>{ this.message='Modifié'; this.loading=false; }, error: ()=>{ this.error='Erreur'; this.loading=false } }); }
}
