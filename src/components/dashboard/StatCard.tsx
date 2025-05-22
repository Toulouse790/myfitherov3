
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
      "transition-all duration-300 hover:scale-105 hover:shadow-lg group",
      "border-2 hover:border-primary/20",
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn(
          "p-2 rounded-full transition-all duration-300 group-hover:scale-110",
          iconBackground
        )}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1 transition-colors duration-300 group-hover:text-primary">
          {value}
        </div>
        <p className="text-xs text-muted-foreground mb-2">{description}</p>
        
        {trend && (
          <div className="flex items-center space-x-1">
            {trend > 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
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
            className="mt-2 w-full h-8 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
