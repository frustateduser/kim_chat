import mongoose from "mongoose";
const { Schema } = mongoose;

const ConversationSchema = new Schema({
  conversationId: {
    type: String,
    required: true,
    unique: true,
    ref: "Chats", // Reference to the Chats model
  },
  messages: [
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now, // Default to current date and time
      },
    },
  ],
});

export default mongoose.model("Conversations", ConversationSchema);
