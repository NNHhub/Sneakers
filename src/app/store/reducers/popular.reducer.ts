import { createReducer, on } from '@ngrx/store';
import * as popularActions from '../actions/popular.action';
import { ISneakers } from 'app/catalog/model/sneaker.model';

export interface PopularState {
  popular:ISneakers[]|null
}

export const initialState: PopularState = {
  popular:null
}

export const popularReducer = createReducer(
  initialState,
  on(popularActions.getPopularListSuccess, (state,{ popular })=> ({
    ...state,
    popular: popular
  }))
)