
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Check } from 'lucide-react';

const InstructionsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Instructions d'exécution</CardTitle>
        <CardDescription>Comment réaliser cet entraînement efficacement</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium flex items-center"><Check size={16} className="mr-2 text-green-600" /> Échauffement</h3>
          <p className="text-muted-foreground mt-1">5-10 minutes d'échauffement cardiovasculaire léger suivi d'exercices de mobilité pour les articulations sollicitées.</p>
        </div>
        <Separator />
        <div>
          <h3 className="font-medium flex items-center"><Check size={16} className="mr-2 text-green-600" /> Technique</h3>
          <p className="text-muted-foreground mt-1">Concentrez-vous sur l'exécution parfaite de chaque mouvement plutôt que sur le poids soulevé.</p>
        </div>
        <Separator />
        <div>
          <h3 className="font-medium flex items-center"><Check size={16} className="mr-2 text-green-600" /> Progression</h3>
          <p className="text-muted-foreground mt-1">Augmentez progressivement la charge ou les répétitions lorsque vous maîtrisez l'exercice avec une bonne technique.</p>
        </div>
        <Separator />
        <div>
          <h3 className="font-medium flex items-center"><Check size={16} className="mr-2 text-green-600" /> Récupération</h3>
          <p className="text-muted-foreground mt-1">Respectez les temps de repos indiqués entre les séries pour une récupération optimale.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstructionsTab;
