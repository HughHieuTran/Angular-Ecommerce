// src/app/store/cart.reducer.ts
import { Action, createReducer, on } from '@ngrx/store';
import { OrderItem as CartItem } from '../../types/types';
import {  loadCartItemsFailure, loadCartItemsSuccess } from './cart.actions';

export interface CartState {
    items: CartItem[];
    error: string | null;
}

export const initialState: CartState = {
    items: [],
    error: null
};

const _cartReducer = createReducer(
    initialState,
    on(loadCartItemsSuccess, (state, { items }) => ({
        ...state,
        items
    })),
    on(loadCartItemsFailure, (state, { error }) => ({
        ...state,
        error
    })),
);

export function cartReducer(state: CartState | undefined, action: Action) {
    return _cartReducer(state, action);
}
