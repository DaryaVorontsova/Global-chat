import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerUser, loginUser } from './thunks';
import { setUser, setToken } from './authSlice';

describe('registerUser thunk', () => {
  const dispatch = vi.fn();
  const getState = vi.fn();

  it('Если отправляется post запрос с корректными данными, то пользователь успешно зарегистрируется', async () => {
    const mockResponse = {
      message: 'Registered successfully',
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response),
    );

    const result = await registerUser({
      username: 'testUser',
      password: 'password123',
    })(dispatch, getState, undefined);

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3001/register',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: 'testUser', password: 'password123' }),
      },
    );

    expect(result.type).toBe('auth/register/fulfilled');
    expect(result.payload).toEqual(mockResponse);
  });

  it('Если отправляется запрос с именем пользователя, который уже существует, то ошибка обрабатывается корректно', async () => {
    const mockError = {
      message: 'User already exists',
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve(mockError),
      } as Response),
    );

    const result = await registerUser({
      username: 'existingUser',
      password: 'password123',
    })(dispatch, getState, undefined);

    expect(result.type).toBe('auth/register/rejected');
    expect(result.payload).toBe(mockError.message);
  });

  it('Если произошла сетевая ошибка при регистрации, то она корректно обрабатывается', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Network Error')));

    const result = await registerUser({
      username: 'testUser',
      password: 'password123',
    })(dispatch, getState, undefined);

    expect(result.type).toBe('auth/register/rejected');
    expect(result.payload).toBe('Ошибка регистрации. Попробуйте снова.');
  });
});

describe('loginUser thunk', () => {
  const dispatch = vi.fn();
  const getState = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('Если отправляется post запрос с корректными данными пользователя, то он успешно залогинивается', async () => {
    const mockResponse = {
      token: 'fakeToken',
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response),
    );

    const result = await loginUser({
      username: 'testUser',
      password: 'password123',
    })(dispatch, getState, undefined);

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: 'testUser', password: 'password123' }),
    });

    expect(dispatch).toHaveBeenCalledWith(setToken('fakeToken'));
    expect(dispatch).toHaveBeenCalledWith(setUser('testUser'));
    expect(result.type).toBe('auth/login/fulfilled');
    expect(result.payload).toBe('fakeToken');
  });

  it('Если отправляется запрос с неверными данными авторизации, то ошибка обрабатывается корректно', async () => {
    const mockError = {
      message: 'Invalid credentials',
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve(mockError),
      } as Response),
    );

    const result = await loginUser({
      username: 'testUser',
      password: 'wrongPassword',
    })(dispatch, getState, undefined);

    expect(result.type).toBe('auth/login/rejected');
    expect(result.payload).toBe(mockError.message);
  });

  it('Если происходит сетевая ошибка, то она корректно обрабатывается', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Network Error')));

    const result = await loginUser({
      username: 'testUser',
      password: 'password123',
    })(dispatch, getState, undefined);

    expect(result.type).toBe('auth/login/rejected');
    expect(result.payload).toBe('Ошибка авторизации. Попробуйте снова.');
  });
});
