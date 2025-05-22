
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Clock, Trophy, ChevronRight, Heart, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/sonner';
import { useNavigate } from 'react-router-dom';

export interface WorkoutProps {
  id: string;
  title: string;
  description: string;
  duration: number;
  level: 'débutant' | 'intermédiaire' | 'avancé';
  category: string;
  exercises: number;
  imageUrl?: string;
}

const levelColors = {
  débutant: 'bg-green-100 text-green-700 border-green-200',
  intermédiaire: 'bg-blue-100 text-blue-700 border-blue-200',
  avancé: 'bg-purple-100 text-purple-700 border-purple-200'
};

const WorkoutCard: React.FC<WorkoutProps> = ({ 
  id, title, description, duration, level, category, exercises, imageUrl 
}) => {
  const navigate = useNavigate();

  const handleStartWorkout = () => {
    // Action concrète : démarrer l'entraînement
    toast.success('Entraînement démarré !', {
      description: `${title} - ${duration} minutes`,
      action: {
        label: "Voir",
        onClick: () => navigate(`/workout/${id}`)
      }
    });
    
    // Rediriger vers la page d'entraînement détaillée
    navigate(`/workout/${id}`);
  };

  const handleAddToFavorites = () => {
    // Ajouter aux favoris (localStorage pour le moment)
    const favorites = JSON.parse(localStorage.getItem('workout_favorites') || '[]');
    if (!favorites.includes(id)) {
      favorites.push(id);
      localStorage.setItem('workout_favorites', JSON.stringify(favorites));
      toast.success('Ajouté aux favoris !', {
        description: title
      });
    } else {
      toast.info('Déjà dans vos favoris', {
        description: title
      });
    }
  };

  const handleShare = () => {
    // Partager l'entraînement
    if (navigator.share) {
      navigator.share({
        title: title,
        text: description,
        url: window.location.origin + `/workout/${id}`
      });
    } else {
      // Fallback : copier le lien
      navigator.clipboard.writeText(window.location.origin + `/workout/${id}`);
      toast.success('Lien copié !', {
        description: 'Vous pouvez maintenant partager cet entraînement'
      });
    }
  };

  return (
    <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-lg group">
      <div className={cn("h-40 relative overflow-hidden", !imageUrl && "bg-gradient-to-r from-primary/20 to-secondary/20")}>
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Dumbbell size={64} className="text-primary/40 group-hover:text-primary/60 transition-colors" />
          </div>
        )}
        
        {/* Badge niveau */}
        <div className={cn("absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium border", levelColors[level])}>
          {level}
        </div>

        {/* Actions rapides au hover */}
        <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 bg-white/90 hover:bg-white"
            onClick={handleAddToFavorites}
            title="Ajouter aux favoris"
          >
            <Heart size={14} />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 bg-white/90 hover:bg-white"
            onClick={handleShare}
            title="Partager"
          >
            <Share2 size={14} />
          </Button>
        </div>
      </div>

      <CardHeader>
        <div className="text-sm font-medium text-muted-foreground">{category}</div>
        <CardTitle className="text-xl group-hover:text-primary transition-colors cursor-pointer" onClick={handleStartWorkout}>
          {title}
        </CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex space-x-4 text-sm">
          <div className="flex items-center">
            <Clock size={16} className="mr-1 text-muted-foreground" />
            <span>{duration} min</span>
          </div>
          <div className="flex items-center">
            <Dumbbell size={16} className="mr-1 text-muted-foreground" />
            <span>{exercises} exercices</span>
          </div>
          <div className="flex items-center">
            <Trophy size={16} className="mr-1 text-muted-foreground" />
            <span className="capitalize">{level}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="gap-2">
        <Button 
          className="flex-1" 
          size="sm"
          onClick={handleStartWorkout}
        >
          <span>Démarrer</span>
          <ChevronRight size={16} className="ml-2" />
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate(`/workout/${id}/preview`)}
          className="px-3"
        >
          Aperçu
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WorkoutCard;
