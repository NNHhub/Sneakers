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

export const changeProfile = createAction(
  '[Profile] Change profile',
  props<{ profile:{first_name:string, last_name:string, phone:string, email:string} }>()
)