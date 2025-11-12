import { createServer } from "node:http";
import { WebSocketServer, WebSocket } from "ws";
import dotenv from "dotenv";
import addMessages from "../utils/addMessages.js";
import logger from "../utils/logger.js";

dotenv.config();

const ChatSocket = async (app, redis) => {
  const server = createServer(app);
  const wss = new WebSocketServer({ server, path: "/ws" });

  const conversations = new Map();

  let pub = null;
  let sub = null;
  let redisEnabled = false;

  try {
    sub = redis.duplicate();
    pub = redis.duplicate();

    await pub.connect();
    await sub.connect();

    redisEnabled = true;
    logger.info("Redis WebSocket pub/sub enabled ✅");

    sub.on("error", (err) => logger.error("Redis Subscriber error:", err));
    pub.on("error", (err) => logger.error("Redis Publisher error:", err));
  } catch (err) {
    logger.warn("Redis unavailable ❌ Falling back to in-memory broadcast", err);
  }

  // if (redisEnabled) {
  //   sub.on("message", (conversationId, message) => {
  //     if (!conversations.has(conversationId)) return;
  //     for (const client of conversations.get(conversationId)) {
  //       if (client.readyState === WebSocket.OPEN) client.send(message);
  //     }
  //   });
  // }

  wss.on("connection", (ws) => {
    ws.isAlive = true;

    ws.on("pong", () => (ws.isAlive = true));

    ws.on("message", async (raw) => {
      try {
        const data = JSON.parse(raw);

        if (data.type === "join") {
          const { conversationId, userId } = data;
          ws.userId = userId;
          ws.conversationId = conversationId;

          if (!conversations.has(conversationId)) conversations.set(conversationId, new Set());
          conversations.get(conversationId).add(ws);

          ws.send(JSON.stringify({ type: "system", message: `Joined ${conversationId}` }));

          if (redisEnabled) {
            await sub.subscribe(conversationId, (message) => {
              if (!conversations.has(conversationId)) return;
              for (const client of conversations.get(conversationId)) {
                if (client.readyState === WebSocket.OPEN) client.send(message);
              }
            });
          }

          return;
        }

        if (data.type === "message") {
          const { conversationId, userId, message } = data;
          const updatedConversation = await addMessages(conversationId, userId, message);

          const payload = JSON.stringify({
            type: "message",
            conversationId,
            userId,
            message,
            updatedConversation,
          });

          if (redisEnabled) await pub.publish(conversationId, payload);
          else {
            for (const client of conversations.get(conversationId) || []) {
              if (client.readyState === WebSocket.OPEN) client.send(payload);
            }
          }
        }
      } catch (err) {
        logger.error("WebSocket error:", err);
      }
    });

    ws.on("close", async () => {
      const { conversationId } = ws;
      if (!conversationId) return;

      const group = conversations.get(conversationId);
      if (group) {
        group.delete(ws);
        if (group.size === 0) {
          conversations.delete(conversationId);
          if (redisEnabled) await sub.unsubscribe(conversationId);
        }
      }
    });
  });

  // Heartbeat
  setInterval(() => {
    wss.clients.forEach((ws) => {
      if (!ws.isAlive) return ws.terminate();
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  app.closeSocket = () => {
    wss.close();
    if (pub) pub.disconnect();
    if (sub) sub.disconnect();
  };

  return server;
};

export default ChatSocket;
