// src/app/store/cart.actions.ts
import { createAction, props } from '@ngrx/store';
import { OrderItem as CartItem } from '../../types/types';

export const addItem = createAction(
    '[Cart] Add Item',
    props<{ item: CartItem }>()
);

export const removeItem = createAction(
    '[Cart] Remove Item',
    props<{ id: number }>()
);

export const updateItem = createAction(
    '[Cart] Update Item',
    props<{ item: CartItem }>()
);
