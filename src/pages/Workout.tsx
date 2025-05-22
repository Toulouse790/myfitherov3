
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import WorkoutCard, { WorkoutProps } from '@/components/workout/WorkoutCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sliders, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const Workout = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterClick = () => {
    setShowFilters(!showFilters);
    toast.info(showFilters ? "Filtres masqués" : "Filtres affichés", {
      description: showFilters ? "Les filtres ont été masqués" : "Sélectionnez vos critères de filtrage"
    });
  };
  
  const handleCreatePlan = async () => {
    setIsLoading(true);
    try {
      // Simuler un chargement
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Plan d'entraînement créé", {
        description: "Votre nouveau plan d'entraînement est prêt"
      });
      // Ici, on pourrait rediriger vers une page de création de plan
    } catch (error) {
      toast.error("Erreur", {
        description: "Impossible de créer un nouveau plan"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrer les entraînements en fonction de la recherche
  const filteredWorkouts = workouts.filter(workout => 
    workout.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    workout.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <Input 
              placeholder="Rechercher un entraînement..." 
              className="pl-10"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleFilterClick}>
              <Sliders size={16} className="mr-2" />
              Filtres
            </Button>
            <Button onClick={handleCreatePlan} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                "Créer un plan"
              )}
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="p-4 border rounded-lg bg-muted/30 space-y-4">
            <h3 className="font-medium">Filtres avancés</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Durée</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="">Toutes les durées</option>
                  <option value="short">Court (&lt; 30 min)</option>
                  <option value="medium">Moyen (30-45 min)</option>
                  <option value="long">Long (&gt; 45 min)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Niveau</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="">Tous les niveaux</option>
                  <option value="débutant">Débutant</option>
                  <option value="intermédiaire">Intermédiaire</option>
                  <option value="avancé">Avancé</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Catégorie</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="">Toutes les catégories</option>
                  <option value="Musculation">Musculation</option>
                  <option value="Circuit training">Circuit training</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Mobilité">Mobilité</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <Tabs defaultValue="recommandé" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="recommandé">Recommandés</TabsTrigger>
            <TabsTrigger value="objectifs">Par objectif</TabsTrigger>
            <TabsTrigger value="niveau">Par niveau</TabsTrigger>
            <TabsTrigger value="mes-plans">Mes plans</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommandé" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredWorkouts.map((workout) => (
                <WorkoutCard key={workout.id} {...workout} />
              ))}
            </div>
            {filteredWorkouts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg font-medium">Aucun entraînement ne correspond à votre recherche</p>
                <p className="text-muted-foreground">Essayez avec d'autres termes ou filtres</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="objectifs" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredWorkouts.filter(w => w.category === "Musculation").map((workout) => (
                <WorkoutCard key={workout.id} {...workout} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="niveau" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredWorkouts.filter(w => w.level === "débutant").map((workout) => (
                <WorkoutCard key={workout.id} {...workout} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="mes-plans" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredWorkouts.slice(0, 3).map((workout) => (
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
