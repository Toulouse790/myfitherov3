
// Types partagés pour les services Supabase

export interface User {
  id: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  thread_id: string;
  user_id: string;
  title: string;
  status: 'active' | 'archived' | 'deleted';
  created_at?: string;
  updated_at?: string;
}

export interface Message {
  message_id: string;
  thread_id: string;
  user_id: string;
  sender: 'user' | 'assistant';
  content: string;
  type_demande?: string;
  metadata?: Record<string, any>;
  created_at?: string;
}

export interface SynthesePayload {
  user_id: string;
  thread_id: string;
  synthese: string;
  contexte: string;
  type: string;
}

export interface ApiConfig {
  EXTERNAL_API_URL: string;
  ENABLE_EXTERNAL_API: boolean;
}
