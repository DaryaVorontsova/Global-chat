import './messageInput.css';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { sendMessage } from './thunks';
import { selectPostMessageError, selectPostMessageStatus } from './selectors';

export const MessageInput = () => {
  const [message, setMessage] = useState('');
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectPostMessageError);
  const status = useAppSelector(selectPostMessageStatus);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (message.trim()) {
      dispatch(sendMessage(message));
      setMessage('');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="send-message-form">
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="send-message-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
        <p className="status-message">{status === 'loading' && 'Sending...'}</p>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};
