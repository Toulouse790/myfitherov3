
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Workout from '@/pages/Workout';
import WorkoutDetail from '@/pages/WorkoutDetail';
import WorkoutSession from '@/pages/WorkoutSession';
import Nutrition from '@/pages/Nutrition';
import NutritionDetail from '@/pages/NutritionDetail';
import Sleep from '@/pages/Sleep';
import Coach from '@/pages/Coach';
import Onboarding from '@/pages/Onboarding';
import Settings from '@/pages/Settings';
import Profile from '@/pages/Profile';
import AdminDashboard from '@/pages/AdminDashboard';
import Achievements from '@/pages/Achievements';
import NotFound from '@/pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Routes protégées */}
      <Route path="/" element={
        <PrivateRoute>
          <Index />
        </PrivateRoute>
      } />
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
      <Route path="/workout" element={
        <PrivateRoute>
          <Workout />
        </PrivateRoute>
      } />
      <Route path="/workout/:id" element={
        <PrivateRoute>
          <WorkoutDetail />
        </PrivateRoute>
      } />
      <Route path="/workout/:id/preview" element={
        <PrivateRoute>
          <WorkoutDetail />
        </PrivateRoute>
      } />
      <Route path="/workout/:id/session" element={
        <PrivateRoute>
          <WorkoutSession />
        </PrivateRoute>
      } />
      <Route path="/nutrition" element={
        <PrivateRoute>
          <Nutrition />
        </PrivateRoute>
      } />
      <Route path="/nutrition/:id" element={
        <PrivateRoute>
          <NutritionDetail />
        </PrivateRoute>
      } />
      <Route path="/sleep" element={
        <PrivateRoute>
          <Sleep />
        </PrivateRoute>
      } />
      <Route path="/coach" element={
        <PrivateRoute>
          <Coach />
        </PrivateRoute>
      } />
      <Route path="/settings" element={
        <PrivateRoute>
          <Settings />
        </PrivateRoute>
      } />
      <Route path="/profile" element={
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      } />
      <Route path="/onboarding" element={
        <PrivateRoute>
          <Onboarding />
        </PrivateRoute>
      } />
      <Route path="/admin" element={
        <PrivateRoute>
          <AdminDashboard />
        </PrivateRoute>
      } />
      <Route path="/achievements" element={
        <PrivateRoute>
          <Achievements />
        </PrivateRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
