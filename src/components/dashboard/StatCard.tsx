
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  iconBackground?: string;
  onClick?: () => void;
  actionLabel?: string;
  className?: string;
}

const StatCard = ({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  trendLabel,
  iconBackground = "bg-primary/10",
  onClick,
  actionLabel,
  className 
}: StatCardProps) => {
  return (
    <Card className={cn(
      "transition-all duration-300 hover:scale-102 hover:shadow-md group",
      "border hover:border-primary/20 h-[140px]", // Hauteur fixe réduite
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 p-3"> {/* Padding réduit */}
        <CardTitle className="text-xs font-medium text-muted-foreground leading-tight">
          {title}
        </CardTitle>
        <div className={cn(
          "p-1.5 rounded-full transition-all duration-300 group-hover:scale-105", // Taille d'icône réduite
          iconBackground
        )}>
          <div className="w-3 h-3"> {/* Icône plus petite */}
            {React.cloneElement(icon as React.ReactElement, { size: 12 })}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0"> {/* Padding réduit */}
        <div className="text-lg font-bold mb-0.5 transition-colors duration-300 group-hover:text-primary"> {/* Taille de police réduite */}
          {value}
        </div>
        <p className="text-xs text-muted-foreground mb-1 leading-tight">{description}</p> {/* Texte plus petit */}
        
        {trend && (
          <div className="flex items-center space-x-1 mb-1">
            {trend > 0 ? (
              <TrendingUp className="w-3 h-3 text-green-500" />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-500" />
            )}
            <span className={cn(
              "text-xs font-medium",
              trend > 0 ? "text-green-500" : "text-red-500"
            )}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
            {trendLabel && (
              <span className="text-xs text-muted-foreground">{trendLabel}</span>
            )}
          </div>
        )}
        
        {onClick && actionLabel && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClick}
            className="mt-1 w-full h-6 text-xs py-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
