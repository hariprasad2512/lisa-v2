import { useState, useRef } from 'react';
import { saveMessageToCloud } from '../chatService';

export function useAudioRecorder(messages, setMessages, currentUser, location) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const activeAudioRef = useRef(null);

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

      if (currentUser) {
        await saveMessageToCloud(currentUser.id, 'user', userText);
      }

      const chatRes = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userText, location }) 
      });
      const chatData = await chatRes.json();
      const lisaText = chatData.response || chatData.message;

      const finalMessages = [...newMessages, { role: 'assistant', content: lisaText }];
      setMessages(finalMessages);

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
