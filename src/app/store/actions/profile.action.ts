import { createAction, props } from "@ngrx/store"; 
import { IProfile } from "app/profile/models/profile.model";

export const getProfile = createAction(
  '[Profile] Get profile'
);

export const getProfileSuccess = createAction(
  '[Profile] Get profile Success',
  props<{ profile:IProfile}>()
);

export const getProfileFailure = createAction(
  '[Profile] Get profile failure',
  props<{ error: 'Fail to get profile' }>()
);