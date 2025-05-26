
import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';
import ModuleLoader from '@/components/ui/ModuleLoader';
import { ModuleErrorBoundary } from '@/components/ui/ErrorBoundary';

// Pages chargées immédiatement (critiques)
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import Privacy from '@/pages/Privacy';

// Lazy loading des modules principaux
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Workout = lazy(() => import('@/pages/Workout'));
const WorkoutDetail = lazy(() => import('@/pages/WorkoutDetail'));
const WorkoutSession = lazy(() => import('@/pages/WorkoutSession'));
const Nutrition = lazy(() => import('@/pages/Nutrition'));
const NutritionDetail = lazy(() => import('@/pages/NutritionDetail'));
const Sleep = lazy(() => import('@/pages/Sleep'));
const Coach = lazy(() => import('@/pages/Coach'));

// Pages secondaires en lazy loading
const Onboarding = lazy(() => import('@/pages/Onboarding'));
const Settings = lazy(() => import('@/pages/Settings'));
const Profile = lazy(() => import('@/pages/Profile'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
const Achievements = lazy(() => import('@/pages/Achievements'));

// Composant wrapper pour les routes lazy
const LazyRoute = ({ children }: { children: React.ReactNode }) => (
  <ModuleErrorBoundary>
    <Suspense fallback={<ModuleLoader />}>
      {children}
    </Suspense>
  </ModuleErrorBoundary>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Routes publiques - chargement immédiat */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/privacy" element={<Privacy />} />
      
      {/* Routes protégées */}
      <Route path="/" element={
        <PrivateRoute>
          <Index />
        </PrivateRoute>
      } />
      
      {/* Routes avec lazy loading */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <LazyRoute>
            <Dashboard />
          </LazyRoute>
        </PrivateRoute>
      } />
      
      {/* Module Sport/Workout */}
      <Route path="/workout" element={
        <PrivateRoute>
          <LazyRoute>
            <Workout />
          </LazyRoute>
        </PrivateRoute>
      } />
      <Route path="/workout/:id" element={
        <PrivateRoute>
          <LazyRoute>
            <WorkoutDetail />
          </LazyRoute>
        </PrivateRoute>
      } />
      <Route path="/workout/:id/preview" element={
        <PrivateRoute>
          <LazyRoute>
            <WorkoutDetail />
          </LazyRoute>
        </PrivateRoute>
      } />
      <Route path="/workout/:id/session" element={
        <PrivateRoute>
          <LazyRoute>
            <WorkoutSession />
          </LazyRoute>
        </PrivateRoute>
      } />
      
      {/* Module Nutrition */}
      <Route path="/nutrition" element={
        <PrivateRoute>
          <LazyRoute>
            <Nutrition />
          </LazyRoute>
        </PrivateRoute>
      } />
      <Route path="/nutrition/:id" element={
        <PrivateRoute>
          <LazyRoute>
            <NutritionDetail />
          </LazyRoute>
        </PrivateRoute>
      } />
      
      {/* Module Sommeil */}
      <Route path="/sleep" element={
        <PrivateRoute>
          <LazyRoute>
            <Sleep />
          </LazyRoute>
        </PrivateRoute>
      } />
      
      {/* Module Coach IA */}
      <Route path="/coach" element={
        <PrivateRoute>
          <LazyRoute>
            <Coach />
          </LazyRoute>
        </PrivateRoute>
      } />
      
      {/* Pages secondaires */}
      <Route path="/settings" element={
        <PrivateRoute>
          <LazyRoute>
            <Settings />
          </LazyRoute>
        </PrivateRoute>
      } />
      <Route path="/profile" element={
        <PrivateRoute>
          <LazyRoute>
            <Profile />
          </LazyRoute>
        </PrivateRoute>
      } />
      <Route path="/onboarding" element={
        <PrivateRoute>
          <LazyRoute>
            <Onboarding />
          </LazyRoute>
        </PrivateRoute>
      } />
      <Route path="/admin" element={
        <PrivateRoute>
          <LazyRoute>
            <AdminDashboard />
          </LazyRoute>
        </PrivateRoute>
      } />
      <Route path="/achievements" element={
        <PrivateRoute>
          <LazyRoute>
            <Achievements />
          </LazyRoute>
        </PrivateRoute>
      } />
      
      {/* Page 404 - chargement immédiat */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
