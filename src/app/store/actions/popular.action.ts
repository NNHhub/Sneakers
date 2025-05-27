import { createAction, props } from "@ngrx/store"; 
import { ISneakers } from "app/catalog/model/sneaker.model";

export const getPopularList = createAction(
  '[Popular] Get popular list',
);

export const getPopularListSuccess = createAction(
  '[Popular] Getting popular list Success',
  props<{ popular:ISneakers[] }>()
);

export const getPopularListFailure = createAction(
  '[Popular] Getting popular list failure',
  props<{ error: 'Fail to get popular list' }>()
);
