import { createAction, props } from "@ngrx/store"; 
import { ISneakers } from "app/catalog/model/sneaker.model";

export const getCatalog = createAction(
  '[Catalog] Get catalog'
);

export const getCatalogSuccess = createAction(
  '[Catalog] Get catalog Success',
  props<{ catalog:ISneakers[] }>()
);

export const getCatalogFailure = createAction(
  '[Catalog] Get catalog failure',
  props<{ error: 'Fail to get catalog' }>()
);
