import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { ClientService } from '../../services/client.service';
import { Order } from '../../models/order.model';
import { Client } from '../../models/client.model';
import { PhotoService } from '../../services/photo.service';

@Component({ selector: 'app-order-edit', standalone: true, imports: [CommonModule, ReactiveFormsModule], templateUrl: './edit.component.html', styleUrls: ['./edit.component.css'] })
export class OrderEditComponent implements OnInit {
  form: FormGroup; id!: number; message=''; error=''; loading=false;
  clients: Client[] = [];
  photoPreview: string | null = null;
  photoError = '';

  constructor(
    private fb: FormBuilder,
    private s: OrderService,
    private clientsService: ClientService,
    private photoService: PhotoService,
    private route: ActivatedRoute,
    private router: Router
  ){
    this.form = this.fb.group({ orderDate:['', Validators.required], status:['', Validators.required], clientId:[null, Validators.required], photoUrl: [''] });
  }

  ngOnInit(): void {
    this.clientsService.getAll().subscribe({ next: d => this.clients = d });
    const p = this.route.snapshot.paramMap.get('id');
    if(p){
      this.id = Number(p);
      this.form.patchValue({ photoUrl: this.photoService.get('order', this.id) || '' });
      this.s.getById(this.id).subscribe({
        next: d => this.form.patchValue({ orderDate: d.orderDate, status: d.status, clientId: d.client?.id }),
        error: ()=> this.error='Erreur chargement commande'
      });
    }
  }

  submit(){
    if(this.form.invalid){ this.error='Formulaire invalide'; return; }
    this.loading=true;
    const v = this.form.value;
    const payload: Order = { id: this.id, orderDate: v.orderDate, status: v.status, client: { id: Number(v.clientId) } };
    this.s.update(this.id, payload).subscribe({
      next: ()=>{
        this.savePhoto();
        this.message='Commande modifiee';
        this.loading=false;
        this.router.navigate(['/admin','orders']);
      },
      error: ()=>{ this.error='Erreur mise a jour commande'; this.loading=false; }
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
    if (this.id) this.photoService.remove('order', this.id);
  }

  private savePhoto(): void {
    const manualUrl = String(this.form.value.photoUrl || '').trim();
    const source = this.photoPreview || manualUrl;
    if (!source) return;
    this.photoService.set('order', this.id, source);
  }
}
