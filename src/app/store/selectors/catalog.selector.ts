import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CatalogState } from '../reducers/catalog.reducer';

export const featureSelector = createFeatureSelector<CatalogState>('catalog');
export const CatalogStoreSelector = createSelector(
  featureSelector,
  (state) => state.catalog?.flatMap((sneaker)=>{
    return sneaker.details.map((detail)=>{
      return {
        name:sneaker.name,
        color:detail.color_name,
        mainPic:detail.main_picture,
        price:detail.price
      }
    })
  })
);
