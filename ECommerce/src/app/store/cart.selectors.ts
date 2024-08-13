// src/app/store/cart.selectors.ts
import { createSelector } from '@ngrx/store';
import { CartState } from './cart.reducer';

export const selectCartState = (state: { cart: CartState }) => state.cart;

export const selectCartItems = createSelector(
  selectCartState,
  (state: CartState) => state.items
);
