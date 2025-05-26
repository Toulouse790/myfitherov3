
import React from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import ThemeToggle from "@/components/layout/ThemeToggle";
import Navigation from "@/components/layout/Navigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
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
              <Navigation />
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
    </SidebarProvider>
  );
};

export default MainLayout;
