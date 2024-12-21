import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { selectToken } from './selectors';
import Logger from '../../logger';

export const getAllMessages = createAsyncThunk(
  'getAllMessages',
  async (_, { getState, rejectWithValue }) => {
    const requestName = 'Get Messages Request';

    try {
      const state = getState() as RootState;
      const token = selectToken(state);

      const url = 'http://localhost:3001/chats';
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      Logger.logRequest(url, options, requestName);

      const response = await fetch(url, options);

      Logger.logResponse(response, requestName);

      if (!response.ok) {
        if (response.status === 401) {
          return rejectWithValue('Не авторизован');
        }

        throw new Error('Ошибка получения сообщений');
      }

      const data = await response.json();

      return data;
    } catch (error) {
      Logger.logError(error, requestName);

      return rejectWithValue('Ошибка получения сообщений');
    }
  },
);
