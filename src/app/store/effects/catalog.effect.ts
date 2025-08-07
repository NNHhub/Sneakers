import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as catalogActions from '../actions/catalog.action';
import { of } from 'rxjs'; 
import { CatalogService } from 'app/catalog/services/catalog.service';

@Injectable()

export class CatalogEffects {
  constructor(private actions$: Actions, private catalogService: CatalogService) {}
  
  loadCatalog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(catalogActions.getCatalog),
      switchMap(({pageToken, sort})=>
        this.catalogService.getCatalogData(pageToken, sort).pipe(
          map((catalog) =>{
            console.log('Catalog has been gotten seccesessfuly');
            this.catalogService.setNextPageToken = catalog.nextPageToken;
            return catalogActions.getCatalogSuccess({catalog:catalog.items});
          }),
        catchError(error => of(catalogActions.getCatalogFailure({ error })))
        )
      )
    )
  );

  searchInCatalog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(catalogActions.searchInCatalog),
      switchMap(({value, pageToken, sort})=>
        this.catalogService.sneakerSearch(value, pageToken, sort).pipe(
          map((catalog) =>{
            console.log('Search has been gotten seccesessfuly');
            this.catalogService.setNextPageToken = catalog.nextPageToken;           
            return catalogActions.getCatalogSuccess({catalog:catalog.items});
          }),
        catchError(error =>{
          console.log('Error when try to search',error);
          return of(catalogActions.getCatalogFailure({ error }))
        } )
        )
      )
    )
  );
}