import { Trash2, Sun, Moon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import AuthButton from './AuthButton';
import { selectTheme, toggleTheme } from '../store/slices/themeSlice';

export default function Header({ isServerReady, isWakingUp, onClear }) {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);

  const onToggleTheme = () => dispatch(toggleTheme());
  return (
    <header className="sticky top-0 z-40 flex w-full flex-nowrap items-center justify-between gap-3 border-b border-neutral-200/80 bg-white/85 px-4 py-2.5 backdrop-blur-md transition-colors dark:border-neutral-800/60 dark:bg-neutral-950/80 sm:px-6">
      <div className="flex items-center gap-1 min-w-0">
        <div className="flex min-w-0 flex-col">
          <div className="flex items-center gap-1">
            <img src="/logo.svg" alt="Lisa logo" className="h-10 w-10 flex-shrink-0 object-contain sm:h-11 sm:w-11" />
            <h1 className="m-0 font-playlist truncate text-3xl leading-none text-black sm:text-4xl dark:text-white">Lisa</h1>
          </div>
          <div className="flex items-center gap-2 pl-11 sm:pl-12">
            {/* Dynamic Cold Start Status Indicator */}
            {isWakingUp ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                <span className="hidden text-xs text-amber-400 font-medium sm:inline">Waking up server...</span>
              </>
            ) : isServerReady ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="hidden text-xs font-medium text-neutral-600 sm:inline dark:text-neutral-400">Ready</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-neutral-500"></span>
                <span className="hidden text-xs font-medium text-neutral-600 sm:inline dark:text-neutral-400">Server Offline</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <button
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 text-neutral-600 shadow-sm transition-colors hover:bg-neutral-200 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <button
          onClick={onClear}
          title="Reset Chat"
          aria-label="Reset Chat"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 text-neutral-600 shadow-sm transition-all hover:bg-neutral-200 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <AuthButton />
      </div>
    </header>
  );
}
