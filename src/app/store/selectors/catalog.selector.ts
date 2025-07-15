import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CatalogState } from '../reducers/catalog.reducer';

export const featureSelector = createFeatureSelector<CatalogState>('catalog');

export const CatalogStoreSelector = createSelector(
  featureSelector,
  (state) => state.catalog ? state.catalog : []
);

