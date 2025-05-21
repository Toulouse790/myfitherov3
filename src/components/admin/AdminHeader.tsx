
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ShieldAlert, Home, LogOut } from 'lucide-react';

interface AdminHeaderProps {
  onLogout?: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
  return (
    <header className="border-b bg-background sticky top-0 z-30">
      <div className="container mx-auto py-3 px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-semibold">
            <ShieldAlert className="text-primary h-5 w-5" />
            <span>MyFitHero</span>
            <Badge variant="outline">Admin</Badge>
          </div>
          
          <nav className="hidden md:block">
            <ul className="flex space-x-4">
              <li>
                <NavLink 
                  to="/admin" 
                  className={({ isActive }) => 
                    `text-sm ${isActive ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`
                  }
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/dashboard" 
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  App principale
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon" className="md:hidden">
            <NavLink to="/">
              <Home className="h-5 w-5" />
            </NavLink>
          </Button>
          
          <Button onClick={onLogout} variant="ghost" size="sm" className="text-red-500 hidden md:flex items-center gap-1">
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
          
          <Button onClick={onLogout} variant="ghost" size="icon" className="text-red-500 md:hidden">
            <LogOut className="h-5 w-5" />
          </Button>
          
          <Avatar className="h-8 w-8">
            <AvatarImage src="/admin-avatar.png" alt="Admin" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

const Badge = ({ children, variant = 'default', className = '' }: { 
  children: React.ReactNode;
  variant?: 'default' | 'outline';
  className?: string;
}) => {
  const baseClasses = "text-xs rounded-md px-1.5 py-0.5 font-medium";
  const variantClasses = {
    default: "bg-primary/20 text-primary",
    outline: "border border-primary/30 text-primary"
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default AdminHeader;
