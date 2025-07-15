import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { getProfile } from 'app/store/actions/profile.action';
import { ProfileStoreSelector } from 'app/store/selectors/profile.selector';
import { map, of, take } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const token = localStorage.getItem('token');

  if (token) {
    store.dispatch(getProfile());
    return store.select(ProfileStoreSelector).pipe(
      take(1),
      map(profile => profile?.role === 'admin')
    );
  } else {
    return of(false);
  }
  
};
