
import { supabase } from '@/integrations/supabase/client';

// Types simplifiés pour éviter les problèmes TypeScript
interface SimpleConversation {
  id: string;
  user_id: string;
  agent_id?: string;
  title?: string;
  created_at?: string;
  last_message_at?: string;
}

interface SimpleAgent {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: string;
}

export class ConversationQueries {
  /**
   * Trouve un agent par slug ou nom
   */
  static async findAgent(agentSlugOrName: string): Promise<{ id: string; name: string } | null> {
    try {
      const { data: agentData, error: agentError } = await supabase
        .from('ai_agents')
        .select('id, name, slug')
        .or(`slug.eq.${agentSlugOrName},name.ilike.%${agentSlugOrName}%`)
        .eq('status', 'active')
        .limit(1);

      if (agentError) {
        console.error('Erreur recherche agent:', agentError);
        return null;
      }

      if (agentData && agentData.length > 0) {
        return {
          id: agentData[0].id,
          name: agentData[0].name
        };
      }

      return null;
    } catch (err) {
      console.error('Exception recherche agent:', err);
      return null;
    }
  }

  /**
   * Cherche une conversation existante
   */
  static async findExistingConversation(userId: string, agentId?: string): Promise<string | null> {
    try {
      let searchQuery = supabase
        .from('ai_conversations')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1);

      // Si un agent spécifique est trouvé, filtrer par agent
      if (agentId) {
        searchQuery = searchQuery.eq('agent_id', agentId);
      }

      const { data: existingData, error: searchError } = await searchQuery;

      if (searchError) {
        console.error('Erreur recherche conversation:', searchError);
        return null;
      }

      if (existingData && existingData.length > 0) {
        return existingData[0].id;
      }

      return null;
    } catch (err) {
      console.error('Exception recherche conversation:', err);
      return null;
    }
  }

  /**
   * Récupère toutes les conversations d'un utilisateur
   */
  static async getUserConversations(userId: string): Promise<SimpleConversation[]> {
    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('id, user_id, agent_id, title, created_at, last_message_at')
        .eq('user_id', userId)
        .order('last_message_at', { ascending: false });

      if (error) {
        console.error('Erreur récupération conversations:', error);
        return [];
      }

      return (data || []).map(conv => ({
        id: conv.id,
        user_id: conv.user_id || '',
        agent_id: conv.agent_id || undefined,
        title: conv.title || undefined,
        created_at: conv.created_at || undefined,
        last_message_at: conv.last_message_at || undefined
      }));
    } catch (err) {
      console.error('Exception récupération conversations:', err);
      return [];
    }
  }

  /**
   * Récupère les agents disponibles
   */
  static async getAvailableAgents(): Promise<SimpleAgent[]> {
    try {
      const { data, error } = await supabase
        .from('ai_agents')
        .select('id, name, slug, description, status')
        .eq('status', 'active')
        .order('name', { ascending: true });

      if (error) {
        console.error('Erreur récupération agents:', error);
        return [];
      }

      return (data || []).map(agent => ({
        id: agent.id,
        name: agent.name,
        slug: agent.slug,
        description: agent.description || undefined,
        status: agent.status
      }));
    } catch (err) {
      console.error('Exception récupération agents:', err);
      return [];
    }
  }
}
