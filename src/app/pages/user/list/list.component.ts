import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({ selector: 'app-user-list', standalone: true, imports: [CommonModule], templateUrl: './list.component.html', styleUrls: ['./list.component.css'] })
export class UserListComponent implements OnInit {
  items: User[] = []; loading=false; error='';
  constructor(private s: UserService) {}
  ngOnInit(): void { this.s.getAll().subscribe({ next: d => this.items = d, error: () => this.error='Erreur' }); }
  deleteOne(id:number){ if(!confirm('Confirmer?')) return; this.s.delete(id).subscribe({ next: ()=> this.items = this.items.filter(x=> x.id!==id), error: ()=> this.error='Erreur' }); }
}
