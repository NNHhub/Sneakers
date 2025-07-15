import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as basketActions from '../actions/basket.action';
import { of } from 'rxjs'; 
import { BasketService } from 'app/basket/services/basket.service';
@Injectable()

export class BasketEffects {

  constructor(private actions$: Actions, private basketService: BasketService) {}
  
  loadBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(basketActions.getBasket),
      switchMap(()=>
        this.basketService.getBasket().pipe(
          map((basket) =>{
            return basketActions.getBasketSuccess({basket});
          }),
        catchError(error => of(basketActions.getBasketFailure({ error })))
        )
      )
    )
  );

  setBasketItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(basketActions.addBasketItem),
      switchMap(({ item }) =>
        this.basketService.setBasket(item.id, item.size as number, item.count as number).pipe(
          map(() => basketActions.addBasketItemSuccess({ item })),
          catchError((error) => {
            console.log(error);
            return of(basketActions.addBasketItemFailure({ error }));
          })
        )
      )
    )
  );

  updateBasketItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(basketActions.updateBasketItem),
      switchMap(({ item }) =>
        this.basketService.updateBasket(item.id, item.size as number, item.count as number).pipe(
          map(() => basketActions.updateBasketItemSuccess({ item })),
          catchError((error) => {
            console.log(error);
            return of(basketActions.updateBasketItemFailure({ error }));
          })
        )
      )
    )
  );

  deleteBasketItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(basketActions.deleteBasketItem),
      switchMap(({ id, size })=>
        this.basketService.deleteFromBasket(id, size).pipe(
          map(() =>{
            return basketActions.deleteBasketItemSuccess({ id, size });
          }),
        catchError(error => of(basketActions.deleteBasketItemFailure({ error })))
        )
      )
    )
  );

}