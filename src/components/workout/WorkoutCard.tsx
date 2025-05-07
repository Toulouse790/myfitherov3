
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Clock, Trophy, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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

const WorkoutCard: React.FC<WorkoutProps> = ({ title, description, duration, level, category, exercises, imageUrl }) => {
  return (
    <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className={cn("h-40 relative overflow-hidden", !imageUrl && "bg-gradient-to-r from-primary/20 to-secondary/20")}>
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Dumbbell size={64} className="text-primary/40" />
          </div>
        )}
        <div className={cn("absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium border", levelColors[level])}>
          {level}
        </div>
      </div>
      <CardHeader>
        <div className="text-sm font-medium text-muted-foreground">{category}</div>
        <CardTitle className="text-xl">{title}</CardTitle>
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
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" size="sm">
          <span>Démarrer</span>
          <ChevronRight size={16} className="ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WorkoutCard;
