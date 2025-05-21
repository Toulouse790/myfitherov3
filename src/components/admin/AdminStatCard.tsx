
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminStatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  trendDirection?: 'up' | 'down';
  description?: string;
  className?: string;
}

const AdminStatCard: React.FC<AdminStatCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendDirection,
  description,
  className,
}) => {
  // Détermine la direction de tendance en fonction de la valeur si non spécifiée
  const direction = trendDirection || (trend && trend >= 0 ? 'up' : 'down');

  // Détermine la couleur de tendance
  const getTrendColor = () => {
    if (direction === 'down') {
      return trend && trend >= 0 ? 'text-red-500' : 'text-green-500';
    }
    return trend && trend >= 0 ? 'text-green-500' : 'text-red-500';
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-bold">{value}</p>
              {trend !== undefined && (
                <div className={`flex items-center text-xs ${getTrendColor()}`}>
                  {direction === 'up' ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(trend).toFixed(1)}%
                </div>
              )}
            </div>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          </div>
          <div className="bg-primary/10 rounded-full p-2 h-fit">
            {React.cloneElement(icon as React.ReactElement, { 
              className: cn("h-5 w-5", (icon as React.ReactElement).props.className)
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminStatCard;
