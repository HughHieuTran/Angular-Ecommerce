import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { SearchComponent } from './components/search/search.component';
import { PreviewCardComponent } from './components/preview-card/preview-card.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HomeComponent, ProductCardComponent, SearchComponent, SearchComponent, PreviewCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

}
