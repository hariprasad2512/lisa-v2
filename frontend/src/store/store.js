import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './slices/chatSlice';
import themeReducer from './slices/themeSlice';
import audioReducer from './slices/audioSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    theme: themeReducer,
    audio: audioReducer,
  },
});
