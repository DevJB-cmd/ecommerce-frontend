import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';

@Component({ selector: 'app-order-create', standalone: true, imports: [CommonModule, ReactiveFormsModule], templateUrl: './create.component.html', styleUrls: ['./create.component.css'] })
export class OrderCreateComponent {
  form: FormGroup; message=''; error=''; loading=false;
  constructor(private fb: FormBuilder, private s: OrderService){
    this.form = this.fb.group({ date: ['', [Validators.required]], total: [0, [Validators.required]], status: [''], client: [null], products: [[]] });
  }
  submit(){ if(this.form.invalid){ this.error='Formulaire invalide'; return; } this.loading=true; this.s.create(this.form.value as Order).subscribe({ next: ()=>{ this.message='Créé'; this.loading=false; this.form.reset(); }, error: ()=>{ this.error='Erreur'; this.loading=false } }); }
}
