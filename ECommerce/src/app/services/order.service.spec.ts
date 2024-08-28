import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { OrderService } from './order.service';
import { Order, OrderDto, updateORderItemDto } from '../../types/types';
import { provideHttpClient } from '@angular/common/http';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;
  let mockLink: string = 'http://localhost:3000/';
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCart', () => {
    it('should return an Observable<Order[]>', () => {
      const dummyOrders: Order[] = [
        {
          id: 1,
          orderDate: '2024-08-22',
          user: { email: 'test@gmail.com', username: 'John Doe', password: 'admin' }, // Example User
          orderItems: [
            { id: 1, product: { id: 1, name: 'Product 1', price: 100, stock: 10 }, quantity: 2, totalPrice: 200 },
            { id: 2, product: { id: 2, name: 'Product 2', price: 150, stock: 5 }, quantity: 1, totalPrice: 150 }
          ],
          totalPrice: 350,
          IsOrdered: false
        }
      ];
      service.getCart('test@gmail.com').subscribe(orders => {
        expect(orders.length).toBe(1);
        expect(orders).toEqual(dummyOrders);
      });
      
      const req = httpMock.expectOne(`${mockLink}order/test@gmail.com`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyOrders);
    });
  });


  describe('getHistoryOrder', () => {
    it('should return an Observable<Order[]>', () => {
      const dummyOrders: Order[] = [
        {
          id: 2,
          orderDate: '2024-07-15',
          user: { email: 'test@gmail.com', username: 'John Doe', password: 'admin' }, // Example User
          orderItems: [
            { id: 1, product: { id: 1, name: 'Product 1', price: 100, stock: 10 }, quantity: 2, totalPrice: 200 },
            { id: 2, product: { id: 2, name: 'Product 2', price: 150, stock: 5 }, quantity: 1, totalPrice: 150 }
          ],
          totalPrice: 200,
          IsOrdered: true
        }
      ];

      service.getHistoryOrder('test@example.com').subscribe(orders => {
        expect(orders.length).toBe(1);
        expect(orders).toEqual(dummyOrders);
      });

      const req = httpMock.expectOne(`${mockLink}order/history/test@example.com`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyOrders);
    });
  });

  describe('createOrUpdateCartItem', () => {
    it('should return an Observable<Order>', () => {
      const dummyOrder: Order = {
        id: 1,
        orderDate: '2024-08-22',
        user: { email: 'test@gmail.com', username: 'John Doe', password: 'admin' }, // Example User
        orderItems: [
          { id: 1, product: { id: 1, name: 'Product 1', price: 100, stock: 10 }, quantity: 2, totalPrice: 200 },
          { id: 2, product: { id: 2, name: 'Product 2', price: 150, stock: 5 }, quantity: 1, totalPrice: 150 }
        ],
        totalPrice: 200,
        IsOrdered: false
      };
      const orderDto: updateORderItemDto = { email: 'test@gmail.com', productId: 1, quantity: 2 };

      service.createOrUpdateCartItem(orderDto).subscribe(order => {
        expect(order).toEqual(dummyOrder);
      });

      const req = httpMock.expectOne(`${mockLink}order/update`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(orderDto);
      req.flush(dummyOrder);
    });
  });

  describe('addToCart', () => {
    it('should return an Observable<Order>', () => {
      const dummyOrder: Order = {
        id: 1,
        orderDate: '2024-08-22',
        user: { email: 'test@gmail.com', username: 'John Doe', password: 'admin' }, // Example User
        orderItems: [
          { id: 1, product: { id: 1, name: 'Product 1', price: 100, stock: 10 }, quantity: 2, totalPrice: 200 },
          { id: 2, product: { id: 2, name: 'Product 2', price: 150, stock: 5 }, quantity: 1, totalPrice: 150 }
        ],
        totalPrice: 200,
        IsOrdered: false
      };
      const orderDto: updateORderItemDto = { email: 'test@gmail.com', productId: 1, quantity: 2 };

      service.addToCart(orderDto).subscribe(order => {
        expect(order).toEqual(dummyOrder);
      });

      const req = httpMock.expectOne(`${mockLink}order/add`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(orderDto);
      req.flush(dummyOrder);
    });
  });

  describe('payOrder', () => {
    it('should return an Observable<boolean>', () => {
      service.payOrder('test@example.com').subscribe(result => {
        expect(result).toBe(true);
      });

      const req = httpMock.expectOne(`${mockLink}order/pay/test@example.com`);
      expect(req.request.method).toBe('POST');
      req.flush(true);
    });
  });

});
