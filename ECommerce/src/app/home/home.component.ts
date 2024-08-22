import { ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { SearchComponent } from '../components/search/search.component';
import { ProductService } from '../services/product.service';
import { Order, OrderItem, Product, ProductQueryParams, Products } from '../../types/types';
import { ProductCardComponent } from "../components/product-card/product-card.component";
import { CommonModule } from '@angular/common';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { SidebarModule } from 'primeng/sidebar';
import { OrderService } from '../services/order.service';
import { select, Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { selectCartItems } from '../store/cart.selectors';
import { loadCartItemsFailure, loadCartItemsSuccess } from '../store/cart.actions';
import { Badge, BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { roundNumber } from '../lib';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PriceFormatterPipe } from '../pipe/price-formatter.pipe';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SearchComponent, ProductCardComponent, CommonModule, PaginatorModule, SidebarModule, BadgeModule, ButtonModule, ToastModule, InputNumberModule, ProgressSpinnerModule, PriceFormatterPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private readonly productService: ProductService, private readonly orderService: OrderService, private messageService: MessageService) {
    this.loadCartItems();
  }
  @ViewChild('paginator') paginator: Paginator | undefined;
  private store = inject(Store);
  isProductLoading: boolean = false;
  cartItems$: Observable<OrderItem[]> = this.store.pipe(select(selectCartItems));
  error$: Observable<any> = this.store.select(state => state.cart.error);
  totalCartQuantity$: Observable<number> = this.cartItems$.pipe(
    map(items => items.reduce((sum, item) => sum + parseInt(item.quantity + ''), 0))
  );
  totalCartPrice$: Observable<any> = this.cartItems$.pipe(
    map(items => items.reduce((sum: number, item) => {
      return roundNumber(sum + parseFloat(item.totalPrice.toString()), 12)
    }, 0))
  );

  products: Product[] = [];
  isSidebarVisible = false;

  queryParams: ProductQueryParams = {
    limit: 12,
    offset: 0
  };
  totalRecords: number = 20;

  IsWaitting: boolean = false;

  ngOnInit() {
    this.getProducts();
    this.loadCartItems();
  }
  getProductsWithSearch(searchText: string) {
    this.queryParams.name = searchText;
    console.log(this.queryParams);
    this.getProducts();
  }
  async getProducts() {
    this.isProductLoading = true;
    await new Promise(resolve => { console.log('wait 1s'); setTimeout(resolve, 500) });
    this.productService.getAllProducts(this.queryParams).subscribe({
      next: (data: Products) => {
        this.products = data.products;
        this.totalRecords = data.total;
        this.isProductLoading = false;
      },
      error: (error) => { console.log(error); this.isProductLoading = false; }
    });

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
  onPageChange(event: any) {
    this.queryParams.offset = event.page * event.rows;
    this.queryParams.limit = event.rows;
    this.getProducts();
  }
  showSidebar() {
    this.isSidebarVisible = true;
  }

  deleteProduct(id: number | undefined, quantity: number) {
    if (this.IsWaitting) return;
    this.IsWaitting = true;
    if (id == undefined) return;
    const product = this.products.find((x) => x.id === id);
    this.orderService.createOrUpdateCartItem({ email: 'admin@gmail.com', productId: id, quantity: 0 }).subscribe({
      next: (order: Order) => {
        let orderItems: OrderItem[] = [];
        if (order) orderItems = order.orderItems
        orderItems.sort((a, b) => a.id - b.id);
        if (product) {
          product.stock += quantity;
        }
        this.store.dispatch(loadCartItemsSuccess({ items: orderItems }))
        this.showSuccess();
        this.IsWaitting = false;
      },
      error: (error) => {
        this.store.dispatch(loadCartItemsFailure({ error }));
        this.showError(error);
        this.IsWaitting = false;
      }
    });

  }
  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Cart item was updated successfully' });
  }
  showError(error: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
  }

  reduceItemQuantity(id: number) {
    if (this.IsWaitting) return;
    this.IsWaitting = true;
    const product = this.products.find((x) => x.id === id);

    this.orderService.addToCart({ email: 'admin@gmail.com', productId: id, quantity: -1 }).subscribe({
      next: (order: Order) => {
        let orderItems: OrderItem[] = [];
        if (order) orderItems = order.orderItems
        orderItems.sort((a, b) => a.id - b.id);
        this.store.dispatch(loadCartItemsSuccess({ items: orderItems }))
        if (product) {
          product.stock += 1;
        }
        this.showSuccess();
        this.IsWaitting = false;
      },
      error: (error) => {
        this.store.dispatch(loadCartItemsFailure({ error }));
        this.showError(error);
        this.IsWaitting = false;
      }
    });

  }
  addItemQuantity(id: number) {
    if (this.IsWaitting) return;
    this.IsWaitting = true;
    const product = this.products.find((x) => x.id === id);

    this.orderService.addToCart({ email: 'admin@gmail.com', productId: id, quantity: 1 }).subscribe({
      next: (order: Order) => {
        let orderItems: OrderItem[] = [];
        if (order) orderItems = order.orderItems
        orderItems.sort((a, b) => a.id - b.id);
        this.store.dispatch(loadCartItemsSuccess({ items: orderItems }))
        if (product && product.stock - 1 >= 0) {
          product.stock -= 1;
        } else {
          this.showError('Product is out of stock');
          return;
        }
        this.showSuccess();
        this.IsWaitting = false;
      },
      error: (error) => {
        console.log(error);
        this.store.dispatch(loadCartItemsFailure({ error }));
        this.showError(error.error.message);
        this.loadCartItems();
        this.IsWaitting = false;
      }
    });

  }
  updateCartItemQuantity(event: any, id: number) {
    if (this.IsWaitting) return;
    this.IsWaitting = true;
    const quantity = event.target.value;
    this.orderService.createOrUpdateCartItem({ email: 'admin@gmail.com', productId: id, quantity }).subscribe({
      next: (order: Order) => {
        let orderItems: OrderItem[] = [];
        if (order) orderItems = order.orderItems
        orderItems.sort((a, b) => a.id - b.id);
        this.store.dispatch(loadCartItemsSuccess({ items: orderItems }))
        this.showSuccess();
        this.getProducts();
        this.IsWaitting = false;
      },
      error: (error) => {
        this.store.dispatch(loadCartItemsFailure({ error }));
        this.showError(error.error.message);
        this.loadCartItems();
        this.getProducts();
        this.IsWaitting = false;
      }
    });

  }
}
