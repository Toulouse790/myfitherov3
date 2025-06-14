
// Point d'entrée principal pour les services Supabase
import { BaseService } from './BaseService';
import { ConversationService } from './ConversationService';
import { MessageService } from './MessageService';
import { AnalyticsService } from './AnalyticsService';
import { SyncService } from './SyncService';
import { ProfileService } from './ProfileService';

// Exporter tous les services sous un objet unique pour la compatibilité avec le code existant
export const SupabaseService = {
  // BaseService
  testConnection: BaseService.testConnection,

  // ConversationService
  getUserConversations: ConversationService.getUserConversations,
  getConversationMessages: ConversationService.getConversationMessages,
  createConversation: ConversationService.createConversation,
  getOrCreateConversation: ConversationService.getOrCreateConversation,
  getMessages: ConversationService.getMessages,
  deleteConversation: ConversationService.deleteConversation,

  // MessageService
  saveMessage: MessageService.saveMessage,
  sendFinalSyntheseToLovable: MessageService.sendFinalSyntheseToLovable,

  // AnalyticsService
  logInteraction: AnalyticsService.logInteraction,

  // SyncService
  syncLocalData: SyncService.syncLocalData,

  // ProfileService
  saveUserProfile: ProfileService.saveUserProfile,
  updateUserProfile: ProfileService.updateUserProfile,
  getUserProfile: ProfileService.getUserProfile,
};

// Exporter également les services individuels pour une utilisation plus moderne
export {
  BaseService,
  ConversationService,
  MessageService,
  AnalyticsService,
  SyncService,
  ProfileService
};

// Réexporter les types
export * from './types';
export type { UserProfile } from './ProfileService';
