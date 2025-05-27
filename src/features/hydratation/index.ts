
// Module Hydratation - Point d'entrée principal simplifié
export * from './hooks';
export * from './types';
export * from './services';

// Exportation des composants d'hydratation
export { HydrationDashboardCard } from '@/components/dashboard/HydrationDashboardCard';
export { SimpleHydrationCard } from '@/components/dashboard/SimpleHydrationCard';

// Exportation de l'IA simple (hook)
export { useHydrationAI } from './ai-integration';
