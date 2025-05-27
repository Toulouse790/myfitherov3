
import React from 'react';
import { BottomNavigation } from './BottomNavigation';

interface BottomNavLayoutProps {
  children: React.ReactNode;
}

export function BottomNavLayout({ children }: BottomNavLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="flex-1 min-h-[calc(100vh-5rem)]">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}
