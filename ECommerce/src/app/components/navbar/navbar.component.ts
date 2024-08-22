import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { StoragesvService } from '../../services/storagesv.service';
import { User } from '../../../types/types';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, DialogModule, ButtonModule, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  user: User | null;
  constructor(private storage: StoragesvService, private router: Router, private userService: UserService, private messageService: MessageService) {
    this.user = storage.getItem('user') as User;
  }
  visible: boolean = false;
  isFormError: boolean = false;
  email: string = '';
  password: string = '';

  toggleLoginPopup() {
    this.visible = true;
  }
  logout() {
    this.storage.removeItem('user');
    this.user = null;
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'You have Logged out successfully' });
  }
  login() {
    if (this.email.length < 6 || this.password.length < 3) {
      this.isFormError = true;
      setTimeout(() => this.isFormError = false, 3000);
      return;
    }
    this.userService.loginUser({ email: this.email, password: this.password }).subscribe({
      next: (user) => {
        this.user = user, this.storage.setItem('user', user),
          this.visible = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'You have login successfully' });
      },
      error: (error) => {
        console.log(error);
        this.isFormError = true;
        setTimeout(() => this.isFormError = false, 3000);
      }
    })
  }
}
