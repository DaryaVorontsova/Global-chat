import './auth.css';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { registerUser, loginUser } from './thunks';
import { selectAuthError, selectAuthStatus } from './selectors';
import { resetError } from './authSlice';

export const Auth = () => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const dispatch = useAppDispatch();
  const error = useAppSelector(selectAuthError);
  const status = useAppSelector(selectAuthStatus);

  const authText = isRegister
    ? {
        title: 'Регистрация',
        submitButton: 'Зарегистрироваться',
        togglePrompt: 'Уже есть аккаунт?',
        toggleButton: 'Войти',
      }
    : {
        title: 'Вход',
        submitButton: 'Войти',
        togglePrompt: 'Нет аккаунта?',
        toggleButton: 'Зарегистрироваться',
      };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      isRegister
        ? registerUser({ username, password })
        : loginUser({ username, password }),
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    if (error) {
      dispatch(resetError());
    }

    switch (id) {
      case 'username':
        setUserName(value);
        break;
      case 'password':
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const toggleAuthMode = () => setIsRegister(!isRegister);

  return (
    <div>
      <h2>{authText.title}</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label htmlFor="username">Имя пользователя:</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={handleChange}
        />
        <label htmlFor="password">Пароль</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={handleChange}
        />
        <div>
          <button className="auth-button" type="submit">
            {authText.submitButton}
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
        {status === 'loading' && <p className="status-message">Загрузка...</p>}
      </form>
      <div className="check">
        {authText.togglePrompt}
        <button onClick={toggleAuthMode}>{authText.toggleButton}</button>
      </div>
    </div>
  );
};
