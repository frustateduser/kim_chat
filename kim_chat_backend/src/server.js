import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDataBase from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import ChatSocket from "./socket/chatSocket.js";
import requestLogger from "./middleware/requestLogger.js";
import cookieParser from "cookie-parser";
import { connectRedis } from "./utils/redisClient.js";

connectDataBase();
const redisClient = await connectRedis();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(requestLogger); // to remove only for debug incomming request's

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

const startServer = async () => {
  const server = await ChatSocket(app, redisClient);
  server.listen(process.env.PORT, () => {
    console.log(`server is running at port: ${process.env.PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
