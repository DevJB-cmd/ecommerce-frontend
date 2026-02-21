import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PagesModule } from './pages/pages.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PagesModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('ecommerce-frontend');
  readonly year = new Date().getFullYear();
}
