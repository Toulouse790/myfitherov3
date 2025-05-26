
// Module Hydratation - Point d'entrée principal avec sécurité médicale
export * from './hooks';
export * from './types';
export * from './services';
export * from './medical-validation';

// Exportation des composants d'hydratation
export { HydrationSafetyCard } from '@/components/hydration/HydrationSafetyCard';
export { HydrationDashboardCard } from '@/components/dashboard/HydrationDashboardCard';

// Exportation des composants d'urgence - SYSTÈME COMPLET 4 DOMAINES
export { EmergencyFloatingButton } from '@/components/emergency/EmergencyFloatingButton';
export { EmergencyHydrationModal } from '@/components/emergency/EmergencyHydrationModal';
export { EmergencySportModal } from '@/components/emergency/EmergencySportModal';
export { EmergencyNutritionModal } from '@/components/emergency/EmergencyNutritionModal';
export { EmergencySleepModal } from '@/components/emergency/EmergencySleepModal';

// Exportation des services de sécurité
export { hydrationMedicalValidator } from './medical-validation';

// Exportation des systèmes IA
export { hydrationAIExpert } from '@/ai/HydrationAIExpert';
