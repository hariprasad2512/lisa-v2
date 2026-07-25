import { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import MicrophoneControls from './components/MicrophoneControls';
import { supabase } from './supabaseClient';
import { fetchCloudMessages, saveMessageToCloud, migrateGuestChatToCloud } from './chatService';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [location, setLocation] = useState(null);

  // 1. Initialize messages (Checks localStorage first for guests)
  const [messages, setMessages] = useState(() => {
    const savedChat = localStorage.getItem('lisa_guest_chat');
    return savedChat ? JSON.parse(savedChat) : [
      { role: 'assistant', content: 'Hi I am Lisa! How can I assist you today?' }
    ];
  });

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const activeAudioRef = useRef(null); 

  // 2. Fetch location on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => console.warn("Geolocation warning:", error.message)
      );
    }
  }, []);

  // 3. Listen for Auth state changes & handle Guest-to-User migration
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const user = session?.user ?? null;
      setCurrentUser(user);
      if (user) {
        // Migrate any guest chats sitting in localStorage, then fetch cloud history
        await migrateGuestChatToCloud(user.id);
        const cloudMsgs = await fetchCloudMessages(user.id);
        if (cloudMsgs.length > 0) {
          setMessages(cloudMsgs);
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user ?? null;
      setCurrentUser(user);
      if (user) {
        await migrateGuestChatToCloud(user.id);
        const cloudMsgs = await fetchCloudMessages(user.id);
        if (cloudMsgs.length > 0) {
          setMessages(cloudMsgs);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 4. Handle persistence: localStorage for guests, Supabase for logged-in users
  useEffect(() => {
    if (!currentUser) {
      localStorage.setItem('lisa_guest_chat', JSON.stringify(messages));
    }
  }, [messages, currentUser]);

  const processAudio = async (audioBlob) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "voice.webm");
      
      const transcribeRes = await fetch("http://localhost:8000/transcribe", {
        method: "POST",
        body: formData
      });
      const transcribeData = await transcribeRes.json();
      const userText = transcribeData.text || transcribeData.transcription;
      
      const newMessages = [...messages, { role: 'user', content: userText }];
      setMessages(newMessages);

      // If logged in, save user message directly to cloud
      if (currentUser) {
        await saveMessageToCloud(currentUser.id, 'user', userText);
      }

      const chatRes = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: userText,
          location: location 
        }) 
      });
      const chatData = await chatRes.json();
      const lisaText = chatData.response || chatData.message;

      const finalMessages = [...newMessages, { role: 'assistant', content: lisaText }];
      setMessages(finalMessages);

      // If logged in, save assistant response directly to cloud
      if (currentUser) {
        await saveMessageToCloud(currentUser.id, 'assistant', lisaText);
      }

      const speakRes = await fetch("http://localhost:8000/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: lisaText })
      });
      
      const audioBlobResponse = await speakRes.blob();
      const audioUrl = URL.createObjectURL(audioBlobResponse);
      const audio = new Audio(audioUrl);
      
      activeAudioRef.current = audio;
      audio.play();

    } catch (error) {
      console.error("Error communicating with backend:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Connection error. Please check the backend server." }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current.currentTime = 0; 
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Microphone access is required to proceed.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

    // Function to clear chat memory completely
    // Bulletproof Clear Memory function
  const clearMemory = async () => {
    if (window.confirm("Are you sure you want to clear the entire chat history?")) {
      // 1. Immediately update UI state
      setMessages([{ role: 'assistant', content: 'Hi I am Lisa! How can I assist you today?' }]);

      // 2. Clear local storage
      localStorage.removeItem('lisa_guest_chat');

      // 3. Clear Supabase table if logged in
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
    <div className="flex flex-col h-screen bg-neutral-950 text-neutral-50">
      <Header onClear={clearMemory}/>
      
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