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
import { SidebarClose } from './SidebarClose';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarItem,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "./Sidebar"
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Home,
  Dumbbell,
  Apple,
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
                        <AvatarImage src={user?.image} alt={user?.name || "Profile"} />
                        <AvatarFallback>{user?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
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
          <SidebarClose />
        </SheetContent>
      </Sheet>
      {children}
    </Sidebar>
  )
}

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LucideIcon } from 'lucide-react';
import { Link } from "react-router-dom";

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <aside
        ref={ref}
        className={cn(
          "flex flex-col space-y-2 w-[var(--sidebar-width)] border-r bg-secondary text-secondary-foreground",
          className
        )}
        {...props}
      >
        {children}
      </aside>
    )
  }
)
Sidebar.displayName = "Sidebar"

interface SidebarContentProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

const SidebarContent = React.forwardRef<HTMLElement, SidebarContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex-1 overflow-hidden px-2", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SidebarContent.displayName = "SidebarContent"

interface SidebarFooterProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

const SidebarFooter = React.forwardRef<HTMLElement, SidebarFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center h-16 px-2 border-t",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SidebarFooter.displayName = "SidebarFooter"

interface SidebarGroupProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

const SidebarGroup = React.forwardRef<HTMLElement, SidebarGroupProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col space-y-1", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SidebarGroup.displayName = "SidebarGroup"

interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

const SidebarGroupLabel = React.forwardRef<HTMLElement, SidebarGroupLabelProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "px-3 py-2 text-sm font-semibold text-muted-foreground",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SidebarGroupLabel.displayName = "SidebarGroupLabel"

interface SidebarMenuProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

const SidebarMenu = React.forwardRef<HTMLElement, SidebarMenuProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col space-y-0.5", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SidebarMenu.displayName = "SidebarMenu"

interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

const SidebarMenuItem = React.forwardRef<HTMLElement, SidebarMenuItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("", className)} {...props}>
        {children}
      </div>
    )
  }
)
SidebarMenuItem.displayName = "SidebarMenuItem"

interface SidebarMenuButtonProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

const SidebarMenuButton = React.forwardRef<HTMLElement, SidebarMenuButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="ghost"
        className={cn(
          "flex items-center gap-2 px-3.5 py-2 rounded-md font-medium hover:bg-accent hover:text-accent-foreground",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

interface SidebarItemProps extends React.HTMLAttributes<HTMLElement> {
  icon?: LucideIcon
  children: React.ReactNode
}

const SidebarItem = React.forwardRef<HTMLAnchorElement, SidebarItemProps>(
  ({ className, icon: Icon, children, ...props }, ref) => {
    return (
      <a
        href="#"
        ref={ref}
        className={cn(
          "flex items-center gap-2 px-3.5 py-2 rounded-md font-medium hover:bg-accent hover:text-accent-foreground",
          className
        )}
        {...props}
      >
        {Icon && <Icon className="w-4 h-4" />}
        {children}
      </a>
    )
  }
)
SidebarItem.displayName = "SidebarItem"

interface SidebarTriggerProps extends React.HTMLAttributes<HTMLElement> { }

const SidebarTrigger = React.forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="ghost"
        size="sm"
        className={cn("p-0 data-[state=open]:bg-secondary", className)}
        {...props}
      />
    )
  }
)
SidebarTrigger.displayName = "SidebarTrigger"

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarItem,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
}
