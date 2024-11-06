import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as profileActions from '../actions/profile.action';
import { of } from 'rxjs'; 
import { ProfileService } from 'app/profile/services/profile.service';

@Injectable()

export class ProfileEffects {
  constructor(private actions$: Actions, private profileService: ProfileService) {}
  
  loadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(profileActions.getProfile),
      switchMap(()=>
        this.profileService.getProfileData().pipe(
          map((profile) =>{
            console.log('Profile has been gotten seccesessfuly');
            return profileActions.getProfileSuccess({profile});
          }),
        catchError(error => of(profileActions.getProfileFailure({ error })))
        )
      )
    )
  );
}