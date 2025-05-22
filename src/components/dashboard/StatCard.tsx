
import { cn } from "@/lib/utils";
import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  className?: string;
  iconBackground?: string;
  onClick?: () => void;
  actionLabel?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  trendLabel,
  className,
  iconBackground,
  onClick,
  actionLabel,
}) => {
  const isClickable = !!onClick;

  return (
    <div 
      className={cn(
        "neumorphic-card dark:neumorphic-card-dark p-6 relative group",
        isClickable && "cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]",
        className
      )}
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      } : undefined}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className={cn(
            "text-sm font-medium text-muted-foreground",
            isClickable && "group-hover:text-primary transition-colors"
          )}>
            {title}
          </h3>
          <div className="mt-1 flex items-baseline">
            <p className={cn(
              "text-2xl font-semibold",
              isClickable && "group-hover:text-primary transition-colors"
            )}>
              {value}
            </p>
            {trend !== undefined && (
              <span
                className={cn(
                  "ml-2 text-xs font-medium",
                  trend >= 0 ? "text-green-600" : "text-red-600"
                )}
              >
                {trend >= 0 ? "+" : ""}{trend}%
                {trendLabel && <span className="ml-1 text-muted-foreground">{trendLabel}</span>}
              </span>
            )}
          </div>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {description}
            </p>
          )}
          
          {/* Action label visible au hover si cliquable */}
          {isClickable && actionLabel && (
            <p className="mt-2 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity font-medium">
              {actionLabel} →
            </p>
          )}
        </div>
        
        {icon && (
          <div className={cn(
            "rounded-full p-2 transition-all duration-300",
            iconBackground || "bg-primary/10",
            isClickable && "group-hover:scale-110"
          )}>
            {icon}
          </div>
        )}
      </div>
      
      {/* Indicateur visuel pour les cartes cliquables */}
      {isClickable && (
        <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-primary/20 transition-colors pointer-events-none" />
      )}
    </div>
  );
};

export default StatCard;
