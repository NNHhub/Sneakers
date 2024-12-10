import { ActionReducerMap } from '@ngrx/store';
import { profileReducer, ProfileState } from './profile.reducer';
import { catalogReducer, CatalogState } from './catalog.reducer';

export interface State{
    profile:ProfileState,
    catalog:CatalogState
}

export const reducers: ActionReducerMap<State> = {
  profile: profileReducer,
  catalog: catalogReducer
};