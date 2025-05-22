
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, Dumbbell, Medal, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

type WorkoutHeaderProps = {
  title: string;
  description: string;
  duration: number;
  exercisesCount: number;
  level: string;
  category: string;
};

const levelColorMap = {
  'débutant': 'bg-green-100 text-green-700 border-green-200',
  'intermédiaire': 'bg-blue-100 text-blue-700 border-blue-200',
  'avancé': 'bg-purple-100 text-purple-700 border-purple-200'
};

const WorkoutHeader = ({ 
  title, 
  description, 
  duration, 
  exercisesCount, 
  level, 
  category 
}: WorkoutHeaderProps) => {
  return (
    <div>
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-muted-foreground mt-1">{description}</p>
      
      <div className="flex flex-wrap gap-2 mt-4">
        <Badge variant="outline" className="flex items-center">
          <Clock size={14} className="mr-1" />
          {duration} min
        </Badge>
        <Badge variant="outline" className="flex items-center">
          <Dumbbell size={14} className="mr-1" />
          {exercisesCount} exercices
        </Badge>
        <Badge className={cn("flex items-center border", levelColorMap[level as keyof typeof levelColorMap])}>
          <Medal size={14} className="mr-1" />
          {level}
        </Badge>
        <Badge variant="outline" className="flex items-center">
          <Target size={14} className="mr-1" />
          {category}
        </Badge>
      </div>
    </div>
  );
};

export default WorkoutHeader;
