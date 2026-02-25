import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { ClientService } from '../../services/client.service';
import { Order } from '../../models/order.model';
import { Client } from '../../models/client.model';
import { Router } from '@angular/router';
import { PhotoService } from '../../services/photo.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({ selector: 'app-order-create', standalone: true, imports: [CommonModule, ReactiveFormsModule], templateUrl: './create.component.html', styleUrls: ['./create.component.css'] })
export class OrderCreateComponent {
  form: FormGroup; message=''; error=''; loading=false;
  clients: Client[] = [];
  photoPreview: string | null = null;
  photoError = '';

  constructor(
    private fb: FormBuilder,
    private s: OrderService,
    private clientsService: ClientService,
    private photoService: PhotoService,
    private router: Router
  ){
    this.form = this.fb.group({ orderDate: ['', [Validators.required]], status: ['', [Validators.required]], clientId: [null, [Validators.required]], photoUrl: [''] });
    this.clientsService.getAll().subscribe({ next: d => this.clients = d });
  }

  submit(){
    if(this.form.invalid){ this.error='Formulaire invalide'; return; }
    this.error = '';
    this.message = '';
    this.loading=true;
    const v = this.form.value;
    const payload: Partial<Order> = {
      orderDate: String(v.orderDate || ''),
      status: String(v.status || '').trim(),
      client: { id: Number(v.clientId) }
    };
    this.s.create(payload).subscribe({
      next: (created)=>{
        this.photoService.set('order', created?.id, this.photoPreview || String(v.photoUrl || '').trim());
        this.message='Commande creee';
        this.loading=false;
        this.photoPreview = null;
        this.photoError = '';
        this.router.navigate(['/admin','orders']);
      },
      error: (err: HttpErrorResponse)=>{
        const backendMessage = typeof err.error === 'string'
          ? err.error
          : err.error?.message || err.message;
        this.error = backendMessage || 'Erreur creation commande';
        this.loading=false;
      }
    });
  }

  onPhotoFileSelected(event: Event): void {
    this.photoError = '';
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.photoError = 'Veuillez choisir une image valide.';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => (this.photoPreview = String(reader.result || ''));
    reader.onerror = () => (this.photoError = 'Impossible de lire le fichier image.');
    reader.readAsDataURL(file);
  }

  clearPhoto(): void {
    this.form.patchValue({ photoUrl: '' });
    this.photoPreview = null;
    this.photoError = '';
  }
}
