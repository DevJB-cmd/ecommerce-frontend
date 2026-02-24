import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DriverService } from '../../services/driver.service';
import { UserService } from '../../services/user.service';
import { Driver } from '../../models/driver.model';
import { User } from '../../models/user.model';
import { PhotoService } from '../../services/photo.service';

@Component({ selector: 'app-driver-edit', standalone: true, imports: [CommonModule, ReactiveFormsModule], templateUrl: './edit.component.html', styleUrls: ['./edit.component.css'] })
export class DriverEditComponent implements OnInit {
  form: FormGroup; id!: number; message=''; error=''; loading=false;
  users: User[] = [];
  photoPreview: string | null = null;
  photoError = '';

  constructor(
    private fb: FormBuilder,
    private s: DriverService,
    private usersService: UserService,
    private photoService: PhotoService,
    private route: ActivatedRoute,
    private router: Router
  ){
    this.form = this.fb.group({ licenseNumber:['', Validators.required], userId:[null, Validators.required], photoUrl: [''] });
  }

  ngOnInit(): void {
    this.usersService.getAll().subscribe({ next: d => this.users = d });
    const p = this.route.snapshot.paramMap.get('id');
    if(p){
      this.id = Number(p);
      this.form.patchValue({ photoUrl: this.photoService.get('driver', this.id) || '' });
      this.s.getById(this.id).subscribe({
        next: d => this.form.patchValue({ licenseNumber: d.licenseNumber, userId: d.user?.id }),
        error: ()=> this.error='Erreur chargement chauffeur'
      });
    }
  }

  submit(){
    if(this.form.invalid){ this.error='Formulaire invalide'; return; }
    this.loading=true;
    const v = this.form.value;
    const payload: Driver = { id: this.id, licenseNumber: v.licenseNumber, user: { id: Number(v.userId) } };
    this.s.update(this.id, payload).subscribe({
      next: ()=>{
        this.savePhoto();
        this.message='Chauffeur modifie';
        this.loading=false;
        this.router.navigate(['/admin','drivers']);
      },
      error: ()=>{ this.error='Erreur mise a jour chauffeur'; this.loading=false; }
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
    if (this.id) this.photoService.remove('driver', this.id);
  }

  private savePhoto(): void {
    const manualUrl = String(this.form.value.photoUrl || '').trim();
    const source = this.photoPreview || manualUrl;
    if (!source) return;
    this.photoService.set('driver', this.id, source);
  }
}
