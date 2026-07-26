import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { fetchCloudMessages, migrateGuestChatToCloud } from '../chatService';

export function useAuth(setMessages) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const handleAuthChange = async (user) => {
      setCurrentUser(user);
      if (user) {
        await migrateGuestChatToCloud(user.id);
        const cloudMsgs = await fetchCloudMessages(user.id);
        if (cloudMsgs.length > 0) {
          setMessages(cloudMsgs);
        }
      }
    };

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthChange(session?.user ?? null);
    });

    // Listen for sign in / sign out events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleAuthChange(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setMessages]);

  return currentUser;
}