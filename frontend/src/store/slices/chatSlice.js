import { createSlice } from '@reduxjs/toolkit';

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: 'Hi I am Lisa! How can I assist you today?',
};

const loadGuestChat = () => {
  try {
    const saved = localStorage.getItem('lisa_guest_chat');
    return saved ? JSON.parse(saved) : [INITIAL_MESSAGE];
  } catch {
    return [INITIAL_MESSAGE];
  }
};

export const INITIAL_CHAT_MESSAGE = INITIAL_MESSAGE;

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: loadGuestChat(),
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearChat: (state) => {
      state.messages = [INITIAL_MESSAGE];
    },
  },
});

export const { setMessages, addMessage, clearChat } = chatSlice.actions;
export const selectMessages = (state) => state.chat.messages;
export default chatSlice.reducer;
