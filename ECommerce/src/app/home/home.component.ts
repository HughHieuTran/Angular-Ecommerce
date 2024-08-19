import { ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { SearchComponent } from '../components/search/search.component';
import { ProductService } from '../services/product.service';
import { Order, OrderItem, Product, ProductQueryParams } from '../../types/types';
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
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SearchComponent, ProductCardComponent, CommonModule, PaginatorModule, SidebarModule, BadgeModule, ButtonModule, ToastModule, InputNumberModule, ProgressSpinnerModule],
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

  ngOnInit() {
    this.getProducts();
    this.loadCartItems();
  }
  getProductsWithSearch(searchText: string) {
    this.queryParams.name = searchText;
    this.getProducts();
  }
  getProducts() {
    this.isProductLoading = true;
    this.productService.getAllProducts(this.queryParams).subscribe({
      next: (data: Product[]) => {
        data.sort((a, b) => a.id - b.id)
        this.products = data;
      },
      error: (error) => console.log(error)
    });
    this.isProductLoading = false;
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
    if (id == undefined) return;
    const product = this.products.find((x) => x.id === id);
    if (product) {
      this.orderService.createOrUpdateCartItem({ email: 'admin@gmail.com', productId: id, quantity: 0 }).subscribe({
        next: (order: Order) => {
          let orderItems: OrderItem[] = [];
          if (order) orderItems = order.orderItems
          orderItems.sort((a, b) => a.id - b.id);
          product.stock += quantity;
          this.store.dispatch(loadCartItemsSuccess({ items: orderItems }))
          this.showSuccess();
        },
        error: (error) => {
          this.store.dispatch(loadCartItemsFailure({ error }));
          this.showError(error);
        }
      });
    }
  }
  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Cart item was updated successfully' });
  }
  showError(error: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
  }

  reduceItemQuantity(id: number) {
    const product = this.products.find((x) => x.id === id);
    if (product) {
      this.orderService.addToCart({ email: 'admin@gmail.com', productId: id, quantity: -1 }).subscribe({
        next: (order: Order) => {
          let orderItems: OrderItem[] = [];
          if (order) orderItems = order.orderItems
          orderItems.sort((a, b) => a.id - b.id);
          this.store.dispatch(loadCartItemsSuccess({ items: orderItems }))
          product.stock += 1;
          this.showSuccess();
        },
        error: (error) => {
          this.store.dispatch(loadCartItemsFailure({ error }));
          this.showError(error);
        }
      });
    }
  }
  addItemQuantity(id: number) {
    const product = this.products.find((x) => x.id === id);
    if (product && product.stock - 1 > 0) {
      this.orderService.addToCart({ email: 'admin@gmail.com', productId: id, quantity: 1 }).subscribe({
        next: (order: Order) => {
          let orderItems: OrderItem[] = [];
          if (order) orderItems = order.orderItems
          orderItems.sort((a, b) => a.id - b.id);
          this.store.dispatch(loadCartItemsSuccess({ items: orderItems }))
          product.stock -= 1;
          this.showSuccess();
        },
        error: (error) => {
          this.store.dispatch(loadCartItemsFailure({ error }));
          this.showError(error);
        }
      });
    } else {
      this.showError('Product is out of stock');
    }
  }
  updateCartItemQuantity(event: any, id: number) {
    const quantity = event.target.value;
    const product = this.products.find((x) => x.id === id);
    if (product && product.stock - quantity > 0) {
      this.orderService.createOrUpdateCartItem({ email: 'admin@gmail.com', productId: id, quantity }).subscribe({
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
    } else {
      this.showError('Product is out of stock');
    }
  }
}
