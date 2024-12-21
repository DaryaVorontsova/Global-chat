import type { RootState } from '../../app/store';

export const selectToken = (state: RootState) => state.auth.token;
export const selectMessages = (state: RootState) => state.messageList.messages;
export const selectMessagesStatus = (state: RootState) =>
  state.messageList.status;
export const selectMessagesError = (state: RootState) =>
  state.messageList.error;
