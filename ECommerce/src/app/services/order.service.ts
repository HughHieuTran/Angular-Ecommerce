import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order, OrderDto, updateORderItemDto } from '../../types/types';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }
  link = "http://localhost:3000/";
  getCart(email: string): Observable<Order[]> {
    return this.http.get<Order[]>(this.link + 'order/' + email);
  }
  getHistoryOrder(email: string): Observable<Order[]> {
    return this.http.get<Order[]>(this.link + 'order/history/' + email);
  }
  createOrUpdateCartItem(orderDto: updateORderItemDto): Observable<Order> {
    return this.http.post<Order>(this.link + 'order/update', orderDto);
  }

  addToCart(orderDto: updateORderItemDto): Observable<Order> {
    return this.http.post<Order>(this.link + 'order/add', orderDto);
  }
}
