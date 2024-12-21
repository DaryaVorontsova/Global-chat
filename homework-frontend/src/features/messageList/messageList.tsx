import './messageList.css';
import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getAllMessages } from './thunks';
import {
  selectMessages,
  selectMessagesError,
  selectMessagesStatus,
} from './selectors';

import { useVirtualizer } from '@tanstack/react-virtual';

export const MessageList = () => {
  const dispatch = useAppDispatch();
  const messages = useAppSelector(selectMessages);
  const error = useAppSelector(selectMessagesError);
  const status = useAppSelector(selectMessagesStatus);
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  });

  useEffect(() => {
    const fetchMessages = () => {
      dispatch(getAllMessages());
    };

    fetchMessages();

    const intervalId = setInterval(fetchMessages, 3000);

    return () => clearInterval(intervalId);
  }, [dispatch, messages.length]);

  if (status === 'loading' && messages.length === 0) {
    return <p>Loading messages...</p>;
  }

  if (status === 'failed') {
    return <p>Error: {error}</p>;
  }

  if (messages.length === 0) {
    return <p>В этом чате пока ничего нет...</p>;
  }

  return (
    <div
      className="all-messages"
      ref={parentRef}
      style={{
        height: `400px`,
        overflow: 'auto',
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
            className="one-message"
          >
            <span className="username">
              {messages[virtualItem.index].username}:
            </span>
            <span>{messages[virtualItem.index].body}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
