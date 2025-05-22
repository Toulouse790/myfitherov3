
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Workout from "./pages/Workout";
import WorkoutDetail from "./pages/WorkoutDetail"; 
import WorkoutSession from "./pages/WorkoutSession";
import Nutrition from "./pages/Nutrition";
import NutritionDetail from "./pages/NutritionDetail"; 
import Sleep from "./pages/Sleep";
import Coach from "./pages/Coach";
import Onboarding from "./pages/Onboarding";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import Achievements from "./pages/Achievements"; 
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/workout" element={<Workout />} />
            <Route path="/workout/:id" element={<WorkoutDetail />} />
            <Route path="/workout/:id/preview" element={<WorkoutDetail />} />
            <Route path="/workout/:id/session" element={<WorkoutSession />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/nutrition/:id" element={<NutritionDetail />} />
            <Route path="/sleep" element={<Sleep />} />
            <Route path="/coach" element={<Coach />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/achievements" element={<Achievements />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
