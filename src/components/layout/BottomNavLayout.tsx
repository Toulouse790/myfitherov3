
import React from 'react';
import { BottomNavigation } from './BottomNavigation';

interface BottomNavLayoutProps {
  children: React.ReactNode;
}

export function BottomNavLayout({ children }: BottomNavLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pb-20 min-h-screen">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}
