
export class BundleOptimizer {
  private loadedModules = new Set<string>();
  private pendingLoads = new Map<string, Promise<any>>();
  private moduleStats = new Map<string, { loadTime: number; size?: number }>();
  private static instance: BundleOptimizer;

  // Singleton pattern pour partager l'état
  static getInstance(): BundleOptimizer {
    if (!BundleOptimizer.instance) {
      BundleOptimizer.instance = new BundleOptimizer();
    }
    return BundleOptimizer.instance;
  }

  async loadModuleOptimized(moduleName: string): Promise<any> {
    console.log(`🔄 Tentative de chargement optimisé: ${moduleName}`);
    
    // Évite double chargement
    if (this.loadedModules.has(moduleName)) {
      console.log(`⚡ Module ${moduleName} déjà en mémoire`);
      return;
    }

    // Évite chargements parallèles du même module
    if (this.pendingLoads.has(moduleName)) {
      console.log(`⏳ Attente du chargement en cours: ${moduleName}`);
      return await this.pendingLoads.get(moduleName);
    }

    const startTime = Date.now();
    const loadPromise = this.dynamicImport(moduleName);
    this.pendingLoads.set(moduleName, loadPromise);

    try {
      const module = await loadPromise;
      const loadTime = Date.now() - startTime;
      
      this.loadedModules.add(moduleName);
      this.moduleStats.set(moduleName, { loadTime });
      this.pendingLoads.delete(moduleName);
      
      console.log(`✅ Module ${moduleName} chargé en ${loadTime}ms`);
      return module;
    } catch (error) {
      this.pendingLoads.delete(moduleName);
      console.error(`❌ Échec du chargement de ${moduleName}:`, error);
      throw error;
    }
  }

  private async dynamicImport(moduleName: string): Promise<any> {
    const moduleMap: Record<string, () => Promise<any>> = {
      'workout': () => import('@/pages/Workout'),
      'nutrition': () => import('@/pages/Nutrition'),
      'sleep': () => import('@/pages/Sleep'),
      'coach': () => import('@/pages/Coach'),
      'dashboard': () => import('@/pages/Dashboard'),
      'settings': () => import('@/pages/Settings'),
      'profile': () => import('@/pages/Profile'),
      'onboarding': () => import('@/pages/Onboarding'),
      'achievements': () => import('@/pages/Achievements')
    };

    const importFn = moduleMap[moduleName];
    if (!importFn) {
      throw new Error(`Module ${moduleName} non trouvé dans la map`);
    }

    return await importFn();
  }

  // Préchargement intelligent basé sur priorité
  async preloadByPriority(): Promise<void> {
    console.log('🚀 Démarrage du préchargement par priorité...');
    
    const priorities = {
      high: ['workout', 'nutrition'], // Modules les plus utilisés
      medium: ['sleep', 'coach', 'dashboard'], // Usage moyen
      low: ['settings', 'profile', 'achievements'] // Usage occasionnel
    };

    try {
      // Charge haute priorité en premier (bloquant)
      console.log('📈 Chargement modules haute priorité...');
      for (const module of priorities.high) {
        await this.loadModuleOptimized(module);
      }

      // Charge moyenne priorité en arrière-plan (non-bloquant)
      setTimeout(async () => {
        console.log('📊 Chargement modules moyenne priorité...');
        for (const module of priorities.medium) {
          this.loadModuleOptimized(module).catch(error => 
            console.warn(`Échec préchargement ${module}:`, error)
          );
        }
      }, 1000);

      // Charge basse priorité encore plus tard
      setTimeout(async () => {
        console.log('📋 Chargement modules basse priorité...');
        for (const module of priorities.low) {
          this.loadModuleOptimized(module).catch(error => 
            console.warn(`Échec préchargement ${module}:`, error)
          );
        }
      }, 5000);

    } catch (error) {
      console.error('❌ Erreur dans le préchargement par priorité:', error);
    }
  }

  // Préchargement contextuel basé sur la navigation
  async preloadContextual(currentModule: string): Promise<void> {
    const contextualMap: Record<string, string[]> = {
      'workout': ['nutrition', 'coach'], // Après workout, souvent nutrition ou coach
      'nutrition': ['workout', 'sleep'], // Après nutrition, souvent workout ou sleep
      'sleep': ['nutrition', 'dashboard'], // Après sleep, souvent nutrition ou dashboard
      'coach': ['workout', 'nutrition'], // Coach suggère workout/nutrition
      'dashboard': ['workout', 'nutrition', 'sleep'] // Dashboard mène partout
    };

    const contextualModules = contextualMap[currentModule] || [];
    console.log(`🎯 Préchargement contextuel pour ${currentModule}:`, contextualModules);

    // Précharge avec délai pour ne pas impacter la performance
    setTimeout(() => {
      contextualModules.forEach(module => {
        if (!this.loadedModules.has(module)) {
          this.loadModuleOptimized(module).catch(error => 
            console.warn(`Échec préchargement contextuel ${module}:`, error)
          );
        }
      });
    }, 2000);
  }

  // Vérification si un module est chargé
  isModuleLoaded(moduleName: string): boolean {
    return this.loadedModules.has(moduleName);
  }

  // Statistiques des modules
  getModuleStats() {
    const stats = {
      loadedCount: this.loadedModules.size,
      pendingCount: this.pendingLoads.size,
      modules: Object.fromEntries(this.moduleStats)
    };
    
    console.log('📊 Statistiques des modules:', stats);
    return stats;
  }

  // Nettoyage des modules (si nécessaire pour la mémoire)
  unloadModule(moduleName: string): void {
    if (this.loadedModules.has(moduleName)) {
      this.loadedModules.delete(moduleName);
      this.moduleStats.delete(moduleName);
      console.log(`🗑️ Module ${moduleName} déchargé`);
    }
  }
}

// Instance singleton
export const bundleOptimizer = new BundleOptimizer();
