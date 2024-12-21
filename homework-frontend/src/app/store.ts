import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import postMessageReducer from '../features/messageInput/messageInputSlice';
import getAllMessagesReducer from '../features/messageList/messageListSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    postMessage: postMessageReducer,
    messageList: getAllMessagesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
