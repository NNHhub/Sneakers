import { createAction, props } from "@ngrx/store"; 
import { ISneakers } from "app/catalog/model/sneaker.model";

export const getBasket = createAction(
    '[Basket] Get basket'
);

export const getBasketSuccess = createAction(
    '[Basket] Get basket Success',
    props<{ basket:ISneakers[] }>()
);

export const getBasketFailure = createAction(
    '[Basket] Get basket failure',
    props<{ error: 'Fail to get basket' }>()
);

export const addBasketItem = createAction(
    '[Bakset] Bakset item added',
    props<{ item:ISneakers }>()
);

export const addBasketItemSuccess = createAction(
    '[Bakset] Bakset item add Success',
    props<{ item:ISneakers }>()
);

export const addBasketItemFailure = createAction(
    '[Bakset] Bakset item add failure',
    props<{ error: 'Fail to add basket' }>()
);

export const deleteBasketItem = createAction(
    '[Bakset] Bakset item delete',
    props<{ id:number }>()
);

export const deleteBasketItemSuccess = createAction(
    '[Bakset] Bakset item delete Success',
    props<{ id:number }>()
);

export const deleteBasketItemFailure = createAction(
    '[Bakset] Bakset item delete failure',
    props<{ error: 'Fail to delete basket item' }>()
);