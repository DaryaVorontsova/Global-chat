import type { RootState } from '../../app/store';

export const selectToken = (state: RootState) => state.auth.token;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthStatus = (state: RootState) => state.auth.status;
