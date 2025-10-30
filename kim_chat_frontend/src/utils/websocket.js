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

let socket = null;
let messageListeners = [];
let openListeners = [];
let reconnectTimeout = null;
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

    // Resubscribe after reconnect if a room was previously joined
    if (joinedRoom && joinedUser) {
      joinRoom(joinedRoom, joinedUser);
    }

    openListeners.forEach((cb) => cb());
  };

  socket.onclose = (event) => {
    console.warn('⚠️ WebSocket disconnected:', event.reason || 'Server closed connection');

    // Reconnect automatically
    clearTimeout(reconnectTimeout);
    reconnectTimeout = setTimeout(connect, 3000);
  };

  socket.onerror = (error) => {
    console.error('❌ WebSocket error:', error);
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      // Debugging logs for backend messages
      if (data.type === 'system') {
        console.log('🪶 System:', data.message);
      } else if (data.type === 'message') {
        console.log('💬 Message:', data);
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
 * @param {string} roomId
 * @param {string} userId
 */
function joinRoom(roomId, userId) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.warn('WebSocket not connected. Will rejoin after reconnect.');
    joinedRoom = roomId;
    joinedUser = userId;
    return;
  }

  joinedRoom = roomId;
  joinedUser = userId;

  const payload = { type: 'join', roomId, userId };
  send(payload);
}

/**
 * Send chat message.
 * @param {string} roomId
 * @param {string} userId
 * @param {string} message
 */
function sendMessage(roomId, userId, message) {
  if (!roomId || !userId) {
    console.error('Missing roomId or userId while sending message.');
    return;
  }

  const payload = {
    type: 'message',
    roomId,
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
