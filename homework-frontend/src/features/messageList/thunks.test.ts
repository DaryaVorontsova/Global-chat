import { describe, it, expect, vi } from 'vitest';
import { getAllMessages } from './thunks';
import type { RootState } from '../../app/store';

describe('getAllMessages thunk', () => {
  const dispatch = vi.fn();
  const getState = vi.fn();

  it('Если отправляется GET запрос, сообщения успешно получаются', async () => {
    const mockResponse = [
      { id: 1, body: 'Hello, world!' },
      { id: 2, body: 'Another message' },
    ];

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response),
    );

    getState.mockReturnValue({
      auth: { token: 'fakeToken' },
    } as RootState);

    const result = await getAllMessages()(dispatch, getState, undefined);

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/chats', {
      method: 'GET',
      headers: {
        Authorization: `Bearer fakeToken`,
      },
    });

    expect(result.type).toBe('getAllMessages/fulfilled');
    expect(result.payload).toEqual(mockResponse);
  });

  it('Если не авторизован, то возвращается ошибка 401', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ message: 'Unauthorized' }),
      } as Response),
    );

    getState.mockReturnValue({
      auth: { token: 'fakeToken' },
    } as RootState);

    const result = await getAllMessages()(dispatch, getState, undefined);

    expect(result.type).toBe('getAllMessages/rejected');
    expect(result.payload).toBe('Не авторизован');
  });

  it('Если произошла ошибка 403 (Forbidden), то возвращается соответствующая ошибка', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 403,
        json: () => Promise.resolve({ message: 'Forbidden' }),
      } as Response),
    );

    getState.mockReturnValue({
      auth: { token: 'fakeToken' },
    } as RootState);

    const result = await getAllMessages()(dispatch, getState, undefined);

    expect(result.type).toBe('getAllMessages/rejected');
    expect(result.payload).toBe('Ошибка получения сообщений');
  });

  it('Если происходит сетевая ошибка, то она корректно обрабатывается', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Network Error')));

    getState.mockReturnValue({
      auth: { token: 'fakeToken' },
    } as RootState);

    const result = await getAllMessages()(dispatch, getState, undefined);

    expect(result.type).toBe('getAllMessages/rejected');
    expect(result.payload).toBe('Ошибка получения сообщений');
  });
});
