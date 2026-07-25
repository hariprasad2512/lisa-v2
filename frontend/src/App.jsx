import { useState } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am Lisa. How can I help you today?' }
  ]);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Future: Web Audio API integration will go here
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      
      {/* Header */}
      <header className="flex items-center justify-center py-5 shadow-md bg-gray-800 border-b border-gray-700">
        <h1 className="text-2xl font-bold tracking-wider text-teal-400">LISA</h1>
      </header>

      {/* Chat Stream Area */}
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

      {/* Control Bar */}
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