import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Enhanced validation with better error messages
if (!supabaseUrl) {
  console.error("VITE_SUPABASE_URL is missing:", supabaseUrl);
  throw new Error("VITE_SUPABASE_URL environment variable is not set");
}

if (!supabaseAnonKey) {
  console.error("VITE_SUPABASE_ANON_KEY is missing:", supabaseAnonKey);
  throw new Error("VITE_SUPABASE_ANON_KEY environment variable is not set");
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (error) {
  console.error("Invalid Supabase URL format:", supabaseUrl);
  throw new Error(`Invalid VITE_SUPABASE_URL format: ${supabaseUrl}`);
}

console.log("Supabase configuration:", {
  url: supabaseUrl,
  keyLength: supabaseAnonKey.length,
  keyStart: supabaseAnonKey.substring(0, 10) + "...",
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for chat messages
export interface ChatMessage {
  id: string;
  user_id: string;
  content: string;
  role: "user" | "assistant";
  created_at: string;
}

// Function to save chat message
export async function saveChatMessage(
  message: Omit<ChatMessage, "id" | "created_at">
) {
  const { data, error } = await supabase
    .from("chat_messages")
    .insert([
      {
        ...message,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Function to get chat history for a user
export async function getChatHistory(userId: string) {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as ChatMessage[];
}
