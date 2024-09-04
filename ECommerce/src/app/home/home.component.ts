import { ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { SearchComponent } from '../components/search/search.component';
import { ProductService } from '../services/product.service';
import { Order, OrderItem, Product, ProductQueryParams, Products, User } from '../../types/types';
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
import { StoragesvService } from '../services/storagesv.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SearchComponent, ProductCardComponent, CommonModule, PaginatorModule, SidebarModule, BadgeModule, ButtonModule, ToastModule, InputNumberModule, ProgressSpinnerModule, PriceFormatterPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private readonly productService: ProductService, private readonly orderService: OrderService, private messageService: MessageService, private storagesv: StoragesvService, private router: Router) {
    this.loadCartItems();
  }
  @ViewChild('paginator') paginator: Paginator | undefined;
  private store = inject(Store);
  cartItems$: Observable<OrderItem[]> = this.store.pipe(select(selectCartItems));
  isProductLoading: boolean = false;
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
  categories: string[] = [];
  isSidebarVisible = false;
  queryParams: ProductQueryParams = {
    limit: 12,
    offset: 0,
    availability: [true, true],
    rating: [true, true, true, true, true, true]
  };
  currentPage: number = 0;
  totalRecords: number = 20;
  IsWaitting: boolean = false;

  ngOnInit() {
    this.getProducts();
    this.loadCartItems();
  }
  getProductsWithSearch(searchText: string) {
    this.queryParams.name = searchText;
    this.currentPage = 0;
    this.queryParams.offset = 0;
    this.getProducts();
  }

  getProductsWithFilter(query: ProductQueryParams) {
    this.queryParams = query;
    this.getProducts();
  }
  getProductsCategories() {
    this.isProductLoading = true;
    this.productService.getProductCategories().subscribe({
      next: (data: string[]) => {
        this.categories = data;
        this.isProductLoading = false;
      },
      error: (error) => { console.log(error); this.isProductLoading = false; }
    });

  }
  getProducts() {
    this.isProductLoading = true;
    this.productService.getAllProducts(this.queryParams).subscribe({
      next: (data: Products) => {
        this.products = data.products;
        this.totalRecords = data.total;
        this.isProductLoading = false;
        this.getProductsCategories();
      },
      error: (error) => { console.log(error); this.isProductLoading = false; }
    });

  }
  loadCartItems() {
    const user: User | null = this.storagesv.getItem('user');
    if (user) {
      this.orderService.getCart(user.email).subscribe({
        next: (orders: Order[]) => {
          let orderItems: OrderItem[] = [];
          if (orders.length > 0) orderItems = orders[0].orderItems;
          orderItems.sort((a, b) => a.id - b.id);
          this.store.dispatch(loadCartItemsSuccess({ items: orderItems }))
        },
        error: (error) => this.store.dispatch(loadCartItemsFailure({ error }))
      });
    } else {
      this.store.dispatch(loadCartItemsSuccess({ items: [] }))
    }
  }
  onPageChange(event: any) {
    this.currentPage = event.first;
    this.queryParams.offset = event.page * event.rows;
    this.queryParams.limit = event.rows;
    this.getProducts();
  }
  showSidebar() {
    this.isSidebarVisible = true;
    this.loadCartItems();
  }
  deleteProduct(id: number | undefined, quantity: number) {
    if (this.IsWaitting) return;
    this.IsWaitting = true;
    if (id == undefined) return;
    const user: User | null = this.storagesv.getItem('user');
    if (!user) return;
    const product = this.products.find((x) => x.id === id);
    this.orderService.createOrUpdateCartItem({ email: user.email, productId: id, quantity: 0 }).subscribe({
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
    const user: User | null = this.storagesv.getItem('user');
    if (!user) return;
    const product = this.products.find((x) => x.id === id);

    this.orderService.addToCart({ email: user.email, productId: id, quantity: -1 }).subscribe({
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
    const user: User | null = this.storagesv.getItem('user');
    if (!user) return;
    this.orderService.addToCart({ email: user.email, productId: id, quantity: 1 }).subscribe({
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
    const user: User | null = this.storagesv.getItem('user');
    if (!user) return;
    this.orderService.createOrUpdateCartItem({ email: user.email, productId: id, quantity }).subscribe({
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
