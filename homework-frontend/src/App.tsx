import './App.css';
import { Auth } from './features/auth/auth';
import { Chat } from './components/chat';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { selectToken } from './features/auth/selectors';
import { useEffect } from 'react';
import { logout, setToken } from './features/auth/authSlice';

const App = () => {
  const token = useAppSelector(selectToken);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    if (!storedToken) {
      dispatch(logout());
    } else {
      dispatch(setToken(storedToken));
    }
  }, [dispatch, token]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <div className="App">
      <header className="App-header">
        {!token ? (
          <Auth />
        ) : (
          <>
            <Chat />
            <button className="exit" onClick={handleLogout}>
              Выйти
            </button>
          </>
        )}
      </header>
    </div>
  );
};

export default App;
