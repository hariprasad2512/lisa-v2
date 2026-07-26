import { AudioLines, Trash2 } from 'lucide-react';
import AuthButton from './AuthButton';

export default function Header({ onClear }) {
  return (
    <header className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 border-b border-neutral-800/60 bg-neutral-950/80 backdrop-blur-md w-full">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/5 flex-shrink-0">
          <AudioLines className="w-5 h-5 text-emerald-400 animate-pulse" />
        </div>
        <div className="min-w-0">
          <h1 className="text-base font-semibold tracking-tight text-neutral-100 truncate">Lisa</h1>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs text-neutral-400 font-medium">Ready</span>
          </div>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <button
          onClick={onClear}
          title="Reset Chat"
          aria-label="Reset Chat"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-neutral-400 transition-all hover:bg-neutral-800 hover:text-neutral-200 shadow-sm"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <AuthButton />
      </div>
    </header>
  );
}