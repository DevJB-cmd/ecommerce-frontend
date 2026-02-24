import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Driver } from '../../models/driver.model';
import { DriverService } from '../../services/driver.service';
import { PhotoService } from '../../services/photo.service';

@Component({ selector: 'app-driver-list', standalone: true, imports: [CommonModule, RouterModule], templateUrl: './list.component.html', styleUrls: ['./list.component.css'] })
export class DriverListComponent implements OnInit {
  items: Driver[] = []; loading=false; error='';
  constructor(private s: DriverService, private photoService: PhotoService) {}
  ngOnInit(): void { this.s.getAll().subscribe({ next: d => this.items = d, error: ()=> this.error='Erreur' }); }
  deleteOne(id:number){ if(!confirm('Confirmer?')) return; this.s.delete(id).subscribe({ next: ()=> this.items = this.items.filter(x=> x.id!==id), error: ()=> this.error='Erreur' }); }
  photo(id: number): string | null { return this.photoService.get('driver', id); }
}
