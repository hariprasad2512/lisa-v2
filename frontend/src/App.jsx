import { useState, useEffect } from 'react';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import MicrophoneControls from './components/MicrophoneControls';
import { supabase } from './supabaseClient';
import { useGeolocation } from './hooks/useGeoLocation';
import { useAuth } from './hooks/useAuth';
import { useAudioRecorder } from './hooks/useAudioRecorder';

function App() {

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

  // 1. Initialize messages (Checks localStorage first for guests)
  const [messages, setMessages] = useState(() => {
    const savedChat = localStorage.getItem('lisa_guest_chat');
    return savedChat ? JSON.parse(savedChat) : [
      { role: 'assistant', content: 'Hi I am Lisa! How can I assist you today?' }
    ];
  });

  // 2. Custom hooks for decoupled business logic
  const location = useGeolocation();
  const currentUser = useAuth(setMessages);
  const { isRecording, isProcessing, toggleRecording } = useAudioRecorder(
    messages, 
    setMessages, 
    currentUser, 
    location
  );

  // 3. Handle guest persistence via localStorage
  useEffect(() => {
    if (!currentUser) {
      localStorage.setItem('lisa_guest_chat', JSON.stringify(messages));
    }
  }, [messages, currentUser]);

  // 4. Clear chat memory function
  const clearMemory = async () => {
    if (window.confirm("Are you sure you want to clear the entire chat history?")) {
      setMessages([{ role: 'assistant', content: 'Hi I am Lisa! How can I assist you today?' }]);
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
    <div className="flex flex-col h-screen overflow-hidden bg-neutral-950 text-neutral-50">
      <Header onClear={clearMemory} isWakingUp={isWakingUp} isServerReady={isServerReady} />
      
      <ChatWindow 
        messages={messages} 
        isProcessing={isProcessing} 
      />
      
      <MicrophoneControls 
        isRecording={isRecording}
        isProcessing={isProcessing}
        toggleRecording={toggleRecording}
      />
    </div>
  );
}

export default App;