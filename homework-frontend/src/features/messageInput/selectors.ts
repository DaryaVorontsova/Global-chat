import type { RootState } from '../../app/store';

export const selectPostMessageError = (state: RootState) =>
  state.postMessage.error;
export const selectPostMessageStatus = (state: RootState) =>
  state.postMessage.status;
