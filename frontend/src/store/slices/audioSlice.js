import { createSlice } from '@reduxjs/toolkit';

const audioSlice = createSlice({
  name: 'audio',
  initialState: {
    isRecording: false,
    isProcessing: false,
  },
  reducers: {
    setRecording: (state, action) => {
      state.isRecording = action.payload;
    },
    setProcessing: (state, action) => {
      state.isProcessing = action.payload;
    },
  },
});

export const { setRecording, setProcessing } = audioSlice.actions;
export const selectIsRecording = (state) => state.audio.isRecording;
export const selectIsProcessing = (state) => state.audio.isProcessing;
export default audioSlice.reducer;
