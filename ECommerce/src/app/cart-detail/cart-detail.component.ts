import { Component, inject } from '@angular/core';
import { Order, OrderItem } from '../../types/types';
import { map, Observable } from 'rxjs';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/order.service';
import { MessageService } from 'primeng/api';
import { loadCartItemsFailure, loadCartItemsSuccess } from '../store/cart.actions';
import { select, Store } from '@ngrx/store';
import { selectCartItems } from '../store/cart.selectors';
import { CommonModule } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { roundNumber } from '../lib';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-detail',
  standalone: true,
  imports: [CommonModule, InputNumberModule, ButtonModule, ToastModule, ReactiveFormsModule, FormsModule],
  templateUrl: './cart-detail.component.html',
  styleUrl: './cart-detail.component.scss'
})
export class CartDetailComponent {
  private store = inject(Store);
  cartItems$: Observable<OrderItem[]> = this.store.pipe(select(selectCartItems));
  totalCartQuantity$: Observable<number> = this.cartItems$.pipe(
    map(items => items.reduce((sum, item) => sum + parseInt(item.quantity + ''), 0))
  );
  totalCartPrice$: Observable<any> = this.cartItems$.pipe(
    map(items => items.reduce((sum: number, item) => {
      return roundNumber(sum + parseFloat(item.totalPrice.toString()), 12)
    }, 0))
  );
  constructor(private readonly productService: ProductService, private readonly orderService: OrderService, private messageService: MessageService, private router: Router) {
    this.loadCartItems();
  }
  private loadCartItems() {
    this.orderService.getCart('admin@gmail.com').subscribe({
      next: (orders: Order[]) => {
        let orderItems: OrderItem[] = [];
        if (orders.length > 0) orderItems = orders[0].orderItems;
        orderItems.sort((a, b) => a.id - b.id);
        this.store.dispatch(loadCartItemsSuccess({ items: orderItems }))
      },
      error: (error) => this.store.dispatch(loadCartItemsFailure({ error }))
    });
  }
  deleteProduct(id: number | undefined) {
    if (id == undefined) return;
    this.orderService.createOrUpdateCartItem({ email: 'admin@gmail.com', productId: id, quantity: 0 }).subscribe({
      next: (order: Order) => {
        let orderItems: OrderItem[] = [];
        if (order) orderItems = order.orderItems
        orderItems.sort((a, b) => a.id - b.id);
        this.store.dispatch(loadCartItemsSuccess({ items: orderItems }))
        this.showSuccess();
      },
      error: (error) => {
        this.store.dispatch(loadCartItemsFailure({ error }));
        this.showError(error);
      }
    });
  }

  pay_onClick() {
    this.orderService.payOrder('admin@gmail.com').subscribe({
      next: (success: Boolean) => {
        if (success) {
          this.store.dispatch(loadCartItemsSuccess({ items: [] }))
          this.showSuccessText('Order Successfully');
        } else {
          this.showError('Pay failed');
        }
      },
      error: (error) => {
        this.store.dispatch(loadCartItemsFailure({ error }));
        this.showError('Pay failed');
      }
    });
  }
  buyMore_onClick() {
    this.router.navigate(['/']);
  }
  reduceItemQuantity(id: number) {
    this.orderService.addToCart({ email: 'admin@gmail.com', productId: id, quantity: -1 }).subscribe({
      next: (order: Order) => {
        let orderItems: OrderItem[] = [];
        if (order) orderItems = order.orderItems
        orderItems.sort((a, b) => a.id - b.id);
        this.store.dispatch(loadCartItemsSuccess({ items: orderItems }))
        // this.product.stock += 1;
        this.showSuccess();
      },
      error: (error) => {
        this.store.dispatch(loadCartItemsFailure({ error }));
        this.showError(error);
      }
    });
  }
  addItemQuantity(id: number) {
    this.orderService.addToCart({ email: 'admin@gmail.com', productId: id, quantity: 1 }).subscribe({
      next: (order: Order) => {
        let orderItems: OrderItem[] = [];
        if (order) orderItems = order.orderItems
        orderItems.sort((a, b) => a.id - b.id);
        this.store.dispatch(loadCartItemsSuccess({ items: orderItems }))
        // this.product.stock -= 1;
        this.showSuccess();
      },
      error: (error) => {
        this.store.dispatch(loadCartItemsFailure({ error }));
        this.showError(error);
      }
    });
  }
  updateCartItemQuantity(event: any, id: number) {
    this.orderService.createOrUpdateCartItem({ email: 'admin@gmail.com', productId: id, quantity: event.target.value }).subscribe({
      next: (order: Order) => {
        let orderItems: OrderItem[] = [];
        if (order) orderItems = order.orderItems
        orderItems.sort((a, b) => a.id - b.id);
        this.store.dispatch(loadCartItemsSuccess({ items: orderItems }))
        this.showSuccess();
      },
      error: (error) => {
        this.store.dispatch(loadCartItemsFailure({ error }));
        this.showError(error);
      }
    });
  }
  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Cart item was updated successfully' });
  }
  showSuccessText(text: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: text });
  }
  showError(error: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error' });
  }
}
