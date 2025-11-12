/**
 * @fileoverview WebSocket client for Kim Chat.
 * Compatible with backend using 'ws' (no Socket.IO dependency).
 * Handles connection, reconnection, joining rooms, and message events.
 *
 * @example
 * import wsClient from "../utils/websocket";
 * wsClient.connect();
 * wsClient.onOpen(() => wsClient.joinRoom("room123", "user456"));
 * wsClient.onMessage((msg) => console.log("New message:", msg));
 *
 * @author
 * Koustubh Badshah <www.github.com/frustateduser>
 */

/**
 * Recursively sanitize object/string for safe logging (removes \n and \r from all string values).
 * @param {*} value
 * @returns {*}
 */
function sanitizeForLog(value) {
  if (typeof value === 'string') {
    return value.replace(/[\n\r]/g, '');
  } else if (Array.isArray(value)) {
    return value.map(sanitizeForLog);
  } else if (value && typeof value === 'object') {
    const sanitized = {};
    for (const k in value) {
      if (Object.prototype.hasOwnProperty.call(value, k)) {
        sanitized[k] = sanitizeForLog(value[k]);
      }
    }
    return sanitized;
  }
  return value;
}

let socket = null;
let messageListeners = [];
let openListeners = [];
let reconnectTimeout = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
let joinedRoom = null; // track the last joined room
let joinedUser = null;

const WS_URL = import.meta.env.VITE_BACKEND_WS_URL;

/**
 * Connect to WebSocket server.
 */
function connect() {
  if (
    socket &&
    (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)
  )
    return;

  socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    console.log('✅ WebSocket connected:', WS_URL);

    // Reset reconnection state on successful connection
    reconnectAttempts = 0;
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }

    // Resubscribe after reconnect if a room was previously joined
    if (joinedRoom && joinedUser) {
      joinRoom(joinedRoom, joinedUser);
    }

    // Notify all open listeners
    openListeners.forEach((cb) => cb());
  };

  socket.onclose = (event) => {
    console.warn('⚠️ WebSocket disconnected:', event.reason || 'Server closed connection');

    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.error('Max reconnection attempts reached');
      return;
    }

    // Reconnect automatically with exponential backoff
    reconnectAttempts++;
    const delay = Math.min(1000 * (Math.pow(2, reconnectAttempts) - 1), 10000);
    clearTimeout(reconnectTimeout);
    reconnectTimeout = setTimeout(connect, delay);
  };

  socket.onerror = (error) => {
    console.error('❌ WebSocket error:', error);
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      // Debugging logs for backend messages
      if (data.type === 'system') {
        const safeMessage = String(data.message).replace(/[\r\n]/g, '');
        console.log('🪶 System:', `"${safeMessage}"`);
      } else if (data.type === 'message') {
        // Sanitize all string content recursively before logging to prevent log injection
        console.log('💬 Message:', sanitizeForLog(data));
      }

      messageListeners.forEach((cb) => cb(data));
    } catch (err) {
      console.error('Invalid WS message:', err);
    }
  };
}

/**
 * Send a message to the WebSocket server.
 * @param {object|string} data - Data to send (object will be JSON.stringified)
 */
function send(data) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.warn('Cannot send, WebSocket not connected yet.');
    return;
  }

  const payload = typeof data === 'string' ? data : JSON.stringify(data);
  socket.send(payload);
}

/**
 * Join a chat room.
 * @param {string} conversationId
 * @param {string} userId
 */
function joinRoom(conversationId, userId) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.warn('WebSocket not connected. Will rejoin after reconnect.');
    joinedRoom = conversationId;
    joinedUser = userId;
    return;
  }

  joinedRoom = conversationId;
  joinedUser = userId;

  const payload = { type: 'join', conversationId, userId };
  send(payload);
}

/**
 * Send chat message.
 * @param {string} conversationId
 * @param {string} userId
 * @param {string} message
 */
function sendMessage(conversationId, userId, message) {
  if (!conversationId || !userId) {
    console.error('Missing conversationId or userId while sending message.');
    return;
  }

  const payload = {
    type: 'message',
    conversationId,
    userId,
    message,
  };

  send(payload);
}

/**
 * Subscribe to incoming messages.
 * @param {(data: any) => void} callback
 */
function onMessage(callback) {
  messageListeners.push(callback);
}

/**
 * Unsubscribe from messages.
 * @param {(data: any) => void} callback
 */
function offMessage(callback) {
  messageListeners = messageListeners.filter((cb) => cb !== callback);
}

/**
 * Subscribe to the open event.
 * @param {() => void} callback
 */
function onOpen(callback) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    callback();
  } else {
    openListeners.push(callback);
  }
}

/**
 * Disconnect manually.
 */
function disconnect() {
  if (socket) {
    socket.close();
    socket = null;
  }
  clearTimeout(reconnectTimeout);
  messageListeners = [];
  openListeners = [];
  joinedRoom = null;
  joinedUser = null;
}

/**
 * Check if connected.
 * @returns {boolean}
 */
function isConnected() {
  return socket && socket.readyState === WebSocket.OPEN;
}

export default {
  connect,
  send,
  joinRoom,
  sendMessage,
  onMessage,
  offMessage,
  onOpen,
  disconnect,
  isConnected,
};
