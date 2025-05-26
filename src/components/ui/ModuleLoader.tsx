
import React from 'react';

export const ModuleLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    <span className="ml-4 text-muted-foreground">Chargement du module...</span>
  </div>
);

export default ModuleLoader;
