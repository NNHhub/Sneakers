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
    basket: state.basket ? [...state.basket?.filter( val => !(val.id == item.id && val.size == item.size) ), item] : [item]
  })),

  on(basketActions.updateBasketItemSuccess, (state,{ item })=> ({
    ...state,
    basket: state.basket?.map((value)=> {
      if(value.id === item.id && value.size === item.size){
        return item;
      } else {
        return value;
      }
    }) as ISneakers[]
  })),

  on(basketActions.deleteBasketItemSuccess, (state,{ id, size })=> ({
    ...state,
    basket: state.basket?.filter( item => !(item.id == id && item.size == size) ) as ISneakers[]
  })),
)