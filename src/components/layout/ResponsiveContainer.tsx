
import React from 'react';
import { cn } from '@/lib/utils';
import { useOptimizedPerformance } from '@/hooks/useOptimizedPerformance';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className,
  maxWidth = 'lg',
  padding = 'md'
}) => {
  const { metrics } = useOptimizedPerformance();

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md', 
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-full'
  };

  const paddingClasses = {
    none: '',
    sm: 'px-2 py-2',
    md: 'px-4 py-4',
    lg: 'px-6 py-6'
  };

  return (
    <div 
      className={cn(
        "mx-auto w-full transition-all duration-300",
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        // Optimisation basée sur la connexion
        !metrics.isOnline && "opacity-90",
        className
      )}
    >
      {children}
    </div>
  );
};
