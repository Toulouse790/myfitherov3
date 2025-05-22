
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Medal, Trophy, Target, Flame, Dumbbell, Clock, Calendar, Zap, Smile, Heart, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const achievementCategories = [
  {
    name: 'Constance',
    icon: Calendar,
    color: 'text-blue-500'
  },
  {
    name: 'Performance',
    icon: Zap,
    color: 'text-yellow-500'
  },
  {
    name: 'Nutrition',
    icon: Flame,
    color: 'text-green-500'
  },
  {
    name: 'Sommeil',
    icon: Heart,
    color: 'text-purple-500'
  }
];

// Sample achievements data
const achievements = [
  {
    id: '1',
    title: '3 séances consécutives',
    description: 'Vous avez complété 3 séances d\'entraînement consécutives',
    category: 'Constance',
    date: '2023-05-20',
    icon: Medal,
    color: 'bg-blue-50 border-blue-200',
    textColor: 'text-blue-600',
    iconColor: 'text-blue-500',
    unlocked: true
  },
  {
    id: '2',
    title: 'Premier record personnel',
    description: 'Vous avez établi votre premier record personnel',
    category: 'Performance',
    date: '2023-05-15',
    icon: Trophy,
    color: 'bg-yellow-50 border-yellow-200',
    textColor: 'text-yellow-600',
    iconColor: 'text-yellow-500',
    unlocked: true
  },
  {
    id: '3',
    title: '5 jours d\'objectifs nutritionnels atteints',
    description: 'Vous avez atteint vos objectifs nutritionnels pendant 5 jours consécutifs',
    category: 'Nutrition',
    date: '2023-05-12',
    icon: Star,
    color: 'bg-green-50 border-green-200',
    textColor: 'text-green-600',
    iconColor: 'text-green-500',
    unlocked: true
  },
  {
    id: '4',
    title: 'Premier marathon',
    description: 'Vous avez terminé votre premier marathon',
    category: 'Performance',
    date: null,
    icon: Target,
    color: 'bg-gray-100 border-gray-200',
    textColor: 'text-gray-500',
    iconColor: 'text-gray-400',
    unlocked: false
  },
  {
    id: '5',
    title: 'Semaine parfaite de sommeil',
    description: 'Vous avez atteint vos objectifs de sommeil pendant 7 jours consécutifs',
    category: 'Sommeil',
    date: null,
    icon: Heart,
    color: 'bg-gray-100 border-gray-200',
    textColor: 'text-gray-500',
    iconColor: 'text-gray-400',
    unlocked: false
  },
  {
    id: '6',
    title: '10 séances en un mois',
    description: 'Vous avez complété 10 séances d\'entraînement en un mois',
    category: 'Constance',
    date: '2023-04-30',
    icon: Calendar,
    color: 'bg-blue-50 border-blue-200',
    textColor: 'text-blue-600',
    iconColor: 'text-blue-500',
    unlocked: true
  },
  {
    id: '7',
    title: 'Première séance HIIT',
    description: 'Vous avez complété votre première séance d\'entraînement HIIT',
    category: 'Performance',
    date: '2023-04-25',
    icon: Flame,
    color: 'bg-yellow-50 border-yellow-200',
    textColor: 'text-yellow-600',
    iconColor: 'text-yellow-500',
    unlocked: true
  },
  {
    id: '8',
    title: '30 jours consécutifs',
    description: 'Vous avez utilisé l\'application pendant 30 jours consécutifs',
    category: 'Constance',
    date: null,
    icon: Award,
    color: 'bg-gray-100 border-gray-200',
    textColor: 'text-gray-500',
    iconColor: 'text-gray-400',
    unlocked: false
  }
];

const Achievements = () => {
  // Count unlocked achievements
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const totalAchievements = achievements.length;
  const progress = Math.round((unlockedAchievements / totalAchievements) * 100);
  
  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Succès</h1>
          <p className="text-muted-foreground">Suivez votre progression et déverrouillez des succès</p>
        </div>

        {/* Progression card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Progression</CardTitle>
            <CardDescription>
              Vous avez débloqué {unlockedAchievements} succès sur {totalAchievements}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{progress}%</span>
                <span className="text-muted-foreground">{unlockedAchievements}/{totalAchievements}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievement categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievementCategories.map((category) => (
            <Card key={category.name} className="bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center py-6">
                <category.icon className={cn("h-10 w-10 mb-3", category.color)} />
                <h3 className="font-medium text-center">{category.name}</h3>
                <p className="text-sm text-muted-foreground text-center">
                  {achievements.filter(a => a.category === category.name && a.unlocked).length} / {achievements.filter(a => a.category === category.name).length}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Achievements list */}
        <h2 className="text-xl font-semibold mt-6">Tous les succès</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <Card 
              key={achievement.id} 
              className={cn(
                "border overflow-hidden", 
                achievement.color
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "font-normal", 
                      achievement.textColor
                    )}
                  >
                    {achievement.category}
                  </Badge>
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center", 
                    achievement.unlocked ? "bg-white/80" : "bg-gray-200"
                  )}>
                    <achievement.icon className={cn(
                      "h-5 w-5", 
                      achievement.iconColor
                    )} />
                  </div>
                </div>
                
                <h3 className={cn(
                  "font-semibold text-lg mb-1", 
                  achievement.unlocked ? achievement.textColor : "text-gray-500"
                )}>
                  {achievement.title}
                </h3>
                
                <p className={cn(
                  "text-sm", 
                  achievement.unlocked ? "text-muted-foreground" : "text-gray-400"
                )}>
                  {achievement.description}
                </p>
                
                {achievement.unlocked && achievement.date && (
                  <p className="text-xs mt-3 font-medium">
                    Débloqué le {new Date(achievement.date).toLocaleDateString('fr-FR')}
                  </p>
                )}
                
                {!achievement.unlocked && (
                  <p className="text-xs mt-3 text-gray-400 font-medium">
                    Non débloqué
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Achievements;
