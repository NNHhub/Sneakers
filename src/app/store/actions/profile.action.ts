import { createAction, props } from "@ngrx/store"; 
import { ProfileSecurity } from "app/profile/models/profile-security";
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

export const getProfileSecurity = createAction(
  '[Profile] Get profile security'
);

export const getProfileSecuritySuccess = createAction(
  '[Profile] Get profile security Success',
  props<{ security:ProfileSecurity}>()
);

export const getProfileSecurityFailure = createAction(
  '[Profile] Get profile security failure',
  props<{ error: 'Fail to get profile' }>()
);

export const changeProfileSecurity = createAction(
  '[Profile] Change profile security',
  props<{ security:ProfileSecurity }>()
)