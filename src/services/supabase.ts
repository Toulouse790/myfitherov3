
// Ce fichier est conservé pour la compatibilité avec le code existant
// Il réexporte simplement les services refactorés
// Pour les nouveaux développements, utilisez directement les imports depuis 'src/services/supabase/index.ts'

import { SupabaseService } from './supabase/index';
export { SupabaseService };

// Réexporter les types et interfaces pour la compatibilité
export type {
  User,
  Conversation,
  Message,
  SynthesePayload,
  ApiConfig
} from './supabase/types';

// Ajouter un avertissement de dépréciation en console lors de l'importation
console.warn(
  'Le fichier src/services/supabase.ts est déprécié. ' +
  'Veuillez utiliser les imports depuis src/services/supabase/index.ts à la place.'
);
