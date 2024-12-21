import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { loginUser, registerUser } from './thunks';

interface AuthState {
  token: string | null;
  user: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    setUser: (state, action: PayloadAction<string | null>) => {
      state.user = action.payload;
    },
    resetError: state => {
      state.error = null;
    },
    logout: state => {
      state.token = null;
      state.user = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(registerUser.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<string | null>) => {
          state.status = 'succeeded';
          state.error = null;
        },
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<string | null>) => {
          state.status = 'succeeded';
          state.error = null;
          state.token = action.payload;
        },
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setToken, setUser, resetError, logout } = authSlice.actions;

export default authSlice.reducer;
