import { MessageInput } from '../features/messageInput/messageInput';
import { MessageList } from '../features/messageList/messageList';

export const Chat = () => {
  return (
    <div>
      <h2>Глобальный чат</h2>
      <MessageList />
      <MessageInput />
    </div>
  );
};
