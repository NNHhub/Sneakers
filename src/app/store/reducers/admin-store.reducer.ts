import { createReducer, on } from '@ngrx/store';
import * as adminStoreActions from '../actions/admin-store.action';
import { ISneakers } from 'app/catalog/model/sneaker.model';

export interface AdminStoreState {
  adminStore:ISneakers[]|null
}

export const initialState: AdminStoreState = {
  adminStore:null
}

export const adminStoreReducer = createReducer(
  initialState,
  on(adminStoreActions.getAdminStoreSuccess, (state,{adminStore})=> ({
    ...state,
    adminStore:state.adminStore ? [...state.adminStore,...adminStore] : adminStore
  })),

  on(adminStoreActions.deleteAdminStore, (state)=> ({
    ...state,
    adminStore:[]
  })),
)