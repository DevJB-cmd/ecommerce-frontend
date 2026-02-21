import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Client } from '../../models/client.model';
import { ClientService } from '../../services/client.service';

@Component({ selector: 'app-client-list', standalone: true, imports: [CommonModule], templateUrl: './list.component.html', styleUrls: ['./list.component.css'] })
export class ClientListComponent implements OnInit {
  items: Client[] = []; loading=false; error=''; message='';
  constructor(private s: ClientService) {}
  ngOnInit(): void { this.load(); }
  load(){ this.loading=true; this.s.getAll().subscribe({ next: d => { this.items = d; this.loading=false; }, error: ()=> { this.error='Erreur'; this.loading=false } }); }
  deleteOne(id:number){ if(!confirm('Confirmer?')) return; this.s.delete(id).subscribe({ next: ()=> this.load(), error: ()=> this.error='Erreur suppression' }); }
}
