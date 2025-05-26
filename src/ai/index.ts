
// Module IA - Exports principaux
export * from './HydrationAIExpert';
export { SportAIExpert } from './SportAIExpert';
export type { UserProfile as SportUserProfile, Recommendation } from './sport/types';
export * from './CrossDomainValidator';
export * from './types/CrossDomainTypes';
export * from './BiasTestingSystem';

// Exports de hooks
export { useCrossDomainValidator } from '@/hooks/useCrossDomainValidator';
export { useBiasTesting } from '@/hooks/useBiasTesting';
