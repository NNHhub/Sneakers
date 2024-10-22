import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProfileState } from '../reducers/profile.reducer';

export const featureSelector = createFeatureSelector<ProfileState>('profile');
export const ProfileStoreSelector = createSelector(
  featureSelector,
  (state) => state.profile
);