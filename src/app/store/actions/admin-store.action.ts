import { createAction, props } from "@ngrx/store"; 
import { ISneakers } from "app/catalog/model/sneaker.model";

export const getAdminStore = createAction(
  '[Admin store] Get admin store',
  ( value:string, pageToken: number = 0) => ({ value, pageToken })
);

export const getAdminStoreSuccess = createAction(
  '[Admin store] Getting admin store Success',
  props<{ adminStore:ISneakers[] }>()
);

export const getAdminStoreFailure = createAction(
  '[Admin store] Getting admin store failure',
  props<{ error: 'Fail to get admin store' }>()
);

export const deleteAdminStore = createAction(
  '[Admin store] Admin store deleted'
)
