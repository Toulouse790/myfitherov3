
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, Dumbbell, Apple, Droplet, Moon } from 'lucide-react';

const navigationItems = [
  {
    id: 'home',
    label: 'Accueil',
    icon: Home,
    path: '/dashboard',
    emoji: '🏠'
  },
  {
    id: 'sport',
    label: 'Sport',
    icon: Dumbbell,
    path: '/sport-tracker',
    emoji: '🏃‍♂️'
  },
  {
    id: 'nutrition',
    label: 'Nutri',
    icon: Apple,
    path: '/nutrition',
    emoji: '🥗'
  },
  {
    id: 'hydration',
    label: 'Hydra',
    icon: Droplet,
    path: '/hydration',
    emoji: '💧'
  },
  {
    id: 'sleep',
    label: 'Sleep',
    icon: Moon,
    path: '/sleep',
    emoji: '😴'
  }
];

export function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb z-50">
      <div className="flex items-center justify-around px-2 py-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2 text-xs rounded-lg transition-all duration-200",
                active 
                  ? "text-primary bg-primary/10" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <div className="relative mb-1">
                <Icon 
                  size={20} 
                  className={cn(
                    "transition-all duration-200",
                    active ? "scale-110" : "scale-100"
                  )} 
                />
                {active && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </div>
              <span className={cn(
                "font-medium transition-all duration-200",
                active ? "text-primary" : "text-gray-600"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
