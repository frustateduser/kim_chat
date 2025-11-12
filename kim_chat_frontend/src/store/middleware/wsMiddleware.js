import wsClient from '@utils/websocket';
import { addMessage, prependChat } from '../slices/chatSlice';

const WS_CONNECT = 'ws/connect';
const WS_DISCONNECT = 'ws/disconnect';
const WS_SEND = 'ws/send';
const WS_JOIN_ROOM = 'ws/joinRoom';

const wsMiddleware = (storeAPI) => {
  let subscribed = false;

  const handleIncoming = (data) => {
    if (data.type === 'message') {
      const ts = data.timestamp || data.updatedConversation?.timestamp || new Date().toISOString();
      const normalizedMessage = {
        conversationId: data.conversationId || data.roomId,
        userId: data.userId,
        message: data.message,
        sender: data.sender,
        timestamp: ts,
      };
      storeAPI.dispatch(addMessage(normalizedMessage));

      if (normalizedMessage.conversationId && normalizedMessage.sender) {
        const previewChat = {
          conversationId: normalizedMessage.conversationId,
          lastMessage: normalizedMessage.message,
          updatedAt: normalizedMessage.timestamp,
          interactedUserId: {
            _id: normalizedMessage.userId,
            name: normalizedMessage.sender,
            username: normalizedMessage.sender,
          },
        };
        storeAPI.dispatch(prependChat(previewChat));
      }
    } else if (data.type === 'system') {
      console.log('System message:', data.message);
    }
  };

  return (next) => (action) => {
    switch (action.type) {
      case WS_CONNECT:
        if (!wsClient.isConnected()) {
          wsClient.connect();
        }
        if (!subscribed) {
          wsClient.onMessage(handleIncoming);
          subscribed = true;
        }
        break;

      case WS_DISCONNECT:
        if (wsClient.isConnected()) {
          wsClient.disconnect();
        }
        if (subscribed) {
          wsClient.offMessage(handleIncoming);
          subscribed = false;
        }
        break;

      case WS_JOIN_ROOM: {
        const { conversationId, userId } = action.payload || {};
        if (conversationId && userId) {
          wsClient.joinRoom(conversationId, userId);
        }
        break;
      }

      case WS_SEND: {
        const payload = action.payload;
        if (payload) {
          wsClient.send(payload);
        }
        break;
      }

      default:
        break;
    }

    return next(action);
  };
};

export default wsMiddleware;

export const wsConnect = () => ({ type: 'ws/connect' });
export const wsDisconnect = () => ({ type: 'ws/disconnect' });
export const wsSend = (payload) => ({ type: 'ws/send', payload });
export const wsJoinRoom = (conversationId, userId) => ({
  type: 'ws/joinRoom',
  payload: { conversationId, userId },
});
