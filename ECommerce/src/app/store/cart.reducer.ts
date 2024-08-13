// src/app/store/cart.reducer.ts
import { Action, createReducer, on } from '@ngrx/store';
import { OrderItem as CartItem } from '../../types/types';
import { addItem, removeItem, updateItem } from './cart.actions';

export interface CartState {
    items: CartItem[];
}

export const initialState: CartState = {
    items: []
};

const _cartReducer = createReducer(
    initialState,
    on(addItem, (state, { item }) => ({
        ...state,
        items: [...state.items, item]
    })),
    on(removeItem, (state, { id }) => ({
        ...state,
        items: state.items.filter(item => item.id !== id)
    })),
    on(updateItem, (state, { item }) => ({
        ...state,
        items: state.items.map(i => i.id === item.id ? item : i)
    }))
);

export function cartReducer(state: CartState | undefined, action: Action) {
    return _cartReducer(state, action);
}
