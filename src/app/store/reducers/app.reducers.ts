import { ActionReducerMap } from '@ngrx/store';
import { profileReducer, ProfileState } from './profile.reducer';
import { catalogReducer, CatalogState } from './catalog.reducer';
import { adminStoreReducer, AdminStoreState } from './admin-store.reducer';

export interface State{
    profile:ProfileState,
    catalog:CatalogState,
    adminStore:AdminStoreState
}

export const reducers: ActionReducerMap<State> = {
  profile: profileReducer,
  catalog: catalogReducer,
  adminStore:adminStoreReducer
};