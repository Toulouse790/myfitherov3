
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import WorkoutCard, { WorkoutProps } from '@/components/workout/WorkoutCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sliders } from 'lucide-react';

const Workout = () => {
  const workouts: WorkoutProps[] = [
    {
      id: '1',
      title: 'Prise de masse - Haut du corps',
      description: 'Programme intense ciblant les pectoraux, épaules et triceps pour maximiser la croissance musculaire',
      duration: 45,
      level: 'intermédiaire',
      category: 'Musculation',
      exercises: 8,
    },
    {
      id: '2',
      title: 'Prise de masse - Bas du corps',
      description: 'Focus sur les quadriceps, ischio-jambiers et mollets pour un développement complet',
      duration: 50,
      level: 'intermédiaire',
      category: 'Musculation',
      exercises: 7,
    },
    {
      id: '3',
      title: 'Full Body Express',
      description: 'Entraînement complet du corps en circuit pour maximiser les résultats en peu de temps',
      duration: 30,
      level: 'débutant',
      category: 'Circuit training',
      exercises: 10,
    },
    {
      id: '4',
      title: 'HIIT Cardio Brûle-Graisses',
      description: 'Séance d\'intervalles à haute intensité pour une dépense calorique maximale',
      duration: 25,
      level: 'avancé',
      category: 'Cardio',
      exercises: 6,
    },
    {
      id: '5',
      title: 'Force - Dos & Biceps',
      description: 'Programme axé sur le développement de la force dans le haut du dos et les biceps',
      duration: 55,
      level: 'avancé',
      category: 'Musculation',
      exercises: 9,
    },
    {
      id: '6',
      title: 'Récupération Active',
      description: 'Séance légère pour favoriser la récupération musculaire et maintenir la mobilité',
      duration: 35,
      level: 'débutant',
      category: 'Mobilité',
      exercises: 8,
    },
    {
      id: '7',
      title: 'Core & Stabilité',
      description: 'Renforcez votre tronc et améliorez votre stabilité avec ces exercices ciblés',
      duration: 30,
      level: 'intermédiaire',
      category: 'Renforcement',
      exercises: 12,
    },
    {
      id: '8',
      title: 'Entraînement Fonctionnel',
      description: 'Améliorez votre condition physique globale avec ces mouvements fonctionnels',
      duration: 40,
      level: 'débutant',
      category: 'Fonctionnel',
      exercises: 10,
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Musculation</h1>
          <p className="text-muted-foreground">Découvrez des plans d'entraînement personnalisés adaptés à votre niveau et à vos objectifs</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input placeholder="Rechercher un entraînement..." className="pl-10" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Sliders size={16} className="mr-2" />
              Filtres
            </Button>
            <Button>Créer un plan</Button>
          </div>
        </div>

        <Tabs defaultValue="recommandé" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="recommandé">Recommandés</TabsTrigger>
            <TabsTrigger value="objectifs">Par objectif</TabsTrigger>
            <TabsTrigger value="niveau">Par niveau</TabsTrigger>
            <TabsTrigger value="mes-plans">Mes plans</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommandé" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {workouts.map((workout) => (
                <WorkoutCard key={workout.id} {...workout} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="objectifs" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {workouts.filter(w => w.category === "Musculation").map((workout) => (
                <WorkoutCard key={workout.id} {...workout} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="niveau" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {workouts.filter(w => w.level === "débutant").map((workout) => (
                <WorkoutCard key={workout.id} {...workout} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="mes-plans" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {workouts.slice(0, 3).map((workout) => (
                <WorkoutCard key={workout.id} {...workout} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Workout;
