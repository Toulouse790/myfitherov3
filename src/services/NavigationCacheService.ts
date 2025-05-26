
export class NavigationCacheService {
  private cache = new Map<string, any>();
  private preloadedModules = new Set<string>();
  private static instance: NavigationCacheService;

  // Singleton pattern pour partager le cache
  static getInstance(): NavigationCacheService {
    if (!NavigationCacheService.instance) {
      NavigationCacheService.instance = new NavigationCacheService();
    }
    return NavigationCacheService.instance;
  }

  // Précharge les modules populaires
  async preloadPopularModules() {
    const popularModules = ['workout', 'nutrition', 'coach']; // Les plus utilisés
    console.log('🚀 Préchargement des modules populaires...');
    
    for (const module of popularModules) {
      if (!this.preloadedModules.has(module)) {
        await this.preloadModule(module);
      }
    }
  }

  private async preloadModule(moduleName: string) {
    try {
      console.log(`⏳ Préchargement du module ${moduleName}...`);
      // Préchargement silencieux en arrière-plan
      await import(`@/pages/${this.getModulePage(moduleName)}`);
      this.preloadedModules.add(moduleName);
      console.log(`✅ Module ${moduleName} préchargé avec succès`);
    } catch (error) {
      console.warn(`❌ Échec du préchargement pour ${moduleName}:`, error);
    }
  }

  private getModulePage(moduleName: string): string {
    const moduleMap: Record<string, string> = {
      'workout': 'Workout',
      'nutrition': 'Nutrition',
      'sleep': 'Sleep',
      'coach': 'Coach',
      'dashboard': 'Dashboard'
    };
    return moduleMap[moduleName] || moduleName;
  }

  // Vérifie si un module est déjà préchargé
  isModulePreloaded(moduleName: string): boolean {
    return this.preloadedModules.has(moduleName);
  }

  // Cache des données de navigation
  setCacheData(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  getCacheData(key: string): any {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    // Expire après 5 minutes
    const isExpired = Date.now() - cached.timestamp > 5 * 60 * 1000;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  // Précharge automatiquement les modules adjacents
  async preloadAdjacentModules(currentModule: string) {
    const moduleFlow = {
      'workout': ['nutrition', 'coach'],
      'nutrition': ['workout', 'sleep'],
      'sleep': ['nutrition', 'dashboard'],
      'coach': ['workout', 'nutrition'],
      'dashboard': ['workout', 'nutrition']
    };

    const adjacentModules = moduleFlow[currentModule] || [];
    for (const module of adjacentModules) {
      if (!this.preloadedModules.has(module)) {
        // Préchargement avec délai pour ne pas surcharger
        setTimeout(() => this.preloadModule(module), 1000);
      }
    }
  }
}
