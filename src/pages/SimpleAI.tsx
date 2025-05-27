
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SimpleAICoach from '@/components/ai/SimpleAICoach';

const SimpleAI = () => {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">IA Coach Simple</h1>
          <p className="text-muted-foreground">
            Logique simple et efficace pour vos recommandations santé
          </p>
        </div>

        <SimpleAICoach />
      </div>
    </MainLayout>
  );
};

export default SimpleAI;
