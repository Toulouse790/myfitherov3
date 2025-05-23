
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ConversationProvider } from "@/contexts/ConversationContext";
import PrivateRoute from "@/components/auth/PrivateRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
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
          <AuthProvider>
            <ConversationProvider>
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
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ConversationProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
