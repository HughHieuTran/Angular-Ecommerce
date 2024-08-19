import { Component, inject, Input, ViewChild } from '@angular/core';
import { Order, OrderDto, OrderItem, OrderItemDto, Product } from '../../../types/types';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { map, Observable, Subject, switchMap } from 'rxjs';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { Overlay } from 'primeng/overlay';
import { TableModule } from 'primeng/table';
import { select, Store } from '@ngrx/store';
import { selectCartItems } from '../../store/cart.selectors';
import { OrderService } from '../../services/order.service';
import { loadCartItemsFailure, loadCartItemsSuccess } from '../../store/cart.actions';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, RatingModule, FormsModule, OverlayPanelModule, TableModule, ToastModule, BadgeModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input() product!: Product;
  @ViewChild('op') overlay: Overlay | undefined;
  showOverlay: boolean = false;
  private store = inject(Store);
  cartItems$: Observable<OrderItem[]> = this.store.pipe(select(selectCartItems));;
  error$: Observable<any> = this.store.select(state => state.cart.error);
  isStockAvailable: boolean = false;
  isAdding:boolean = false;
  constructor(private orderService: OrderService, private messageService: MessageService) { }

  ngOnInit() {
    this.isStockAvailable = this.product.stock > 0;
  }

  async addProductToCart() {
    this.isAdding = true;
    this.orderService.addToCart({ email: 'admin@gmail.com', productId: this.product.id, quantity: 1 }).subscribe({
      next: (order: Order) => {
        let orderItems: OrderItem[] = [];
        if (order) orderItems = order.orderItems
        this.store.dispatch(loadCartItemsSuccess({ items: orderItems }))
        this.product.stock -= 1;
        this.showSuccess();
      },
      error: (error) => {
        this.store.dispatch(loadCartItemsFailure({ error }));
        this.showError(error);
      }
    });
    this.isAdding = false;
  }

  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: this.product.name + ' was added to cart successfully' });
  }
  showError(error: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
  }
}
