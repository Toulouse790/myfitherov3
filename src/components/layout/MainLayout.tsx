
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import { EmergencyFloatingButton } from '@/components/emergency/EmergencyFloatingButton';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
      
      {/* Bouton urgence flottant toujours visible */}
      <EmergencyFloatingButton />
    </div>
  );
}
