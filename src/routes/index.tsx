
import { createBrowserRouter } from 'react-router-dom';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Workout from '@/pages/Workout';
import WorkoutDetail from '@/pages/WorkoutDetail';
import WorkoutSession from '@/pages/WorkoutSession';
import SportTracker from '@/pages/SportTracker'; // Nouvelle import
import Nutrition from '@/pages/Nutrition';
import NutritionDetail from '@/pages/NutritionDetail';
import Sleep from '@/pages/Sleep';
import Achievements from '@/pages/Achievements';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Onboarding from '@/pages/Onboarding';
import Coach from '@/pages/Coach';
import Privacy from '@/pages/Privacy';
import AdminDashboard from '@/pages/AdminDashboard';
import NotFound from '@/pages/NotFound';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/workout",
    element: <Workout />,
  },
  {
    path: "/workout/:id",
    element: <WorkoutDetail />,
  },
  {
    path: "/workout/:id/preview",
    element: <WorkoutDetail />,
  },
  {
    path: "/workout/:id/session",
    element: <WorkoutSession />,
  },
  {
    path: "/sport-tracker", // Nouvelle route
    element: <SportTracker />,
  },
  {
    path: "/nutrition",
    element: <Nutrition />,
  },
  {
    path: "/nutrition/:id",
    element: <NutritionDetail />,
  },
  {
    path: "/sleep",
    element: <Sleep />,
  },
  {
    path: "/achievements",
    element: <Achievements />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/onboarding",
    element: <Onboarding />,
  },
  {
    path: "/coach",
    element: <Coach />,
  },
  {
    path: "/privacy",
    element: <Privacy />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
  {
    path: "*",
    element: <NotFound />,
  }
]);
