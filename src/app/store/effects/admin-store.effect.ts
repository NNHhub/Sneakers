import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as adminStoreActions from '../actions/admin-store.action';
import { of } from 'rxjs'; 
import { CatalogService } from 'app/catalog/services/catalog.service';

@Injectable()

export class AdminStoreEffects {
  constructor(private actions$: Actions, private catalogService: CatalogService) {}
 
  loadAdminStore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(adminStoreActions.getAdminStore),
      switchMap(({value,pageToken})=>
        this.catalogService.sneakerSearch(value,pageToken).pipe(
          map((catalog) =>{
            console.log('Search has been gotten seccesessfuly');
            this.catalogService.setNextPageToken = catalog.nextPageToken;
            return adminStoreActions.getAdminStoreSuccess({adminStore:catalog.items});
          }),
        catchError(error =>{
          console.log('Error when try to search',error);
          return of(adminStoreActions.getAdminStoreFailure({ error }))
        } )
        )
      )
    )
  );
}