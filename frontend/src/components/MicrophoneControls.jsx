import { Mic, MicOff, Loader2 } from 'lucide-react';

export default function MicrophoneControls({
  isRecording,
  isProcessing,
  toggleRecording,
}) {
  const isListening = isRecording && !isProcessing;

  return (
    <footer
      className={`sticky bottom-0 z-40 w-full border-t border-white/5 bg-gray-950 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)] transition-[padding] duration-300 ${
        isListening ? 'px-4 py-5 sm:py-6' : 'px-4 py-3'
      }`}
    >
      <div
        className={`mx-auto flex max-w-3xl items-center justify-center transition-all duration-300 ${
          isListening ? 'flex-col gap-4' : 'flex-row gap-3 sm:gap-4'
        }`}
      >

        {/* Microphone */}
        <div
          className={`relative flex items-center justify-center transition-all duration-300 ${
            isListening ? 'h-24 w-24' : 'h-12 w-12 flex-shrink-0'
          }`}
        >

          {/* Animated listening rings */}
          {isListening && (
            <>
              <span className="absolute inset-2 rounded-full border border-red-400/30 animate-[ping_2s_ease-out_infinite]" />
              <span className="absolute inset-0 rounded-full border border-red-400/20 animate-[ping_2s_ease-out_infinite_0.6s]" />

              {/* Outer glow */}
              <div className="absolute -inset-3 rounded-full bg-red-500/20 blur-2xl animate-pulse" />

              {/* Inner glow */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-red-500/20 via-rose-500/30 to-red-500/20 blur-md" />
            </>
          )}

          {/* Processing glow */}
          {isProcessing && (
            <div className="absolute -inset-3 rounded-full bg-teal-400/20 blur-2xl animate-pulse" />
          )}

          <button
            type="button"
            disabled={isProcessing}
            onClick={toggleRecording}
            aria-label={
              isProcessing
                ? 'Processing voice input'
                : isRecording
                  ? 'Stop listening'
                  : 'Start voice input'
            }
            className={`
              relative z-10 flex items-center justify-center
              rounded-full shadow-2xl
              transition-all duration-300
              hover:scale-105 active:scale-95
              focus:outline-none focus:ring-2 focus:ring-teal-400/50
              ${isListening ? 'h-16 w-16' : 'h-12 w-12'}
              ${
                isRecording
                  ? 'bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/30 ring-4 ring-red-500/20'
                  : 'bg-gray-800 ring-1 ring-gray-700 hover:bg-gray-700'
              }
              ${isProcessing ? 'cursor-not-allowed opacity-60 grayscale' : ''}
            `}
          >
            {isProcessing ? (
              <Loader2 className="h-5 w-5 animate-spin text-teal-300" />
            ) : isRecording ? (
              <MicOff className={`${isListening ? 'h-7 w-7' : 'h-5 w-5'} text-white drop-shadow-md`} />
            ) : (
              <Mic className="h-5 w-5 text-teal-400 drop-shadow-md" />
            )}
          </button>
        </div>

        {/* Animated sound waves */}
        {isListening && (
          <div className="flex h-6 items-center justify-center gap-1">
            {[1, 2, 3, 4, 5, 6, 7].map((bar) => (
              <span
                key={bar}
                className="w-1 rounded-full bg-red-400/80"
                style={{
                  height: `${8 + (bar % 4) * 4}px`,
                  animation: `voiceWave 0.8s ease-in-out infinite`,
                  animationDelay: `${bar * 0.1}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Status */}
        <div
          className={`flex items-center ${
            isListening ? 'h-10 flex-col gap-1.5' : 'min-w-0 flex-row gap-2'
          }`}
        >
          <p
            className={`whitespace-nowrap text-sm font-medium tracking-wide transition-colors duration-300 ${
              isProcessing
                ? 'text-teal-300'
                : isRecording
                  ? 'text-red-400'
                  : 'text-gray-300'
            }`}
          >
            {isProcessing
              ? 'Thinking...'
              : isRecording
                ? 'Listening...'
                : 'Tap to speak'}
          </p>

          <p className={`text-[11px] uppercase tracking-wide text-gray-500 ${isListening ? '' : 'hidden sm:block'}`}>
            {isProcessing
              ? 'Processing your voice'
              : isRecording
                ? 'Press again to stop'
                : 'Lisa Voice Assistant v1'}
          </p>
        </div>
      </div>

      {/* Component-scoped animation */}
      <style>{`
        @keyframes voiceWave {
          0%, 100% {
            transform: scaleY(0.5);
            opacity: 0.5;
          }
          50% {
            transform: scaleY(1.4);
            opacity: 1;
          }
        }
      `}</style>
    </footer>
  );
}
