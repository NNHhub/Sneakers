import { ActionReducerMap } from '@ngrx/store';
import { profileReducer, ProfileState } from './profile.reducer';
import { catalogReducer, CatalogState } from './catalog.reducer';
import { adminStoreReducer, AdminStoreState } from './admin-store.reducer';
import { basketReducer, BasketState } from './basket.reducer';
import { popularReducer, PopularState } from './popular.reducer';

export interface State{
    profile:ProfileState,
    catalog:CatalogState,
    adminStore:AdminStoreState,
    basket:BasketState,
    popular:PopularState
}

export const reducers: ActionReducerMap<State> = {
  profile: profileReducer,
  catalog: catalogReducer,
  adminStore:adminStoreReducer,
  basket: basketReducer,
  popular: popularReducer
};