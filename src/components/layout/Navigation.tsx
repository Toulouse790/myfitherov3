
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Dumbbell, AppleIcon, Moon, MessageSquare, BarChart3, User, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useSmartNavigation } from '@/hooks/useSmartNavigation';

const Navigation = () => {
  const location = useLocation();
  const { smartNavigate, isModulePreloaded } = useSmartNavigation();

  const menuItems = [
    { title: "Accueil", path: "/", icon: Home },
    { title: "Musculation", path: "/workout", icon: Dumbbell },
    { title: "Nutrition", path: "/nutrition", icon: AppleIcon },
    { title: "Sommeil", path: "/sleep", icon: Moon },
    { title: "Coach IA", path: "/coach", icon: MessageSquare },
    { title: "Tableau de bord", path: "/dashboard", icon: BarChart3 },
    { title: "Profil", path: "/profile", icon: User },
    { title: "Paramètres", path: "/settings", icon: Settings },
  ];

  const handleNavigation = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    smartNavigate(path);
  };

  return (
    <SidebarMenu>
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path;
        const moduleName = item.path.split('/')[1];
        const isPreloaded = moduleName ? isModulePreloaded(moduleName) : true;
        
        return (
          <SidebarMenuItem key={item.path}>
            <SidebarMenuButton asChild>
              <Link 
                to={item.path}
                onClick={(e) => handleNavigation(item.path, e)}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md transition-colors relative",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-muted"
                )}
              >
                <item.icon size={20} />
                <span>{item.title}</span>
                {/* Indicateur visuel pour les modules préchargés */}
                {isPreloaded && moduleName && (
                  <div 
                    className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"
                    title="Module préchargé - Navigation instantanée"
                  />
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
};

export default Navigation;
