
export interface AgentResponse {
  agent_id: string;           // Identifiant unique de l'agent
  agent_type: string;         // Type d'agent (sommeil, nutrition, muscu, etc.)
  content: string;            // Contenu détaillé de la réponse
  summary?: string;           // Résumé court (optionnel)
  timestamp: Date;            // Horodatage de la réponse
  status: 'pending' | 'ready' | 'error'; // État de la réponse
  metadata?: Record<string, any>; // Métadonnées additionnelles (extensible)
}

export interface AgentQuery {
  query_id: string;           // Identifiant unique de la requête
  user_message: string;       // Message de l'utilisateur 
  expected_agents: string[];  // Types d'agents attendus dans la réponse
  timestamp: Date;            // Horodatage de la requête
  status: 'pending' | 'complete' | 'error'; // État global de la requête
  responses: AgentResponse[]; // Tableau des réponses des agents
}

// Gestionnaire d'état des agents
export interface AgentState {
  queries: AgentQuery[];      // Historique des requêtes
  activeQueryId: string | null; // Requête active
  isLoading: boolean;         // État de chargement
  error: string | null;       // Message d'erreur éventuel
}
