import { createSlice } from '@reduxjs/toolkit';
import { sendMessage } from './thunks';
interface PostMessageState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PostMessageState = {
  status: 'idle',
  error: null,
};

const postMessageSlice = createSlice({
  name: 'postMessage',
  initialState,
  reducers: {
    resetError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(sendMessage.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, state => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { resetError } = postMessageSlice.actions;

export default postMessageSlice.reducer;
