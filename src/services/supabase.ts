import { supabase } from '@/integrations/supabase/client';
import { ProfileService } from './supabase/ProfileService';
import { ConversationService } from './supabase/ConversationService';
import { MessageService } from './supabase/MessageService';
import { BaseService } from './supabase/index';
import type { Database } from '@/integrations/supabase/types';

// Export all services and supabase client
export {
  supabase,
  ProfileService,
  ConversationService,
  MessageService,
  BaseService
};

export type { Database };

// Legacy compatibility - export as SupabaseService for backward compatibility
export { BaseService as SupabaseService };
