
// Point d'entrée principal pour les services Supabase
import { BaseService } from './BaseService';
import { ConversationService } from './ConversationService';
import { MessageService } from './MessageService';
import { AnalyticsService } from './AnalyticsService';
import { SyncService } from './SyncService';

// Exporter tous les services sous un objet unique pour la compatibilité avec le code existant
export const SupabaseService = {
  // BaseService
  testConnection: BaseService.testConnection,

  // ConversationService
  getUserConversations: ConversationService.getUserConversations,
  getConversationMessages: ConversationService.getConversationMessages,
  createConversation: ConversationService.createConversation,

  // MessageService
  saveMessage: MessageService.saveMessage,
  sendFinalSyntheseToLovable: MessageService.sendFinalSyntheseToLovable,

  // AnalyticsService
  logInteraction: AnalyticsService.logInteraction,

  // SyncService
  syncLocalData: SyncService.syncLocalData,
};

// Exporter également les services individuels pour une utilisation plus moderne
export {
  BaseService,
  ConversationService,
  MessageService,
  AnalyticsService,
  SyncService
};

// Réexporter les types
export * from './types';
