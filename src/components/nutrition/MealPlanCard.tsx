
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppleIcon, ChevronRight, Info, Heart, Share2, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/sonner';
import { useNavigate } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface MealPlanProps {
  id: string;
  title: string;
  description: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  mealsPerDay: number;
  category: string;
  imageUrl?: string;
}

const MealPlanCard: React.FC<MealPlanProps> = ({ 
  id, title, description, calories, macros, mealsPerDay, category, imageUrl 
}) => {
  const navigate = useNavigate();

  const handleViewPlan = () => {
    // Action concrète : voir le plan détaillé
    toast.success('Plan nutritionnel ouvert', {
      description: `${title} - ${calories} kcal`,
      action: {
        label: "Voir",
        onClick: () => navigate(`/nutrition/${id}`)
      }
    });
    
    // Rediriger vers la page du plan détaillé
    navigate(`/nutrition/${id}`);
  };

  const handleAddToFavorites = () => {
    // Ajouter aux favoris
    const favorites = JSON.parse(localStorage.getItem('nutrition_favorites') || '[]');
    if (!favorites.includes(id)) {
      favorites.push(id);
      localStorage.setItem('nutrition_favorites', JSON.stringify(favorites));
      toast.success('Plan ajouté aux favoris !', {
        description: title
      });
    } else {
      toast.info('Déjà dans vos favoris', {
        description: title
      });
    }
  };

  const handleDownloadPlan = () => {
    // Télécharger le plan (simulation)
    toast.success('Téléchargement démarré', {
      description: `Plan ${title} en cours de téléchargement...`
    });
    
    // Ici on pourrait générer un PDF ou rediriger vers une API
    // Pour le moment, on simule le téléchargement
    setTimeout(() => {
      toast.success('Plan téléchargé !', {
        description: 'Fichier sauvegardé dans vos téléchargements'
      });
    }, 2000);
  };

  const handleShare = () => {
    // Partager le plan
    if (navigator.share) {
      navigator.share({
        title: title,
        text: description,
        url: window.location.origin + `/nutrition/${id}`
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + `/nutrition/${id}`);
      toast.success('Lien copié !', {
        description: 'Vous pouvez maintenant partager ce plan'
      });
    }
  };

  const handleStartPlan = () => {
    // Démarrer le plan (l'adopter)
    toast.success('Plan nutritionnel adopté !', {
      description: `${title} est maintenant votre plan actif`,
      action: {
        label: "Voir mes repas",
        onClick: () => navigate('/nutrition/my-meals')
      }
    });
    
    // Sauvegarder comme plan actif
    localStorage.setItem('active_meal_plan', id);
  };

  return (
    <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-lg group">
      <div className={cn("h-40 relative overflow-hidden", !imageUrl && "bg-gradient-to-r from-fitness-green/20 to-fitness-teal/20")}>
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <AppleIcon size={64} className="text-fitness-green/40 group-hover:text-fitness-green/60 transition-colors" />
          </div>
        )}
        
        {/* Badge catégorie */}
        <div className="absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-700 border border-teal-200">
          {category}
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
            onClick={handleDownloadPlan}
            title="Télécharger le plan"
          >
            <Download size={14} />
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
        <CardTitle className="text-xl group-hover:text-primary transition-colors cursor-pointer" onClick={handleViewPlan}>
          {title}
        </CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex justify-between text-sm mb-4">
          <div>
            <div className="text-muted-foreground">Calories</div>
            <div className="font-medium">{calories} kcal</div>
          </div>
          <div>
            <div className="text-muted-foreground">Repas/jour</div>
            <div className="font-medium">{mealsPerDay}</div>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground">Durée</div>
            <div className="font-medium">7 jours</div>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Macronutriments</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Info size={12} />
                    <span className="sr-only">Info</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1">
                    <p>Protéines: {macros.protein}%</p>
                    <p>Glucides: {macros.carbs}%</p>
                    <p>Lipides: {macros.fat}%</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex space-x-1 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-fitness-teal" 
              style={{ width: `${macros.protein}%` }}
              title={`Protéines: ${macros.protein}%`}
            />
            <div 
              className="bg-fitness-blue" 
              style={{ width: `${macros.carbs}%` }}
              title={`Glucides: ${macros.carbs}%`}
            />
            <div 
              className="bg-fitness-orange" 
              style={{ width: `${macros.fat}%` }}
              title={`Lipides: ${macros.fat}%`}
            />
          </div>
          <div className="flex justify-between text-xs mt-2 text-muted-foreground">
            <span>P: {macros.protein}%</span>
            <span>G: {macros.carbs}%</span>
            <span>L: {macros.fat}%</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="gap-2">
        <Button 
          className="flex-1" 
          size="sm"
          onClick={handleStartPlan}
        >
          <span>Adopter ce plan</span>
          <ChevronRight size={16} className="ml-2" />
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleViewPlan}
          className="px-3"
        >
          Détails
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MealPlanCard;
