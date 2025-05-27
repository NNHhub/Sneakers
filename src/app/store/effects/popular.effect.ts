import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as popularListActions from '../actions/popular.action';
import { of } from 'rxjs'; 
import { CatalogService } from 'app/catalog/services/catalog.service';

@Injectable()

export class PopularEffects {
  constructor(private actions$: Actions, private catalogService: CatalogService) {}
 
  loadPopular$ = createEffect(() =>
    this.actions$.pipe(
      ofType(popularListActions.getPopularList),
      switchMap(()=>
        this.catalogService.getPopularList().pipe(
          map((popular) =>{
            return popularListActions.getPopularListSuccess({popular});
          }),
        catchError(error =>{
          console.log('Error when try to search',error);
          return of(popularListActions.getPopularListFailure({ error }))
        } )
        )
      )
    )
  );
}