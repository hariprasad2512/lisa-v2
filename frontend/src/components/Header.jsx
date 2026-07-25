import { AudioLines } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-5 bg-gray-950/70 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
      
      {/* Logo & Branding Area */}
      <div className="flex items-center gap-3">
        {/* Modern Glassmorphic Logo Container */}
        <div className="p-2 bg-gradient-to-br from-teal-500/10 to-emerald-500/10 rounded-xl border border-teal-500/20 shadow-[0_0_15px_rgba(20,184,166,0.1)]">
          <AudioLines className="w-5 h-5 text-teal-400" />
        </div>
        
        {/* Modernized Font: Tighter tracking, cleaner weight */}
        <h1 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-200">
          Lisa.
        </h1>
      </div>

      {/* Consumer-Friendly Status Indicator */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900/50 rounded-full border border-gray-800/50">
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </div>
        <span className="text-[15px] font-medium tracking-wide text-gray-400">
          Ready
        </span>
      </div>

    </header>
  );
}