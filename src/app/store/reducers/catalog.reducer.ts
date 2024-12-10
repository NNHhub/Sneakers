import { createReducer, on } from '@ngrx/store';
import * as catalogActions from '../actions/catalog.action';
import { ISneakers } from 'app/catalog/model/sneaker.model';

export interface CatalogState {
  catalog:ISneakers[]|null
}

export const initialState: CatalogState = {
  catalog:null
}

export const catalogReducer = createReducer(
  initialState,
  on(catalogActions.getCatalogSuccess, (state,{catalog})=> ({
    ...state,
    catalog
  }))
)