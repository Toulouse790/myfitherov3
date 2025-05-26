
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Dumbbell, AppleIcon, Moon, MessageSquare, BarChart3, User, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

const Navigation = () => {
  const location = useLocation();

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

  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.path}>
          <SidebarMenuButton asChild>
            <Link 
              to={item.path}
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-md transition-colors",
                location.pathname === item.path 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted"
              )}
            >
              <item.icon size={20} />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export default Navigation;
