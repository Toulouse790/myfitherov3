
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Workout from '@/pages/Workout';
import WorkoutDetail from '@/pages/WorkoutDetail';
import WorkoutSession from '@/pages/WorkoutSession';
import SportTracker from '@/pages/SportTracker';
import Nutrition from '@/pages/Nutrition';
import NutritionHub from '@/pages/NutritionHub';
import NutritionDetail from '@/pages/NutritionDetail';
import Sleep from '@/pages/Sleep';
import HydrationModule from '@/pages/HydrationModule';
import Achievements from '@/pages/Achievements';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Onboarding from '@/pages/Onboarding';
import Coach from '@/pages/Coach';
import SimpleAI from '@/pages/SimpleAI';
import Privacy from '@/pages/Privacy';
import AdminDashboard from '@/pages/AdminDashboard';
import NotFound from '@/pages/NotFound';
import { BottomNavLayout } from '@/components/layout/BottomNavLayout';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/dashboard",
    element: (
      <BottomNavLayout>
        <Dashboard />
      </BottomNavLayout>
    ),
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
    path: "/sport-tracker",
    element: (
      <BottomNavLayout>
        <SportTracker />
      </BottomNavLayout>
    ),
  },
  {
    path: "/sport",
    element: (
      <BottomNavLayout>
        <SportTracker />
      </BottomNavLayout>
    ),
  },
  {
    path: "/nutrition",
    element: (
      <BottomNavLayout>
        <Nutrition />
      </BottomNavLayout>
    ),
  },
  {
    path: "/nutrition-hub",
    element: <NutritionHub />,
  },
  {
    path: "/nutrition/:id",
    element: <NutritionDetail />,
  },
  {
    path: "/hydration",
    element: (
      <BottomNavLayout>
        <HydrationModule />
      </BottomNavLayout>
    ),
  },
  {
    path: "/sleep",
    element: (
      <BottomNavLayout>
        <Sleep />
      </BottomNavLayout>
    ),
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
    path: "/simple-ai",
    element: <SimpleAI />,
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

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
