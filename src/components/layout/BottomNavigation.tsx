
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
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    id: 'sport',
    label: 'Sport',
    icon: Dumbbell,
    path: '/sport-tracker',
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    id: 'nutrition',
    label: 'Nutri',
    icon: Apple,
    path: '/nutrition',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    id: 'hydration',
    label: 'Hydra',
    icon: Droplet,
    path: '/hydration',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50'
  },
  {
    id: 'sleep',
    label: 'Sleep',
    icon: Moon,
    path: '/sleep',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  }
];

export function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    console.log('Navigation vers:', path);
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
      <div className="flex items-center justify-around px-2 py-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "flex flex-col items-center justify-center min-w-0 flex-1 px-3 py-3 text-xs rounded-xl transition-all duration-200 min-h-[64px]",
                "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500", 
                active 
                  ? `${item.bgColor} ${item.color} scale-105` 
                  : "text-gray-600 hover:text-gray-900"
              )}
              aria-label={item.label}
            >
              <div className="mb-1">
                <Icon 
                  size={22} 
                  className={cn(
                    "transition-all duration-200",
                    active ? "scale-110" : "scale-100"
                  )} 
                />
              </div>
              
              <span className={cn(
                "font-medium transition-all duration-200 text-xs",
                active ? "font-semibold" : ""
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
