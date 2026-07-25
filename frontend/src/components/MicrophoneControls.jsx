import { Mic, MicOff } from 'lucide-react';

export default function MicrophoneControls({ isRecording, isProcessing, toggleRecording }) {
  return (
    <footer className="p-8 bg-gray-950 border-t border-white/5 flex flex-col items-center justify-center gap-5 z-20 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)]">
      
      <div className="relative group cursor-pointer" onClick={toggleRecording}>
        {/* Glowing Aura for Recording State */}
        {isRecording && (
          <div className="absolute -inset-4 bg-red-500/30 rounded-full blur-xl animate-pulse"></div>
        )}
        
        <button 
          disabled={isProcessing}
          className={`relative z-10 p-6 rounded-full shadow-2xl transition-all duration-300 transform group-hover:scale-105 active:scale-95 ${
            isRecording 
              ? 'bg-gradient-to-br from-red-500 to-rose-600 ring-4 ring-red-500/30' 
              : 'bg-gray-800 ring-1 ring-gray-700 hover:bg-gray-700'
          } ${isProcessing ? 'opacity-40 cursor-not-allowed grayscale' : ''}`}
        >
          {isRecording ? (
            <MicOff className="w-8 h-8 text-white drop-shadow-md" />
          ) : (
            <Mic className="w-8 h-8 text-teal-400 drop-shadow-md" />
          )}
        </button>
      </div>
      
      <div className="flex flex-col items-center gap-1.5 h-10">
        <p className={`text-base font-medium tracking-wide transition-colors ${
          isRecording ? 'text-red-400 animate-pulse' : 'text-gray-300'
        }`}>
          {isRecording ? 'Listening...' : 'Tap to speak'}
        </p>
        
        {/* Dynamic subtext based on industry UX standards */}
        <p className="text-[11px] text-gray-500 tracking-wide uppercase">
          {isRecording ? 'Press again to stop' : 'Lisa Voice Assistant v1'}
        </p>
      </div>

    </footer>
  );
}