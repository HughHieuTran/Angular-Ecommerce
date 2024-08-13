import { Component, Input, ViewChild } from '@angular/core';
import { Product } from '../../../types/types';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { Overlay } from 'primeng/overlay';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, RatingModule, FormsModule, OverlayPanelModule,TableModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() product!: Product;
  @ViewChild('op') overlay: Overlay | undefined;
  showOverlay: boolean = false;
  ngOnInit() { }

  addProductToCart() {

  }

}
