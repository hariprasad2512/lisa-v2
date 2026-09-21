import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  try {
    const saved = localStorage.getItem('lisa_theme');
    const manual = localStorage.getItem('lisa_theme_manual') === 'true';
    if (manual && (saved === 'light' || saved === 'dark')) return saved;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  } catch {
    return 'light';
  }
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    value: getInitialTheme(),
  },
  reducers: {
    toggleTheme: (state) => {
      state.value = state.value === 'dark' ? 'light' : 'dark';
      localStorage.setItem('lisa_theme_manual', 'true');
      localStorage.setItem('lisa_theme', state.value);
    },
    setTheme: (state, action) => {
      state.value = action.payload;
      localStorage.setItem('lisa_theme', action.payload);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export const selectTheme = (state) => state.theme.value;
export default themeSlice.reducer;
