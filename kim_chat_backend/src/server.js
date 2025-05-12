const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDataBase = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const http = require("http");
const {Server} = require("socket.io");
const Conversations = require("./models/ChatRoom");
const User = require("./models/User");

dotenv.config();
connectDataBase();

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
    console.log('server is running at port:', process.env.PORT);
});


