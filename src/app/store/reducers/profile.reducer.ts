import { createReducer, on } from '@ngrx/store';
import * as profileActions from '../actions/profile.action';
import { IProfile } from 'app/profile/models/profile.model';
import { ProfileSecurity } from 'app/profile/models/profile-security';

export interface ProfileState {
  profile:IProfile|null,
  security: ProfileSecurity|null
}

export const initialState: ProfileState = {
  profile:null,
  security: null
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

  on(profileActions.getProfileSecuritySuccess, (state,{ security })=> ({
    ...state,
    security
  })),
  on(profileActions.changeProfileSecurity, (state,{ security })=> ({
    ...state,
    security:{...security}
  })),
)