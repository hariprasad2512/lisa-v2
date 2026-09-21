import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import MicrophoneControls from './components/MicrophoneControls';
import { supabase } from './supabaseClient';
import { useGeolocation } from './hooks/useGeoLocation';
import { useAuth } from './hooks/useAuth';
import { useAudioRecorder } from './hooks/useAudioRecorder';
import { selectMessages, clearChat } from './store/slices/chatSlice';
import { selectTheme } from './store/slices/themeSlice';

function App() {
  const dispatch = useDispatch();
  const messages = useSelector(selectMessages);
  const theme = useSelector(selectTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('lisa_theme', theme);
  }, [theme]);

  // Automatically use Render in production or localhost during development
  const API_BASE_URL = import.meta.env.DEV
    ? 'http://localhost:8000'
    : (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000');
  const [isServerReady, setIsServerReady] = useState(false);
  const [isWakingUp, setIsWakingUp] = useState(true);
  // Warm up / Ping backend on initial render
  useEffect(() => {
    const pingBackend = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/`);
        if (response.ok) {
          setIsServerReady(true);
        }
      } catch (error) {
        console.warn("Server cold start pinging...", error);
      } finally {
        setIsWakingUp(false);
      }
    };

    pingBackend();
  }, [API_BASE_URL]);

  // Custom hooks for decoupled business logic (Redux-backed)
  const { location, requestLocation } = useGeolocation();
  const currentUser = useAuth();
  const { toggleRecording } = useAudioRecorder(
    currentUser,
    location,
    requestLocation
  );

  // Handle guest persistence via localStorage
  useEffect(() => {
    if (!currentUser) {
      localStorage.setItem('lisa_guest_chat', JSON.stringify(messages));
    }
  }, [messages, currentUser]);

  // Clear chat memory function
  const clearMemory = async () => {
    if (window.confirm("Are you sure you want to clear the entire chat history?")) {
      dispatch(clearChat());
      localStorage.removeItem('lisa_guest_chat');

      if (currentUser) {
        const { error } = await supabase
          .from('messages')
          .delete()
          .eq('user_id', currentUser.id);

        if (error) {
          console.error("Error clearing cloud memory:", error.message);
          alert("Could not clear cloud memory. Check Supabase RLS policies.");
        }
      }
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-neutral-50 text-neutral-900 transition-colors dark:bg-neutral-950 dark:text-neutral-50">
      <Header onClear={clearMemory} isWakingUp={isWakingUp} isServerReady={isServerReady} />

      <ChatWindow />

      <MicrophoneControls toggleRecording={toggleRecording} />
    </div>
  );
}

export default App;
