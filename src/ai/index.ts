
// Module IA - Exports principaux
export * from './HydrationAIExpert';
export { SportAIExpert } from './SportAIExpert';
export type { UserProfile as SportUserProfile } from './SportAIExpert';
export * from './CrossDomainValidator';
export * from './types/CrossDomainTypes';
export * from './BiasTestingSystem';

// Exports de hooks
export { useCrossDomainValidator } from '@/hooks/useCrossDomainValidator';
export { useBiasTesting } from '@/hooks/useBiasTesting';
