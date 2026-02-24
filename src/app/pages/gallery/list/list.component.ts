import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Gallery } from '../../models/gallery.model';
import { GalleryService } from '../../services/gallery.service';
import { RouterLink } from "@angular/router";

@Component({ selector: 'app-gallery-list', standalone: true,
  imports: [CommonModule, RouterLink], 
  templateUrl: './list.component.html', 
  styleUrls: ['./list.component.css'] })
  
export class GalleryListComponent implements OnInit {
  items: Gallery[] = []; loading=false; error='';
  constructor(private s: GalleryService) {}
  ngOnInit(): void { this.s.getAll().subscribe({ next: d => this.items = d, error: ()=> this.error='Erreur' }); }
  deleteOne(id:number){ if(!confirm('Confirmer?')) return; this.s.delete(id).subscribe({ next: ()=> this.items = this.items.filter(x=> x.id!==id), error: ()=> this.error='Erreur' }); }
}
