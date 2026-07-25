import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';

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
    return (
      <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-full text-xs text-neutral-300">
        <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
        <span className="truncate max-w-[120px]">{user.user_metadata.full_name}</span>
        <button 
          onClick={handleLogout}
          title="Sign Out"
          className="text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleLogin}
      className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shadow-sm"
    >
      <LogIn className="w-3.5 h-3.5 text-emerald-400" />
      <span>Sign in with Google</span>
    </button>
  );
}