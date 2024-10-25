import { ActionReducerMap } from '@ngrx/store';
import { profileReducer, ProfileState } from './profile.reducer';

export interface State{
    profile:ProfileState
}

export const reducers: ActionReducerMap<State> = {
  profile: profileReducer,
};