import { supabase } from '@/integrations/supabase/client';
import { ProfileService } from './supabase/ProfileService';
import { BaseService } from './supabase/index';
import type { Database } from '@/integrations/supabase/types';

// Type definitions based on Supabase schema
type User = Database['public']['Tables']['user_profiles']['Row'];
type Conversation = Database['public']['Tables']['conversations']['Row'];
type Message = Database['public']['Tables']['messages']['Row'];

// AI integration implementation
export class AIIntegrationService {
  static async createConversation(userId: string, title: string): Promise<Conversation | null> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          user_id: userId,
          title,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
  }

  static async addMessage(conversationId: string, content: string, role: 'user' | 'assistant'): Promise<Message | null> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          content,
          role,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding message:', error);
      return null;
    }
  }

  static async getConversationHistory(conversationId: string): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching conversation history:', error);
      return [];
    }
  }
}

export type { User, Conversation, Message };
