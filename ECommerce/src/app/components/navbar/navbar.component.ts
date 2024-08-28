import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { StoragesvService } from '../../services/storagesv.service';
import { Order, OrderItem, User } from '../../../types/types';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { MessageService } from 'primeng/api';
import { Store } from '@ngrx/store';
import { loadCartItemsFailure, loadCartItemsSuccess } from '../../store/cart.actions';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, DialogModule, ButtonModule, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  user: User | null;
  constructor(private storage: StoragesvService, private router: Router, private userService: UserService, private messageService: MessageService, private orderService: OrderService) {
    this.user = storage.getItem('user') as User;
  }
  visible: boolean = false;
  isFormError: boolean = false;
  email: string = '';
  password: string = '';
  username: string = '';
  private store = inject(Store);
  typeOfForm: string = 'Login';

  toggleLoginPopup() {
    this.visible = true;
  }
  logout() {
    this.storage.removeItem('user');
    this.user = null;
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'You have Logged out successfully' });
    this.store.dispatch(loadCartItemsSuccess({ items: [] }))
  }
  login() {
    if (this.email.length < 6 || this.password.length < 3) {
      this.isFormError = true;
      setTimeout(() => this.isFormError = false, 3000);
      return;
    }
    this.userService.loginUser({ email: this.email, password: this.password }).subscribe({
      next: (user) => {
        this.user = user, this.storage.setItem('user', user);
        this.visible = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'You have login successfully' });
        this.loadCartItems();
      },
      error: (error) => {
        console.log(error);
        this.isFormError = true;
        setTimeout(() => this.isFormError = false, 3000);
      }
    })
  }
  signUp() {
    if (this.email.length < 6 || this.password.length < 3 || this.username.length < 3) {
      this.isFormError = true;
      setTimeout(() => this.isFormError = false, 3000);
      return;
    }
    this.userService.registerUser({ email: this.email, password: this.password, username: this.username }).subscribe({
      next: (user) => {
        this.user = user, this.storage.setItem('user', user);
        this.visible = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'You have signup and login successfully' });
        this.loadCartItems();
      },
      error: (error) => {
        console.log(error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
      }
    })
  }
  private loadCartItems() {
    const user: User | null = this.storage.getItem('user');
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

  toggleForm(type: string) {
    this.typeOfForm = type;
  }
}
