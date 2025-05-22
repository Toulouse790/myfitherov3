
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';
import { ArrowLeft, Play, Clock, Dumbbell, Target, Medal, ChevronRight, Check, BarChart3, Share2, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data - in a real app this would come from an API
const workoutData = {
  '1': {
    id: '1',
    title: 'Prise de masse - Haut du corps',
    description: 'Programme intense ciblant les pectoraux, épaules et triceps pour maximiser la croissance musculaire',
    duration: 45,
    level: 'intermédiaire',
    category: 'Musculation',
    exercises: [
      { id: '1', name: 'Développé couché', sets: 4, reps: '8-10', rest: 90, weight: '70% 1RM' },
      { id: '2', name: 'Développé incliné haltères', sets: 3, reps: '10-12', rest: 75, weight: '60% 1RM' },
      { id: '3', name: 'Élévations latérales', sets: 3, reps: '12-15', rest: 60, weight: 'Moyen' },
      { id: '4', name: 'Dips', sets: 3, reps: '8-12', rest: 90, weight: 'Poids du corps' },
      { id: '5', name: 'Pushdown triceps', sets: 3, reps: '12-15', rest: 60, weight: 'Moyen' },
      { id: '6', name: 'Curl biceps', sets: 3, reps: '10-12', rest: 60, weight: '60% 1RM' },
      { id: '7', name: 'Planche', sets: 3, reps: '30-60s', rest: 45, weight: 'Poids du corps' },
      { id: '8', name: 'Gainage latéral', sets: 2, reps: '30s/côté', rest: 30, weight: 'Poids du corps' },
    ]
  },
  '2': {
    id: '2',
    title: 'Prise de masse - Bas du corps',
    description: 'Focus sur les quadriceps, ischio-jambiers et mollets pour un développement complet',
    duration: 50,
    level: 'intermédiaire',
    category: 'Musculation',
    exercises: [
      { id: '1', name: 'Squats', sets: 4, reps: '8-10', rest: 120, weight: '75% 1RM' },
      { id: '2', name: 'Leg press', sets: 3, reps: '10-12', rest: 90, weight: '70% 1RM' },
      { id: '3', name: 'Extensions de jambes', sets: 3, reps: '12-15', rest: 60, weight: 'Moyen' },
      { id: '4', name: 'Leg curl', sets: 3, reps: '12-15', rest: 60, weight: 'Moyen' },
      { id: '5', name: 'Fentes', sets: 3, reps: '10/jambe', rest: 60, weight: 'Moyen' },
      { id: '6', name: 'Mollets debout', sets: 4, reps: '15-20', rest: 45, weight: 'Moyen-lourd' },
      { id: '7', name: 'Deadlift roumain', sets: 3, reps: '10-12', rest: 90, weight: '65% 1RM' },
    ]
  },
  // Add more workout data here for other IDs
};

const levelColorMap = {
  'débutant': 'bg-green-100 text-green-700 border-green-200',
  'intermédiaire': 'bg-blue-100 text-blue-700 border-blue-200',
  'avancé': 'bg-purple-100 text-purple-700 border-purple-200'
};

const WorkoutDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("exercices");
  const [isPreviewMode, setIsPreviewMode] = useState(location.pathname.includes('/preview'));
  
  // Get workout data
  const workout = workoutData[id as keyof typeof workoutData];
  
  useEffect(() => {
    // Check if in preview mode based on URL
    setIsPreviewMode(location.pathname.includes('/preview'));
  }, [location]);
  
  if (!workout) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Entraînement non trouvé</h2>
          <p className="text-muted-foreground mt-2">L'entraînement que vous recherchez n'existe pas.</p>
          <Button className="mt-6" onClick={() => navigate('/workout')}>
            Retour aux entraînements
          </Button>
        </div>
      </MainLayout>
    );
  }

  const handleStartWorkout = () => {
    toast.success("Entraînement démarré !", {
      description: `${workout.title} - ${workout.duration} minutes`,
    });
    // In a real app, this would start a workout session
  };
  
  const handleSaveToFavorites = () => {
    toast.success("Ajouté aux favoris !", {
      description: workout.title,
    });
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Lien copié !", {
      description: "Vous pouvez maintenant partager cet entraînement"
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Retour et action buttons */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/workout')} className="pl-0">
            <ArrowLeft size={16} className="mr-2" />
            Retour aux entraînements
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 size={16} className="mr-2" />
              Partager
            </Button>
            <Button variant="outline" size="sm" onClick={handleSaveToFavorites}>
              <Heart size={16} className="mr-2" />
              Favoris
            </Button>
            {!isPreviewMode && (
              <Button size="sm" onClick={handleStartWorkout}>
                <Play size={16} className="mr-2" />
                Démarrer
              </Button>
            )}
            {isPreviewMode && (
              <Button size="sm" onClick={() => navigate(`/workout/${id}`)}>
                Voir tout
              </Button>
            )}
          </div>
        </div>

        {/* Workout header */}
        <div>
          <h1 className="text-3xl font-bold">{workout.title}</h1>
          <p className="text-muted-foreground mt-1">{workout.description}</p>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="outline" className="flex items-center">
              <Clock size={14} className="mr-1" />
              {workout.duration} min
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <Dumbbell size={14} className="mr-1" />
              {workout.exercises.length} exercices
            </Badge>
            <Badge className={cn("flex items-center border", levelColorMap[workout.level as keyof typeof levelColorMap])}>
              <Medal size={14} className="mr-1" />
              {workout.level}
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <Target size={14} className="mr-1" />
              {workout.category}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="exercices" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="exercices">Exercices</TabsTrigger>
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
            <TabsTrigger value="historique">Historique</TabsTrigger>
          </TabsList>
          
          <TabsContent value="exercices" className="space-y-4 mt-6">
            {workout.exercises.map((exercise, index) => (
              <Card key={exercise.id} className="overflow-hidden">
                <CardHeader className="bg-muted/30 py-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center bg-primary/10 w-8 h-8 rounded-full mr-3">
                        <span className="font-medium text-sm">{index + 1}</span>
                      </div>
                      <CardTitle className="text-lg">{exercise.name}</CardTitle>
                    </div>
                    <ChevronRight size={18} className="text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Séries</p>
                      <p className="font-medium">{exercise.sets}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Répétitions</p>
                      <p className="font-medium">{exercise.reps}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Repos</p>
                      <p className="font-medium">{exercise.rest}s</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Charge</p>
                      <p className="font-medium">{exercise.weight}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {!isPreviewMode && (
              <Button onClick={handleStartWorkout} className="w-full mt-6">
                <Play size={16} className="mr-2" />
                Démarrer l'entraînement
              </Button>
            )}
          </TabsContent>
          
          <TabsContent value="instructions" className="space-y-4 mt-6">
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
          </TabsContent>
          
          <TabsContent value="historique" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Historique des performances</CardTitle>
                <CardDescription>Suivez vos progrès sur cet entraînement</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <BarChart3 size={48} className="mx-auto text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">Pas encore d'historique disponible</p>
                    <p className="text-sm text-muted-foreground">Commencez cet entraînement pour voir vos progrès</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline" size="sm" onClick={() => setActiveTab("exercices")}>
                  Démarrer un entraînement
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default WorkoutDetail;
