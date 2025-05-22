
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
}) => {
  return (
    <div 
      className={cn("neumorphic-card dark:neumorphic-card-dark p-6", className)} 
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-semibold">{value}</p>
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
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {icon && (
          <div className={cn("rounded-full p-2", iconBackground || "bg-primary/10")}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
