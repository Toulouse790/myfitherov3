
import React from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader } from "@/components/ui/sidebar";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Link, useLocation } from 'react-router-dom';
import { Home, Dumbbell, AppleIcon, Moon, MessageSquare, BarChart3, User, Settings } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/layout/ThemeToggle";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
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
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar className="h-screen border-r">
        <SidebarHeader className="p-4">
          <div className="flex items-center space-x-2">
            <div className="rounded-full bg-primary p-1 w-8 h-8 flex items-center justify-center">
              <span className="text-white font-bold">MF</span>
            </div>
            <h1 className="text-xl font-bold">MyFitHero</h1>
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarGroup>
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
          </SidebarGroup>
        </SidebarContent>
        
        <SidebarFooter className="p-4 border-t">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">MyFitHero v1.0</p>
            <ThemeToggle />
          </div>
        </SidebarFooter>
      </Sidebar>
      
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
