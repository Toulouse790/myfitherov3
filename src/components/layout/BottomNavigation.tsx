
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
    color: 'fitness-primary',
    gradient: 'bg-gradient-primary'
  },
  {
    id: 'sport',
    label: 'Sport',
    icon: Dumbbell,
    path: '/sport-tracker',
    color: 'fitness-sport',
    gradient: 'bg-gradient-sport'
  },
  {
    id: 'nutrition',
    label: 'Nutri',
    icon: Apple,
    path: '/nutrition',
    color: 'fitness-nutrition',
    gradient: 'bg-gradient-nutrition'
  },
  {
    id: 'hydration',
    label: 'Hydra',
    icon: Droplet,
    path: '/hydration',
    color: 'fitness-hydration',
    gradient: 'bg-gradient-hydration'
  },
  {
    id: 'sleep',
    label: 'Sleep',
    icon: Moon,
    path: '/sleep',
    color: 'fitness-sleep',
    gradient: 'bg-gradient-sleep'
  }
];

export function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    // Feedback tactile pour mobile
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200/50 safe-area-pb z-50 shadow-lg">
      <div className="flex items-center justify-around px-2 py-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "flex flex-col items-center justify-center min-w-0 flex-1 px-3 py-3 text-xs rounded-2xl transition-all duration-300 min-h-[64px] relative overflow-hidden",
                "active:scale-95", // Feedback tactile
                active 
                  ? `${item.gradient} text-white shadow-lg scale-105` 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
              )}
            >
              {active && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              )}
              
              <div className="relative mb-1 z-10">
                <Icon 
                  size={22} 
                  className={cn(
                    "transition-all duration-300",
                    active ? "scale-110 drop-shadow-sm" : "scale-100"
                  )} 
                />
                {active && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-pulse" />
                )}
              </div>
              
              <span className={cn(
                "font-medium transition-all duration-300 text-xs z-10 relative",
                active ? "text-white font-semibold" : "text-gray-600"
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
