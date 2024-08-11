import { Routes } from '@angular/router';
import { CartDetailComponent } from './cart-detail/cart-detail.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'cart-details',
        component: CartDetailComponent,
    },
];
