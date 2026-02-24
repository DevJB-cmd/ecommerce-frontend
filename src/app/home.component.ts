import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>Bienvenue</h2>
      <p>Page d'accueil du site e-commerce. Utilisez la navigation pour parcourir les produits et catégories.</p>
    </div>
  `
})
export class HomeComponent {}
