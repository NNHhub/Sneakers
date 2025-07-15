import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AdminStoreState } from '../reducers/admin-store.reducer';

export const featureSelector = createFeatureSelector<AdminStoreState>('adminStore');

export const adminStoreSelector = createSelector(
  featureSelector,
  (state) => state.adminStore ? state.adminStore : []
);
