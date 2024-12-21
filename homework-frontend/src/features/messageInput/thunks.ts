import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import Logger from '../../logger';

export const sendMessage = createAsyncThunk(
  'sendMessage',
  async (message: string, { getState, rejectWithValue }) => {
    const requestName = 'Send Message Request';

    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      const url = 'http://localhost:3001/chats';
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ body: message }),
      };

      Logger.logRequest(url, options, requestName);

      const response = await fetch(url, options);

      Logger.logResponse(response, requestName);

      if (!response.ok) {
        if (response.status === 401) {
          return rejectWithValue('Не авторизован');
        }

        throw new Error('Ошибка отправки сообщения');
      }

      const data = await response.json();

      return data;
    } catch (error) {
      Logger.logError(error, requestName);

      return rejectWithValue('Ошибка отправки сообщения');
    }
  },
);
