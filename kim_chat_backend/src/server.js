import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import http from "http";
import { Server } from "socket.io";
import Conversations from "./models/ChatRoom.js";
import User from "./models/User.js";

dotenv.config();
db();

let app = express();
let server = http.createServer(app);
let io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
        credentials: true,
    },
});

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use("/api/user", userRoutes); 
app.use("/api/chat", chatRoutes);

// Socket.IO logic
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Join a specific chat room
    socket.on("joinRoom", (conversationId) => {
        socket.join(conversationId);
        console.log(`User joined room: ${conversationId}`);
    });

    // Handle sending messages
    socket.on("sendMessage", async ({ conversationId, senderId, message }) => {
        try {
            // Save the message to the database
            const conversation = await Conversations.findOneAndUpdate(
                { conversationId },
                {
                    $push: {
                        messages: {
                            sender: senderId,
                            message,
                        },
                    },
                },
                { new: true, upsert: true }
            );

            const sender = await User.findById(senderId).select("name username"); // Fetch sender details
            if (!conversation) {
                console.error("Conversation not found:", conversationId);
                return;
            }

            // Emit the message to all users in the room
            io.to(conversationId).emit("receiveMessage", {
                sender: senderId,
                message,
                timestamp: new Date(),
            });
        } catch (error) {
            console.error("Error saving message:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});



server.listen(process.env.PORT, () => {
    console.log(`server is running at port: ${process.env.PORT}`);
});


