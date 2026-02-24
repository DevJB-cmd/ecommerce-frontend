import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Provider } from '../../models/provider.model';
import { ProviderService } from '../../services/provider.service';
import { PhotoService } from '../../services/photo.service';

@Component({ selector: 'app-provider-list', standalone: true, imports: [CommonModule, RouterModule], templateUrl: './list.component.html', styleUrls: ['./list.component.css'] })
export class ProviderListComponent implements OnInit {
  items: Provider[] = []; loading=false; error='';
  constructor(private s: ProviderService, private photoService: PhotoService) {}
  ngOnInit(): void { this.s.getAll().subscribe({ next: d => this.items = d, error: ()=> this.error='Erreur' }); }
  deleteOne(id:number){ if(!confirm('Confirmer?')) return; this.s.delete(id).subscribe({ next: ()=> this.items = this.items.filter(x=> x.id!==id), error: ()=> this.error='Erreur' }); }
  photo(id: number): string | null { return this.photoService.get('provider', id); }
}
