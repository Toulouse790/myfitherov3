
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/sonner';
import { ArrowLeft, Play, Heart, Share2 } from 'lucide-react';
import { useWorkoutData } from '@/hooks/useWorkoutData';
import WorkoutHeader from '@/components/workout/detail/WorkoutHeader';
import ExerciseList from '@/components/workout/detail/ExerciseList';
import InstructionsTab from '@/components/workout/detail/InstructionsTab';
import HistoryTab from '@/components/workout/detail/HistoryTab';

const WorkoutDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("exercices");
  const [isPreviewMode, setIsPreviewMode] = useState(location.pathname.includes('/preview'));
  
  // Get workout data
  const { workout } = useWorkoutData(id);
  
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
    // Rediriger vers la page d'entraînement en cours
    navigate(`/workout/${id}/session`);
    toast.success("Entraînement démarré !", {
      description: `${workout.title} - ${workout.duration} minutes`,
    });
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
        {/* Navigation and action buttons */}
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
        <WorkoutHeader 
          title={workout.title}
          description={workout.description}
          duration={workout.duration}
          exercisesCount={workout.exercises.length}
          level={workout.level}
          category={workout.category}
        />

        <Tabs defaultValue="exercices" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="exercices">Exercices</TabsTrigger>
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
            <TabsTrigger value="historique">Historique</TabsTrigger>
          </TabsList>
          
          <TabsContent value="exercices" className="space-y-4 mt-6">
            <ExerciseList 
              exercises={workout.exercises} 
              isPreviewMode={isPreviewMode} 
              onStart={handleStartWorkout} 
            />
          </TabsContent>
          
          <TabsContent value="instructions" className="space-y-4 mt-6">
            <InstructionsTab />
          </TabsContent>
          
          <TabsContent value="historique" className="space-y-4 mt-6">
            <HistoryTab onStartWorkout={() => setActiveTab("exercices")} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default WorkoutDetail;
