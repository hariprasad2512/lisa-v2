import { Mic, MicOff } from 'lucide-react';

export default function MicrophoneControls({ isRecording, isProcessing, toggleRecording }) {
  return (
    <footer className="p-8 bg-gray-900/90 backdrop-blur-lg border-t border-gray-800 flex flex-col items-center justify-center gap-5">
      <div className="relative">
        {isRecording && (
          <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-25"></div>
        )}
        <button 
          onClick={toggleRecording}
          disabled={isProcessing}
          className={`relative z-10 p-6 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
            isRecording 
              ? 'bg-red-500 shadow-red-500/50' 
              : 'bg-teal-500 hover:bg-teal-400 shadow-teal-500/30'
          } ${isProcessing ? 'opacity-40 cursor-not-allowed grayscale' : ''}`}
        >
          {isRecording ? (
            <MicOff className="w-8 h-8 text-white" />
          ) : (
            <Mic className="w-8 h-8 text-white" />
          )}
        </button>
      </div>
      
      <p className={`text-sm font-medium tracking-widest uppercase transition-colors ${
        isRecording ? 'text-red-400 animate-pulse' : 'text-gray-500'
      }`}>
        {isRecording ? 'Listening...' : 'Tap to speak'}
      </p>
    </footer>
  );
}