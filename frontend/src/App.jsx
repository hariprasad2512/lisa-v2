import { useState, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am Lisa. How can I help you today?' }
  ]);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // NEW: Function to handle the 3-step FastAPI communication
  const processAudio = async (audioBlob) => {
    setIsProcessing(true);
    try {
      // 1. Send Audio to /transcribe (Ears)
      const formData = new FormData();
      formData.append("file", audioBlob, "voice.webm");
      
      const transcribeRes = await fetch("http://localhost:8000/transcribe", {
        method: "POST",
        body: formData
      });
      const transcribeData = await transcribeRes.json();
      const userText = transcribeData.text || transcribeData.transcription; // Adjust based on your exact FastAPI return key
      
      // Update UI with what you said
      setMessages(prev => [...prev, { role: 'user', content: userText }]);

      // 2. Send Text to /chat (Brain)
      const chatRes = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userText }) 
      });
      const chatData = await chatRes.json();
      const lisaText = chatData.response || chatData.message; // Adjust based on your exact FastAPI return key

      // Update UI with Lisa's response
      setMessages(prev => [...prev, { role: 'assistant', content: lisaText }]);

      // 3. Send Text to /speak (Voice) and Play Audio
      const speakRes = await fetch("http://localhost:8000/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: lisaText })
      });
      
      const audioBlobResponse = await speakRes.blob();
      const audioUrl = URL.createObjectURL(audioBlobResponse);
      const audio = new Audio(audioUrl);
      audio.play();

    } catch (error) {
      console.error("Error communicating with backend:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I had trouble connecting to my backend servers." }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
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
        console.log("Audio Blob successfully created, sending to backend...");
        
        // NEW: Trigger the backend pipeline!
        processAudio(audioBlob);

        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Please allow microphone access to talk to Lisa.");
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

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      
      <header className="flex items-center justify-center py-5 shadow-md bg-gray-800 border-b border-gray-700">
        <h1 className="text-2xl font-bold tracking-wider text-teal-400">LISA</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] rounded-2xl p-4 shadow-lg ${
              msg.role === 'user' 
                ? 'bg-teal-600 text-white rounded-br-none' 
                : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-bl-none'
            }`}>
              <p className="leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4 rounded-bl-none shadow-lg flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-teal-400 animate-spin" />
              <span className="text-gray-400 italic">Lisa is thinking...</span>
            </div>
          </div>
        )}
      </main>

      <footer className="p-6 bg-gray-800 border-t border-gray-700 flex flex-col items-center justify-center gap-4">
        <button 
          onClick={toggleRecording}
          disabled={isProcessing}
          className={`p-6 rounded-full shadow-2xl transition-all duration-300 ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse scale-110' 
              : 'bg-teal-500 hover:bg-teal-600'
          } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isRecording ? (
            <MicOff className="w-8 h-8 text-white" />
          ) : (
            <Mic className="w-8 h-8 text-white" />
          )}
        </button>
        <p className="text-sm text-gray-400">
          {isRecording ? 'Listening...' : 'Tap to speak'}
        </p>
      </footer>
    </div>
  );
}

export default App;