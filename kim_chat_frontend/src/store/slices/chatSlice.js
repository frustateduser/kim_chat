// src/store/slices/chatSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchUserChats as apiFetchUserChats,
  fetchConversation as apiFetchConversation,
} from '@api/chat';

export const fetchChats = createAsyncThunk(
  'chat/fetchChats',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await apiFetchUserChats(userId);
      return res?.data || res;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const fetchConversation = createAsyncThunk(
  'chat/fetchConversation',
  async (conversationId, { rejectWithValue }) => {
    try {
      const res = await apiFetchConversation(conversationId);
      return res?.data || res;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ conversationId, userId, message, userName }, { rejectWithValue }) => {
    try {
      const payload = {
        type: 'message',
        conversationId,
        userId,
        message,
        sender: userName,
        timestamp: new Date().toISOString(),
      };
      return payload;
    } catch {
      return rejectWithValue({ message: 'Failed to prepare message' });
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chats: [],
    selectedChat: null,
    messages: [],
    loading: false,
    sending: false,
    error: null,
    sendError: null,
  },
  reducers: {
    setSelectedChat(state, action) {
      state.selectedChat = action.payload;
      state.messages = Array.isArray(action.payload?.messages) ? action.payload.messages : [];
    },
    addMessage(state, action) {
      const msg = action.payload;
      if (!Array.isArray(state.messages)) state.messages = [];
      state.messages.push(msg);
      const convId = msg.conversationId || msg.roomId;
      if (convId) {
        const idx = state.chats.findIndex((c) => c.conversationId === convId);
        if (idx !== -1) {
          state.chats[idx].lastMessage = msg.message;
          state.chats[idx].updatedAt = msg.timestamp;
        }
      }
    },
    prependChat(state, action) {
      const chat = action.payload;
      state.chats = [chat, ...state.chats.filter((c) => c.conversationId !== chat.conversationId)];
    },
    setChats(state, action) {
      state.chats = Array.isArray(action.payload) ? action.payload : [];
    },
    clearChatState(state) {
      state.chats = [];
      state.selectedChat = null;
      state.messages = [];
      state.error = null;
    },
    clearSendError(state) {
      state.sendError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload?.interactions || action.payload || [];
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error?.message;
      })
      .addCase(fetchConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversation.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = Array.isArray(action.payload?.messages)
          ? action.payload.messages
          : Array.isArray(action.payload)
            ? action.payload
            : [];
      })
      .addCase(fetchConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error?.message;
      })
      .addCase(sendMessage.pending, (state) => {
        state.sending = true;
        state.sendError = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sending = false;
        state.messages.push(action.payload);
        const convId = action.payload.conversationId;
        const idx = state.chats.findIndex((c) => c.conversationId === convId);
        if (idx !== -1) {
          state.chats[idx].lastMessage = action.payload.message;
          state.chats[idx].updatedAt = action.payload.timestamp;
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sending = false;
        state.sendError = action.payload?.message || 'Failed to send message';
      });
  },
});

export const {
  setSelectedChat,
  addMessage,
  prependChat,
  setChats,
  clearChatState,
  clearError,
  clearSendError,
} = chatSlice.actions;
export default chatSlice.reducer;
