import { Component, inject, ViewChild } from '@angular/core';
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
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SearchComponent, ProductCardComponent, CommonModule, PaginatorModule, SidebarModule, BadgeModule, ButtonModule, ToastModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private store = inject(Store);
  cartItems$: Observable<OrderItem[]> = this.store.pipe(select(selectCartItems));
  error$: Observable<any> = this.store.select(state => state.cart.error);
  totalCartQuantity$: Observable<number> = this.cartItems$.pipe(
    map(items => items.reduce((sum, item) => sum + item.quantity, 0))
  );

  constructor(private readonly productService: ProductService, private readonly orderService: OrderService, private messageService: MessageService) {
    this.loadCartItems();
  }
  @ViewChild('paginator') paginator: Paginator | undefined;

  isSidebarVisible = false;
  products: Product[] = [];
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
    this.productService.getAllProducts(this.queryParams).subscribe({
      next: (data: Product[]) => {
        this.products = data;
      },
      error: (error) => console.log(error)
    });
  }
  private loadCartItems() {
    this.orderService.getCart('admin@gmail.com').subscribe({
      next: (orders: Order[]) => {
        let orderItems: OrderItem[] = [];
        if (orders.length > 0) orderItems = orders[0].orderItems
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

  deleteProduct(id: number | undefined) {
    if (id == undefined) return;
    this.orderService.createOrUpdateCartItem({ email: 'admin@gmail.com', productId: id, quantity: 0 }).subscribe({
      next: (order: Order) => {
        let orderItems: OrderItem[] = [];
        if (order) orderItems = order.orderItems
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
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Item was removed from cart successfully' });
  }
  showError(error: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error' });
  }
}
