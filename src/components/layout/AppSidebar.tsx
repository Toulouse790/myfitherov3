
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Home,
  Dumbbell,
  Apple,
  Scan,
  Moon,
  Trophy,
  MessageSquare,
  Settings,
  Activity
} from "lucide-react"

interface AppSidebarProps {
  children: React.ReactNode;
}

export function AppSidebar({ children }: AppSidebarProps) {
  const { user, signOut } = useAuth();

  // Extract user display name and avatar from user metadata or email
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const avatarUrl = user?.user_metadata?.avatar_url;
  const userInitials = displayName.charAt(0).toUpperCase();

  return (
    <Sidebar>
      <Sheet>
        <SheetTrigger asChild>
          <SidebarTrigger aria-label="Ouvrir la navigation">
            <Menu className="h-6 w-6" />
          </SidebarTrigger>
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:w-64 border-r">
          <SheetHeader className="space-y-2.5">
            <SheetTitle>Navigation</SheetTitle>
            <SheetDescription>
              Accéder rapidement à toutes les sections de l'application.
            </SheetDescription>
          </SheetHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu principal</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/dashboard">
                      <Home className="h-4 w-4" />
                      <span>Tableau de bord</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/workout">
                      <Dumbbell className="h-4 w-4" />
                      <span>Entraînements</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/sport-tracker">
                      <Activity className="h-4 w-4" />
                      <span>Sport Tracker</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/nutrition">
                      <Apple className="h-4 w-4" />
                      <span>Nutrition</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/nutrition-hub">
                      <Scan className="h-4 w-4" />
                      <span>Nutrition Hub</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/sleep">
                      <Moon className="h-4 w-4" />
                      <span>Sommeil</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/achievements">
                      <Trophy className="h-4 w-4" />
                      <span>Succès</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/coach">
                      <MessageSquare className="h-4 w-4" />
                      <span>Coach IA</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Mon compte</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/profile">
                      <Avatar className="mr-2 h-4 w-4">
                        <AvatarImage src={avatarUrl} alt={displayName} />
                        <AvatarFallback>{userInitials}</AvatarFallback>
                      </Avatar>
                      <span>Profile</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/settings">
                      <Settings className="h-4 w-4" />
                      <span>Paramètres</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <Button variant="outline" size="sm" className="w-full" onClick={() => signOut()}>
              Se déconnecter
            </Button>
          </SidebarFooter>
        </SheetContent>
      </Sheet>
      {children}
    </Sidebar>
  )
}

export default AppSidebar;
