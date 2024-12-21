import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { getAllMessages } from './thunks';

interface Message {
  username: string;
  body: string;
}

interface MessageList {
  messages: Message[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: MessageList = {
  messages: [],
  status: 'idle',
  error: null,
};

export const getAllMessagesSlice = createSlice({
  name: 'getAllMessages',
  initialState,
  reducers: {
    resetError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getAllMessages.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        getAllMessages.fulfilled,
        (state, action: PayloadAction<Message[]>) => {
          state.status = 'succeeded';
          state.messages = action.payload;
          state.error = null;
        },
      )
      .addCase(getAllMessages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { resetError } = getAllMessagesSlice.actions;

export default getAllMessagesSlice.reducer;
