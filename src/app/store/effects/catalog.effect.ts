import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as catalogActions from '../actions/catalog.action';
import { of } from 'rxjs'; 
import { CatalogService } from 'app/catalog/services/catalog.service';

@Injectable()

export class CatalogEffects {
  constructor(private actions$: Actions, private catalogService: CatalogService) {}
  
  loadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(catalogActions.getCatalog),
      switchMap(()=>
        this.catalogService.getCatalogData().pipe(
          map((catalog) =>{
            console.log('Profile has been gotten seccesessfuly');
            return catalogActions.getCatalogSuccess({catalog});
          }),
        catchError(error => of(catalogActions.getCatalogFailure({ error })))
        )
      )
    )
  );
}