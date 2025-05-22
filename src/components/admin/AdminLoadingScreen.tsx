
import React from 'react';

const AdminLoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Vérification des accès...</p>
      </div>
    </div>
  );
};

export default AdminLoadingScreen;
