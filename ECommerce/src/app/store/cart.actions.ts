// src/app/store/cart.actions.ts
import { createAction, props } from '@ngrx/store';
import { OrderItem as CartItem } from '../../types/types';


export const loadCartItems = createAction('[Cart] Load Cart Items');
export const loadCartItemsSuccess = createAction('[Cart] Load Cart Items Success', props<{ items: CartItem[] }>());
export const loadCartItemsFailure = createAction('[Cart] Load Cart Items Failure', props<{ error: any }>());
