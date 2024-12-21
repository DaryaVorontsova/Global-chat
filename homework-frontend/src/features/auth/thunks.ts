import { createAsyncThunk } from '@reduxjs/toolkit';
import { setUser, setToken } from './authSlice';
import Logger from '../../logger';

export const registerUser = createAsyncThunk(
  'auth/register',
  async (
    { username, password }: { username: string; password: string },
    { rejectWithValue },
  ) => {
    const requestName = 'Register Request';

    try {
      const url = 'http://localhost:3001/register';
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      };

      Logger.logRequest(url, options, requestName);

      const response = await fetch(url, options);

      Logger.logResponse(response, requestName);

      if (!response.ok) {
        const error = await response.json();

        return rejectWithValue(error.message);
      }

      const data = await response.json();

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', username);

      return data;
    } catch (error) {
      Logger.logError(error, requestName);

      return rejectWithValue('Ошибка регистрации. Попробуйте снова.');
    }
  },
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (
    { username, password }: { username: string; password: string },
    { dispatch, rejectWithValue },
  ) => {
    const requestName = 'Login Request';

    try {
      const url = 'http://localhost:3001/login';
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      };

      Logger.logRequest(url, options, requestName);

      const response = await fetch(url, options);

      Logger.logResponse(response, requestName);

      if (!response.ok) {
        const error = await response.json();

        return rejectWithValue(error.message);
      }

      const data = await response.json();

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', username);

      dispatch(setToken(data.token));
      dispatch(setUser(username));

      return data.token;
    } catch (error) {
      Logger.logError(error, requestName);

      return rejectWithValue('Ошибка авторизации. Попробуйте снова.');
    }
  },
);
