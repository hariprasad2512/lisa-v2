import { supabase } from './supabaseClient';

export async function fetchCloudMessages(userId) {
  const { data, error } = await supabase
    .from('messages')
    .select('role, content, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error("Error fetching cloud messages:", error.message);
    return [];
  }
  
  // Deduplicate based on content and role to prevent visual duplication bugs
  const uniqueMessages = [];
  const seen = new Set();
  for (const row of data) {
    const identifier = `${row.role}:${row.content}`;
    if (!seen.has(identifier)) {
      seen.add(identifier);
      uniqueMessages.push({ role: row.role, content: row.content });
    }
  }

  return uniqueMessages;
}

export async function saveMessageToCloud(userId, role, content) {
  const { error } = await supabase
    .from('messages')
    .insert([{ user_id: userId, role, content }]);

  if (error) {
    console.error("Error saving message to cloud:", error.message);
  }
}

export async function migrateGuestChatToCloud(userId) {
  const savedChat = localStorage.getItem('lisa_guest_chat');
  if (!savedChat) return;

  const guestMessages = JSON.parse(savedChat);
  if (guestMessages.length === 0) return;

  // Check what's already in the cloud to avoid duplicating local history during migration
  const existingCloud = await fetchCloudMessages(userId);
  const existingSet = new Set(existingCloud.map(m => `${m.role}:${m.content}`));

  const rowsToInsert = guestMessages
    .filter(msg => !existingSet.has(`${msg.role}:${msg.content}`))
    .map(msg => ({
      user_id: userId,
      role: msg.role,
      content: msg.content
    }));

  if (rowsToInsert.length > 0) {
    const { error } = await supabase.from('messages').insert(rowsToInsert);
    if (!error) {
      localStorage.removeItem('lisa_guest_chat');
      console.log("Successfully migrated guest chat to Supabase!");
    } else {
      console.error("Migration error:", error.message);
    }
  } else {
    // If they were already synced, just clear local storage
    localStorage.removeItem('lisa_guest_chat');
  }
}