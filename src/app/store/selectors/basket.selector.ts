import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BasketState } from '../reducers/basket.reducer';

export const featureSelector = createFeatureSelector<BasketState>('basket');

export const basketSelector = createSelector(
  featureSelector,
  (state) => state.basket ? state.basket : []
);

export const basketIdSelector = createSelector(
    featureSelector,
    (state) => state.basket ? state.basket.map(value => value.id) : []
  );
