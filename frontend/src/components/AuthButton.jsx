import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { LogOut, User as UserIcon } from 'lucide-react';

export default function AuthButton() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for changes in auth state (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
        }
      });
      if (error) console.error("Login error:", error.message);
    } catch (err) {
      console.error("OAuth exception:", err);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (user) {
    const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || null;
    const displayName = user.user_metadata?.full_name || user.email || 'User';

    return (
      <div className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-100 px-1.5 py-1 text-xs text-neutral-700 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 sm:gap-2 sm:px-3 sm:py-1.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-200 text-emerald-600 dark:bg-neutral-800 dark:text-emerald-400">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <UserIcon className="w-4 h-4" />
          )}
        </div>
        <span className="hidden max-w-[110px] truncate sm:inline">{displayName}</span>
        <button
          onClick={handleLogout}
          title="Sign Out"
          aria-label="Sign Out"
          className="rounded-full p-1 text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-neutral-300"
        >
          <LogOut className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleLogin}
      title="Sign in with Google"
      aria-label="Sign in with Google"
      className="flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-800 shadow-sm transition-all hover:bg-neutral-200 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 sm:px-3.5 sm:py-1.5"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
        <path
          d="M21.6 12.23c0-.72-.06-1.41-.18-2.07H12v3.92h5.39a4.61 4.61 0 0 1-2 3.03v2.5h3.24c1.9-1.75 2.99-4.33 2.99-7.38Z"
          fill="#4285F4"
        />
        <path
          d="M12 22c2.7 0 4.96-.9 6.62-2.44l-3.24-2.5c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.07v2.58A10 10 0 0 0 12 22Z"
          fill="#34A853"
        />
        <path
          d="M6.41 13.9a5.97 5.97 0 0 1 0-3.8V7.52H3.07A10 10 0 0 0 2 12c0 1.61.39 3.14 1.07 4.48l3.34-2.58Z"
          fill="#FBBC05"
        />
        <path
          d="M12 6.08c1.47 0 2.79.5 3.83 1.49l2.87-2.87A9.96 9.96 0 0 0 12 2a10 10 0 0 0-8.93 5.52l3.34 2.58C7.2 7.84 9.4 6.08 12 6.08Z"
          fill="#EA4335"
        />
      </svg>
      <span className="hidden sm:inline">Sign in with Google</span>
      <span className="sm:hidden">Sign In</span>
    </button>
  );
}
