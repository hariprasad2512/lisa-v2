import { useState, useRef } from 'react';
import { saveMessageToCloud } from '../chatService';

const locationKeywords = [
  'location', 'where am i', 'weather', 'temperature', 'forecast',
  'rain', 'nearby', 'near me', 'local', 'city', 'place', 'places',
  'restaurant', 'restaurants', 'hotel', 'hotels', 'traffic', 'here'
];

export function useAudioRecorder(messages, setMessages, currentUser, location, requestLocation) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const activeAudioRef = useRef(null);

  const shouldRequestLocation = (text) => {
    const normalized = text.toLowerCase();
    return locationKeywords.some((keyword) => normalized.includes(keyword));
  };

  // Automatically use Render in production or localhost during development
  const API_BASE_URL = import.meta.env.DEV 
    ? 'http://localhost:8000' 
    : (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000');

  const processAudio = async (audioBlob) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "voice.webm");
      
      const transcribeRes = await fetch(`${API_BASE_URL}/transcribe`, {
        method: "POST",
        body: formData
      });
      const transcribeData = await transcribeRes.json();
      const userText = transcribeData.text || transcribeData.transcription;
      
      const newMessages = [...messages, { role: 'user', content: userText }];
      setMessages(newMessages);

      if (currentUser) {
        await saveMessageToCloud(currentUser.id, 'user', userText);
      }

      let locationToSend = null;
      if (shouldRequestLocation(userText) && requestLocation) {
        locationToSend = await requestLocation();
      }

      const chatRes = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userText, location: locationToSend }) 
      });
      const chatData = await chatRes.json();

      let lisaText = "";
      let musicUrl = null;

      // 1. Check if the response is a music action payload
      if (chatData.action === "play_music") {
        lisaText = chatData.speak || `Playing ${chatData.query} on YouTube`;
        musicUrl = chatData.url;
      } else {
        // Standard conversational response
        lisaText = chatData.response || chatData.message;
      }

      // Update UI with Lisa's response
      const finalMessages = [...newMessages, { role: 'assistant', content: lisaText }];
      setMessages(finalMessages);

      if (currentUser) {
        await saveMessageToCloud(currentUser.id, 'assistant', lisaText);
      }

      // 2. Fetch TTS audio for Lisa's response
      const speakRes = await fetch(`${API_BASE_URL}/speak`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: lisaText })
      });
      
      const audioBlobResponse = await speakRes.blob();
      const audioUrl = URL.createObjectURL(audioBlobResponse);
      const audio = new Audio(audioUrl);
      
      activeAudioRef.current = audio;
      audio.play();

      // 3. Trigger music redirection after brief delay so TTS starts
      if (musicUrl) {
        setTimeout(() => {
          // Check if the device is mobile (iOS or Android)
          const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

          if (isMobile) {
            // Navigating the active window forces iOS Safari / Android Chrome 
            // to trigger Universal Links and open the native YouTube app
            window.location.href = musicUrl;
          } else {
            // Desktop fallback: open in a new tab
            window.open(musicUrl, '_blank', 'noopener,noreferrer');
          }
        }, 1200);
      }   

    } catch (error) {
      console.error("Error communicating with backend:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Connection error. Please check the backend server." }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    // Interrupt Lisa if she is currently speaking
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

  return { isRecording, isProcessing, toggleRecording };
}