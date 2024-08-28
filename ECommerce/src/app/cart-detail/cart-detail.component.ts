import { Component, inject } from '@angular/core';
import { Order, OrderItem, User } from '../../types/types';
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
import { PriceFormatterPipe } from '../pipe/price-formatter.pipe';
import { StoragesvService } from '../services/storagesv.service';
import { DateFormatterPipe } from '../pipe/date-formatter.pipe';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-cart-detail',
  standalone: true,
  imports: [CommonModule, InputNumberModule, ButtonModule, ToastModule, ReactiveFormsModule, FormsModule, PriceFormatterPipe, DateFormatterPipe, ProgressSpinnerModule, DialogModule,FormsModule],
  templateUrl: './cart-detail.component.html',
  styleUrl: './cart-detail.component.scss'
})
export class CartDetailComponent {
  private store = inject(Store);
  cartItems$: Observable<OrderItem[]> = this.store.pipe(select(selectCartItems));
  oldOrders: Order[] = [];
  totalCartQuantity$: Observable<number> = this.cartItems$.pipe(
    map(items => items.reduce((sum, item) => sum + parseInt(item.quantity + ''), 0))
  );
  totalCartPrice$: Observable<any> = this.cartItems$.pipe(
    map(items => items.reduce((sum: number, item) => {
      return roundNumber(sum + parseFloat(item.totalPrice.toString()), 12)
    }, 0))
  );
  activeSection: string = 'cart';
  isLoading: boolean = false;
  isFormError: boolean = false;
  isPayFormVisible: boolean = false;
  address: string = '';
  phoneNumber: string = '';
  constructor(private readonly productService: ProductService, private readonly orderService: OrderService, private messageService: MessageService, private router: Router, private storage: StoragesvService) {

  }
  ngOnInit() {
    console.log('init work')
    if (!this.storage.getItem('user')) {
      this.router.navigate(['/']);
    }
    this.loadCartItems();
    this.loadOldOrders();

  }
  private async loadCartItems() {
    this.isLoading = true;
    await new Promise(resolve => { console.log('wait 1s'); setTimeout(resolve, 200) });
    const user: User | null = this.storage.getItem('user');
    if (!user) return;
    this.orderService.getCart(user.email).subscribe({
      next: (orders: Order[]) => {
        let orderItems: OrderItem[] = [];
        if (orders.length > 0) orderItems = orders[0].orderItems;
        orderItems.sort((a, b) => a.id - b.id);
        this.store.dispatch(loadCartItemsSuccess({ items: orderItems }));
        this.isLoading = false;
      },
      error: (error) => {
        this.store.dispatch(loadCartItemsFailure({ error }));
        this.isLoading = false;
      }
    });
  }
  private async loadOldOrders() {
    this.isLoading = true;
    await new Promise(resolve => { console.log('wait 1s'); setTimeout(resolve, 200) });
    const user: User | null = this.storage.getItem('user');
    if (!user) return;
    this.orderService.getHistoryOrder(user.email).subscribe({
      next: (orders) => {
        orders.forEach(o => o.totalPrice = o.orderItems.reduce((sum, it) => sum + parseFloat(it.totalPrice + ''), 0));
        this.oldOrders = orders;
        this.isLoading = false;
      },
      error: (error) => {
        console.log(error);
        this.isLoading = false;
      }
    });
  }
  deleteProduct(id: number | undefined) {
    if (id == undefined) return;
    const user: User | null = this.storage.getItem('user');
    if (!user) return;
    this.orderService.createOrUpdateCartItem({ email: user.email, productId: id, quantity: 0 }).subscribe({
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
    if (this.address.length <=0 || this.phoneNumber.length <= 0) {
      this.isFormError = true;
      setTimeout(() => this.isFormError = false, 3000);
      return;
    }
    const user: User | null = this.storage.getItem('user');
    if (!user) return;
    this.orderService.payOrder(user.email,this.address,this.phoneNumber).subscribe({
      next: (success: Boolean) => {
        if (success) {
          this.store.dispatch(loadCartItemsSuccess({ items: [] }))
          this.loadOldOrders();
          this.showSuccessText('Order Successfully');
          this.isPayFormVisible = false;
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
    this.isLoading = true;
    const user: User | null = this.storage.getItem('user');
    if (!user) return;
    this.orderService.addToCart({ email: user.email, productId: id, quantity: -1 }).subscribe({
      next: (order: Order) => {
        let orderItems: OrderItem[] = [];
        if (order) orderItems = order.orderItems
        orderItems.sort((a, b) => a.id - b.id);
        this.store.dispatch(loadCartItemsSuccess({ items: orderItems }))
        // this.product.stock += 1;
        this.showSuccess();
        this.isLoading = false;
      },
      error: (error) => {
        this.store.dispatch(loadCartItemsFailure({ error }));
        this.showError(error.error.message);
        this.isLoading = false;
      }
    });
  }
  addItemQuantity(id: number) {
    this.isLoading = true;
    const user: User | null = this.storage.getItem('user');
    if (!user) return;
    this.orderService.addToCart({ email: user.email, productId: id, quantity: 1 }).subscribe({
      next: (order: Order) => {
        let orderItems: OrderItem[] = [];
        if (order) orderItems = order.orderItems
        orderItems.sort((a, b) => a.id - b.id);
        this.store.dispatch(loadCartItemsSuccess({ items: orderItems }))
        // this.product.stock -= 1;
        this.showSuccess();
        this.isLoading = false;
      },
      error: (error) => {
        this.store.dispatch(loadCartItemsFailure({ error }));
        this.showError(error.error.message);
        this.isLoading = false;
      }
    });
  }
  updateCartItemQuantity(event: any, id: number) {
    this.isLoading = true;
    const user: User | null = this.storage.getItem('user');
    if (!user) return;
    this.orderService.createOrUpdateCartItem({ email: user.email, productId: id, quantity: event.target.value }).subscribe({
      next: (order: Order) => {
        let orderItems: OrderItem[] = [];
        if (order) orderItems = order.orderItems
        orderItems.sort((a, b) => a.id - b.id);
        this.store.dispatch(loadCartItemsSuccess({ items: orderItems }))
        this.showSuccess();
        this.isLoading = false;
      },
      error: (error) => {
        this.store.dispatch(loadCartItemsFailure({ error }));
        this.showError(error.error.message);
        this.isLoading = false;
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
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
  }

  changeActiveSection(section: string) {
    this.activeSection = section;
    if (section == 'history') this.loadOldOrders();
    if (section == 'cart') this.loadCartItems();
  }
}
