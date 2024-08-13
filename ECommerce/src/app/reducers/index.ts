import { isDevMode } from "@angular/core";
import {
    ActionReducer,
    ActionReducerMap,
    createFeature,
    createSelector,
    MetaReducer
} from "@ngrx/store";
import { cartReducer } from "../store/cart.reducer";

export interface State {

}

export const reducers: ActionReducerMap<State> = {
    cart: cartReducer
}

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];