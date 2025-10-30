// src/socket/chatSocket.js
import { createServer } from "node:http";
import { WebSocketServer, WebSocket } from "ws";
import addMessages from "../utils/addMessages.js";
import logger from "../utils/logger.js";
import dotenv from "dotenv";

dotenv.config();

const ChatSocket = (app, redis) => {
  const server = createServer(app);
  const wss = new WebSocketServer({ server });

  // 🔹 Track clients per conversation in-memory
  const conversations = new Map();

  // 🔹 Try connecting Redis (for scaling across instances)
  let pub = null;
  let sub = null;
  let redisEnabled = false;

  try {
    sub = redis.duplicate();
    pub = redis.duplicate();

    pub.on("error", (err) => logger.error("Redis Publisher error:", err));
    sub.on("error", (err) => logger.error("Redis Subscriber error:", err));
  } catch (err) {
    logger.error("Redis not running, falling back to in-memory conversations" + err);
  }

  // 🔹 Handle Redis incoming messages (distributed conversations)
  if (sub) {
    sub.on("message", (conversationId, message) => {
      if (conversations.has(conversationId)) {
        conversations.get(conversationId).forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(message);
          }
        });
      }
    });
  }

  // 🔹 Handle WebSocket connections
  wss.on("connection", (ws) => {
    logger.debug("New WebSocket connection");

    // Each client can join a conversation
    ws.on("message", async (rawData) => {
      try {
        const data = JSON.parse(rawData);

        if (data.type === "join") {
          // User joins a conversation
          const { conversationId, userId } = data;
          if (!conversations.has(conversationId)) conversations.set(conversationId, new Set());
          conversations.get(conversationId).add(ws);
          ws.conversationId = conversationId;
          ws.userId = userId;
          ws.send(
            JSON.stringify({ type: "system", message: `Joined conversation ${conversationId}` })
          );

          // Subscribe Redis only when first join
          if (redisEnabled && sub.listenerCount("message") > 0) {
            await sub.subscribe(conversationId);
          }
          return;
        }

        if (data.type === "message") {
          const { conversationId, userId, message } = data;

          // Save to DB
          const updatedConversation = await addMessages(conversationId, userId, message);

          // Wrap in JSON
          const payload = JSON.stringify({
            type: "message",
            conversationId,
            userId,
            message,
            updatedConversation,
          });

          if (redisEnabled) {
            await pub.publish(conversationId, payload);
          } else {
            // Local broadcast
            if (conversations.has(conversationId)) {
              conversations.get(conversationId).forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(payload);
                }
              });
            }
          }
        }
      } catch (err) {
        logger.error("WebSocket error:", err);
      }
    });

    // Handle disconnects
    ws.on("close", () => {
      logger.debug(`Client disconnected: ${ws.userId || "unknown"}`);
      if (ws.conversationId && conversations.has(ws.conversationId)) {
        conversations.get(ws.conversationId).delete(ws);
        if (conversations.get(ws.conversationId).size === 0) {
          conversations.delete(ws.conversationId);
          if (redisEnabled) sub.unsubscribe(ws.conversationId);
        }
      }
    });

    // Keep connection alive (ping/pong)
    ws.isAlive = true;
    ws.on("pong", () => {
      ws.isAlive = true;
    });
  });

  // 🔹 Heartbeat to terminate dead connections
  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (!ws.isAlive) return ws.terminate();
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on("close", () => clearInterval(interval));

  app.closeSocket = () => {
    wss.close();
    if (pub) pub.disconnect();
    if (sub) sub.disconnect();
  };

  return server;
};

export default ChatSocket;
