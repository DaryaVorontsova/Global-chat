import { describe, it, expect, vi } from 'vitest';
import { sendMessage } from './thunks';
import type { RootState } from '../../app/store';

describe('sendMessage thunk', () => {
  const dispatch = vi.fn();
  const getState = vi.fn();

  it('Если отправляется post запрос с корректными данными, сообщение успешно отправляется', async () => {
    const mockResponse = {
      message: 'Message sent',
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response),
    );

    getState.mockReturnValue({
      auth: { token: 'fakeToken' },
    } as RootState);

    const result = await sendMessage('Hello, world!')(
      dispatch,
      getState,
      undefined,
    );

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/chats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer fakeToken`,
      },
      body: JSON.stringify({ body: 'Hello, world!' }),
    });

    expect(result.type).toBe('sendMessage/fulfilled');
    expect(result.payload).toEqual(mockResponse);
  });

  it('Если не авторизован, то возвращается ошибка', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ message: 'Unauthorized' }),
      } as Response),
    );

    getState.mockReturnValue({
      auth: { token: null },
    } as RootState);

    const result = await sendMessage('Hello, world!')(
      dispatch,
      getState,
      undefined,
    );

    expect(result.type).toBe('sendMessage/rejected');
    expect(result.payload).toBe('Не авторизован');
  });

  it('Если произошла сетевая ошибка, то она корректно обрабатывается', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Network Error')));

    getState.mockReturnValue({
      auth: { token: 'fakeToken' },
    } as RootState);

    const result = await sendMessage('Hello, world!')(
      dispatch,
      getState,
      undefined,
    );

    expect(result.type).toBe('sendMessage/rejected');
    expect(result.payload).toBe('Ошибка отправки сообщения');
  });
});
