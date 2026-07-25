import { AudioLines, Trash2 } from 'lucide-react';
import AuthButton from './AuthButton';

export default function Header({ onClear }) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-800/60 bg-neutral-950/80 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/5">
          <AudioLines className="w-5 h-5 text-emerald-400 animate-pulse" />
        </div>
        <div>
          <h1 className="text-base font-semibold tracking-tight text-neutral-100">Lisa</h1>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs text-neutral-400 font-medium">Ready</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Clear Chat Button */}
        <button
          onClick={onClear}
          title="Clear Chat History"
          className="flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-200 px-3 py-1.5 rounded-full text-xs font-medium transition-all shadow-sm"
        >
          <Trash2 className="w-3.5 h-3.5 text-neutral-400" />
          <span>Reset</span>
        </button>

        {/* Google Sign-In Button */}
        <AuthButton />
      </div>
    </header>
  );
}