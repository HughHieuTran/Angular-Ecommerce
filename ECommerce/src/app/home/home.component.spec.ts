import { ComponentFixture, inject, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { provideHttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of, throwError } from 'rxjs';
import { ProductService } from '../services/product.service';
import { Order, OrderItem, ProductQueryParams, Products, User } from '../../types/types';
import { OrderService } from '../services/order.service';
import { StoragesvService } from '../services/storagesv.service';
import { loadCartItemsFailure, loadCartItemsSuccess } from '../store/cart.actions';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let store: MockStore;
  let productService: ProductService;
  let orderService: OrderService;
  let storagesv: StoragesvService;
  let mockProducts: Products = {
    products: [
      { id: 1, name: 'Product 1', price: 100, stock: 10, category: 'shirt' },
      { id: 2, name: 'Product 2', price: 150, stock: 5, category: 'shirt' }
    ],
    total: 2
  };
  let mockOrders: Order[] = [
    {
      id: 2,
      orderDate: '2024-07-15',
      user: { email: 'test@gmail.com', username: 'John Doe', password: 'admin' },
      orderItems: [
        { id: 1, product: { id: 1, name: 'Product 1', price: 100, stock: 10, category: 'shirt' }, quantity: 2, totalPrice: 200 },
        { id: 2, product: { id: 2, name: 'Product 2', price: 150, stock: 5, category: 'shirt' }, quantity: 1, totalPrice: 150 }
      ],
      totalPrice: 200,
      IsOrdered: true,
      contactPhoneNumber: '012345678',
      address: 'hieu'
    }
  ];
  const initialState = {};

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideHttpClient(),
        MessageService,
        provideMockStore({ initialState }),
        {
          provide: OrderService,
          useValue: {
            getCart: jest.fn(),
            createOrUpdateCartItem: jest.fn(),
            addToCart: jest.fn()
          }
        },
        {
          provide: ProductService,
          useValue: {
            getAllProducts: jest.fn(),
            getProductCategories: jest.fn()
          }
        },
        {
          provide: StoragesvService,
          useValue: {
            getItem: jest.fn()
          }
        },
      ]
    })
      .compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    orderService = TestBed.inject(OrderService);
    storagesv = TestBed.inject(StoragesvService);

    jest.spyOn(productService, 'getAllProducts').mockReturnValue(of(mockProducts));
    //jest.spyOn(orderService, 'getCart').mockReturnValue(of(mockOrders));


    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should ngOnInit', () => {
    // Arrange
    const getProductsSpy = jest.spyOn(component, 'getProducts');
    const loadCartItemsSpy = jest.spyOn(component, 'loadCartItems');

    // Act
    component.ngOnInit();

    // Assert
    expect(getProductsSpy).toHaveBeenCalled();
    expect(loadCartItemsSpy).toHaveBeenCalled();
  });

  it('should calculate totalCartQuantity$ correctly', (done) => {
    // Arrange
    const mockCartItems: OrderItem[] = [
      { id: 1, product: { id: 1, name: 'Product 1', price: 100, stock: 10, category: 'shirt' }, quantity: 2, totalPrice: 200 },
      { id: 2, product: { id: 2, name: 'Product 2', price: 150, stock: 5, category: 'shirt' }, quantity: 1, totalPrice: 150 }
    ];

    // Mock cartItems$ observable
    component.cartItems$ = of(mockCartItems);

    // Act
    component.totalCartQuantity$.subscribe(totalQuantity => {
      // Assert
      expect(totalQuantity).toBe(10);
      done();
    });
    done();
  });

  it('should calculate totalCartPrice$', (done) => {
    // Arrange
    const mockCartItems: OrderItem[] = [
      { id: 1, product: { id: 1, name: 'Product 1', price: 100, stock: 10, category: 'shirt' }, quantity: 2, totalPrice: 200 },
      { id: 2, product: { id: 2, name: 'Product 2', price: 150, stock: 5, category: 'shirt' }, quantity: 1, totalPrice: 150 }

    ];
    component.cartItems$ = of(mockCartItems);

    // Act
    component.totalCartPrice$.subscribe(totalPrice => {
      // Assert
      expect(totalPrice).toBe(10);
      done();
    });
    done();
  });

  it('should getProductCategories', () => {
    // Arrange
    const mockCategories: string[] = ['Category 1', 'Category 2'];
    jest.spyOn(productService, 'getProductCategories').mockReturnValue(of(mockCategories));

    // Act
    component.getProductsCategories();

    // Assert
    expect(productService.getProductCategories).toHaveBeenCalled();
    setTimeout(() => {
      expect(component.isProductLoading).toBe(true);
      expect(component.categories).toEqual(mockCategories);
      expect(component.isProductLoading).toBe(false);
    });
  });

  it('should getAllProducts', () => {
    jest.spyOn(productService, 'getAllProducts').mockReturnValue(of(mockProducts));

    component.getProducts();

    expect(component.isProductLoading).toBe(true);
    expect(productService.getAllProducts).toHaveBeenCalledWith(component.queryParams);

    setTimeout(() => {
      expect(component.products).toEqual(mockProducts.products);
      expect(component.totalRecords).toEqual(mockProducts.total);
      expect(component.isProductLoading).toBe(false);
      expect(component.getProductsCategories).toHaveBeenCalled();
    });
  });

  it('should getProductsWithSearch', () => {
    // Arrange
    const searchText = 'test search';
    jest.spyOn(component, 'getProducts');

    // Act
    component.getProductsWithSearch(searchText);

    // Assert
    expect(component.queryParams.name).toBe(searchText);
    expect(component.currentPage).toBe(0);
    expect(component.queryParams.offset).toBe(0);
    expect(component.getProducts).toHaveBeenCalled();
  });

  it('should getProductsWithFilter', () => {
    // Arrange
    const query: ProductQueryParams = {
      name: 'test product',
      category: 'electronics',
      minPrice: 100,
      maxPrice: 500,
      availability: [true, true],
      rating: [true, true, true, true, true, true]
    };
    jest.spyOn(component, 'getProducts');

    // Act
    component.getProductsWithFilter(query);

    // Assert
    expect(component.queryParams).toEqual(query);
    expect(component.getProducts).toHaveBeenCalled();
  });

  it('should loadCart', () => {
    // Arrange
    const user: User = { email: 'user@example.com', password: "admin" }; // Mock user
    storagesv.getItem = jest.fn().mockReturnValue(user);
    jest.spyOn(orderService, 'getCart').mockReturnValue(of(mockOrders));

    const expectedOrderItems: OrderItem[] = [
      { id: 1, product: { id: 1, name: 'Product 1', price: 100, stock: 10, category: 'shirt' }, quantity: 2, totalPrice: 200 },
      { id: 2, product: { id: 2, name: 'Product 2', price: 150, stock: 5, category: 'shirt' }, quantity: 1, totalPrice: 150 }
    ];

    // Act
    component.loadCartItems();

    // Assert
    expect(storagesv.getItem).toHaveBeenCalledWith('user');
    expect(orderService.getCart).toHaveBeenCalledWith(user.email);

  });
  it('should dispatch loadCart error', () => {
    // Arrange
    const user = { email: 'user@example.com' }; // Mock user
    storagesv.getItem = jest.fn().mockReturnValue(user);
    jest.spyOn(orderService, 'getCart').mockReturnValue(throwError(() => new Error('Error')));
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    // Act
    component.loadCartItems();

    // Assert
    expect(storagesv.getItem).toHaveBeenCalledWith('user');
    expect(orderService.getCart).toHaveBeenCalledWith(user.email);

    // Check that the correct action is dispatched
    expect(dispatchSpy).toHaveBeenCalledWith(loadCartItemsFailure({ error: new Error('Error') }));
  });
  it('should onPageChange', () => {
    // Arrange
    const event = {
      first: 5,
      page: 2,
      rows: 10
    };
    const expectedOffset = event.page * event.rows;
    const expectedLimit = event.rows;

    const getProductsSpy = jest.spyOn(component, 'getProducts');

    // Act
    component.onPageChange(event);

    // Assert
    expect(component.currentPage).toBe(event.first);
    expect(component.queryParams.offset).toBe(expectedOffset);
    expect(component.queryParams.limit).toBe(expectedLimit);
    expect(getProductsSpy).toHaveBeenCalled();
  });

  it('should showSidebar', () => {
    // Arrange
    jest.spyOn(component, 'loadCartItems');

    // Act
    component.showSidebar();

    // Assert
    expect(component.isSidebarVisible).toBe(true);
    expect(component.loadCartItems).toHaveBeenCalled();
  });

  it('should deleteProduct', () => {
    // Arrange
    const id = 1;
    const quantity = 5;
    storagesv.getItem = jest.fn().mockReturnValue({ email: 'user@example.com' });
    jest.spyOn(orderService, 'createOrUpdateCartItem').mockReturnValue(of(mockOrders[0]));
    jest.spyOn(component, 'showSuccess');
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    // Act
    component.deleteProduct(id, quantity);

    // Assert
    expect(storagesv.getItem).toHaveBeenCalledWith('user');
    expect(orderService.createOrUpdateCartItem).toHaveBeenCalledWith({ email: 'user@example.com', productId: id, quantity: 0 });

    // Check store dispatches
    const expectedOrderItems: OrderItem[] = [
      { id: 1, product: { id: 1, name: 'Product 1', price: 100, stock: 10, category: 'shirt' }, quantity: 2, totalPrice: 200 },
      { id: 2, product: { id: 2, name: 'Product 2', price: 150, stock: 5, category: 'shirt' }, quantity: 1, totalPrice: 150 }
    ];
    expect(dispatchSpy).toHaveBeenCalledWith(loadCartItemsSuccess({ items: expectedOrderItems }));
    expect(component.showSuccess).toHaveBeenCalled();
    expect(component.IsWaitting).toBe(false);
  });

  it('should handle error deleteProduct', () => {
    // Arrange
    const id = 1;
    const quantity = 5;
    storagesv.getItem = jest.fn().mockReturnValue({ email: 'user@example.com' });
    jest.spyOn(orderService, 'createOrUpdateCartItem').mockReturnValue(throwError(() => new Error('Error')));
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    jest.spyOn(component, 'showError');

    // Act
    component.deleteProduct(id, quantity);

    // Assert
    expect(storagesv.getItem).toHaveBeenCalledWith('user');
    expect(orderService.createOrUpdateCartItem).toHaveBeenCalledWith({ email: 'user@example.com', productId: id, quantity: 0 });

    // Check store dispatches
    expect(dispatchSpy).toHaveBeenCalledWith(loadCartItemsFailure({ error: new Error('Error') }));
    expect(component.IsWaitting).toBe(false);
  });

  it('should reduceItemQuantity', () => {
    // Arrange

    component.IsWaitting = false;
    const id = 1;
    storagesv.getItem = jest.fn().mockReturnValue({ email: 'user@example.com' });
    jest.spyOn(orderService, 'addToCart').mockReturnValue(of(mockOrders[0]));
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const showSuccessSpy = jest.spyOn(component, 'showSuccess');

    // Act
    component.reduceItemQuantity(id);

    // Assert
    expect(storagesv.getItem).toHaveBeenCalledWith('user');
    expect(orderService.addToCart).toHaveBeenCalledWith({ email: 'user@example.com', productId: id, quantity: -1 });

    // Check store dispatches
    const expectedOrderItems: OrderItem[] = [
      { id: 1, product: { id: 1, name: 'Product 1', price: 100, stock: 10, category: 'shirt' }, quantity: 2, totalPrice: 200 },
      { id: 2, product: { id: 2, name: 'Product 2', price: 150, stock: 5, category: 'shirt' }, quantity: 1, totalPrice: 150 }
    ];
    expect(dispatchSpy).toHaveBeenCalledWith(loadCartItemsSuccess({ items: expectedOrderItems }));
    expect(showSuccessSpy).toHaveBeenCalled();
    expect(component.IsWaitting).toBe(false);
    expect(mockProducts.products.find(p => p.id === id)?.stock).toBe(16); // Check if stock is updated correctly
  });

  it('should handle reduceItemQuantity error', () => {
    // Arrange
    component.IsWaitting = false;
    const id = 1;
    storagesv.getItem = jest.fn().mockReturnValue({ email: 'user@example.com' });
    jest.spyOn(orderService, 'addToCart').mockReturnValue(throwError(() => new Error('Error')));
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const showErrorSpy = jest.spyOn(component, 'showError');

    // Act
    component.reduceItemQuantity(id);

    // Assert
    expect(storagesv.getItem).toHaveBeenCalledWith('user');
    expect(orderService.addToCart).toHaveBeenCalledWith({ email: 'user@example.com', productId: id, quantity: -1 });

    // Check store dispatches
    expect(dispatchSpy).toHaveBeenCalledWith(loadCartItemsFailure({ error: new Error('Error') }));
    expect(showErrorSpy).toHaveBeenCalledWith(new Error('Error'));
    expect(component.IsWaitting).toBe(false);
  });

  it('should addItemQuantity', () => {
    // Arrange
    component.IsWaitting = false;
    const id = 1;
    storagesv.getItem = jest.fn().mockReturnValue({ email: 'user@example.com' });
    jest.spyOn(orderService, 'addToCart').mockReturnValue(of(mockOrders[0]));
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const showSuccessSpy = jest.spyOn(component, 'showSuccess');

    // Act
    component.addItemQuantity(id);

    // Assert
    expect(storagesv.getItem).toHaveBeenCalledWith('user');
    expect(orderService.addToCart).toHaveBeenCalledWith({ email: 'user@example.com', productId: id, quantity: 1 });

    // Check store dispatches
    const expectedOrderItems: OrderItem[] = [
      { id: 1, product: { id: 1, name: 'Product 1', price: 100, stock: 10, category: 'shirt' }, quantity: 2, totalPrice: 200 },
      { id: 2, product: { id: 2, name: 'Product 2', price: 150, stock: 5, category: 'shirt' }, quantity: 1, totalPrice: 150 }
    ];
    expect(dispatchSpy).toHaveBeenCalledWith(loadCartItemsSuccess({ items: expectedOrderItems }));
    expect(showSuccessSpy).toHaveBeenCalled();
    expect(component.IsWaitting).toBe(false);
    expect(mockProducts.products.find(p => p.id === id)?.stock).toBe(15); // Check if stock is updated correctly
  });

  it('should handle addItemQuantity error', () => {
    // Arrange
    component.IsWaitting = false;
    const id = 1;
    storagesv.getItem = jest.fn().mockReturnValue({ email: 'user@example.com' });
    jest.spyOn(orderService, 'addToCart').mockReturnValue(throwError(() => new Error('Error')));
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const loadCartItemsSpy = jest.spyOn(component, 'loadCartItems');

    // Act
    component.addItemQuantity(id);

    // Assert
    expect(storagesv.getItem).toHaveBeenCalledWith('user');
    expect(orderService.addToCart).toHaveBeenCalledWith({ email: 'user@example.com', productId: id, quantity: 1 });

    // Check store dispatches
    expect(dispatchSpy).toHaveBeenCalledWith(loadCartItemsFailure({ error: new Error('Error') }));
    expect(loadCartItemsSpy).not.toHaveBeenCalled();
    expect(component.IsWaitting).toBe(true);
  });

  it('should updateCartItemQuantity', () => {
    // Arrange
    component.IsWaitting = false;
    const event = { target: { value: 1 } };
    const id = 1;
    storagesv.getItem = jest.fn().mockReturnValue({ email: 'user@example.com' });
    jest.spyOn(orderService, 'createOrUpdateCartItem').mockReturnValue(of(mockOrders[0]));
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const showSuccessSpy = jest.spyOn(component, 'showSuccess');
    const getProductsSpy = jest.spyOn(component, 'getProducts');

    // Act
    component.updateCartItemQuantity(event, id);

    // Assert
    expect(storagesv.getItem).toHaveBeenCalledWith('user');
    expect(orderService.createOrUpdateCartItem).toHaveBeenCalledWith({ email: 'user@example.com', productId: id, quantity: 1 });

    // Check store dispatches
    const expectedOrderItems: OrderItem[] = [
      { id: 1, product: { id: 1, name: 'Product 1', price: 100, stock: 10, category: 'shirt' }, quantity: 2, totalPrice: 200 },
      { id: 2, product: { id: 2, name: 'Product 2', price: 150, stock: 5, category: 'shirt' }, quantity: 1, totalPrice: 150 }
    ];
    expect(dispatchSpy).toHaveBeenCalledWith(loadCartItemsSuccess({ items: expectedOrderItems }));
    expect(showSuccessSpy).toHaveBeenCalled();
    expect(getProductsSpy).toHaveBeenCalled();
    expect(component.IsWaitting).toBe(false);
  });

  it('should handle updateCartItemQuantity error ', () => {
    // Arrange
    component.IsWaitting = false;
    const event = { target: { value: 1 } };
    const id = 1;
    storagesv.getItem = jest.fn().mockReturnValue({ email: 'user@example.com' });
    jest.spyOn(orderService, 'createOrUpdateCartItem').mockReturnValue(throwError(() => new Error('Error')));
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    // const showErrorSpy = jest.spyOn(component, 'showError');
    const loadCartItemsSpy = jest.spyOn(component, 'loadCartItems');
    const getProductsSpy = jest.spyOn(component, 'getProducts');

    // Act
    component.updateCartItemQuantity(event, id);

    // Assert
    expect(storagesv.getItem).toHaveBeenCalledWith('user');
    expect(orderService.createOrUpdateCartItem).toHaveBeenCalledWith({ email: 'user@example.com', productId: id, quantity: 1 });

    // Check store dispatches
    expect(dispatchSpy).toHaveBeenCalledWith(loadCartItemsFailure({ error: new Error('Error') }));
    // expect(showErrorSpy).toHaveBeenCalledWith('Error');
    // expect(loadCartItemsSpy).toHaveBeenCalled();
    // expect(getProductsSpy).toHaveBeenCalled();

  });



});
