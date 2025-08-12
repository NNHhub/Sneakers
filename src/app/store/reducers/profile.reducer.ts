import { createReducer, on } from '@ngrx/store';
import * as profileActions from '../actions/profile.action';
import { IProfile } from 'app/profile/models/profile.model';

export interface ProfileState {
  profile:IProfile|null
}

export const initialState: ProfileState = {
  profile:null
}

export const profileReducer = createReducer(
  initialState,
  on(profileActions.getProfileSuccess, (state,{ profile })=> ({
    ...state,
    profile
  })),
  on(profileActions.changeProfile, (state,{ profile })=> ({
    ...state,
    profile:{...profile,role:state.profile?.role as string}
  })),
)