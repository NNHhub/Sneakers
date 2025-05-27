import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PopularState } from '../reducers/popular.reducer';

export const featureSelector = createFeatureSelector<PopularState>('popular');

export const PopularSelector = createSelector(
  featureSelector,
  (state) => state.popular ? state.popular : []
);
