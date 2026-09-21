import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from '../supabaseClient';
import { fetchCloudMessages, migrateGuestChatToCloud } from '../chatService';
import { setMessages } from '../store/slices/chatSlice';

export function useAuth() {
  const dispatch = useDispatch();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const handleAuthChange = async (user) => {
      setCurrentUser(user);
      if (user) {
        await migrateGuestChatToCloud(user.id);
        const cloudMsgs = await fetchCloudMessages(user.id);
        if (cloudMsgs.length > 0) {
          dispatch(setMessages(cloudMsgs));
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
  }, [dispatch]);

  return currentUser;
}