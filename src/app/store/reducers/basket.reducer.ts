import { createReducer, on } from '@ngrx/store';
import * as basketActions from '../actions/basket.action';
import { ISneakers } from 'app/catalog/model/sneaker.model';

export interface BasketState {
  basket:ISneakers[]|null
}

export const initialState: BasketState = {
  basket:null
}

export const basketReducer = createReducer(
  initialState,
  on(basketActions.getBasketSuccess, (state,{ basket })=> ({
    ...state,
    basket: basket
  })),

  on(basketActions.addBasketItemSuccess, (state,{ item })=> ({
    ...state,
    basket: state.basket ? [...state.basket, item] : [item]
  })),

  on(basketActions.deleteBasketItemSuccess, (state,{ id })=> ({
    ...state,
    basket: state.basket?.filter( item => item.id !== id ) as ISneakers[]
  })),
)