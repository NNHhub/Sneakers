import { createAction, props } from "@ngrx/store"; 
import { ISneakers } from "app/catalog/model/sneaker.model";

export const getCatalog = createAction(
  '[Catalog] Get catalog',
  (pageToken: number = 0) => ({ pageToken })
);

export const searchInCatalog = createAction(
  '[Catalog] Search in catalog',
  ( value:string, pageToken: number = 0) => ({ value, pageToken })
);

export const searchInCatalogSuccess = createAction(
  '[Catalog] Search in catalog Success',
  props<{ catalog:ISneakers[] }>()
);

export const getCatalogSuccess = createAction(
  '[Catalog] Get catalog Success',
  props<{ catalog:ISneakers[] }>()
);

export const getCatalogFailure = createAction(
  '[Catalog] Get catalog failure',
  props<{ error: 'Fail to get catalog' }>()
);

export const deleteCatalog = createAction(
  '[Catalog] Catalog deleted'
)
