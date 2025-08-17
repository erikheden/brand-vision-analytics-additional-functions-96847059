
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import AppLayout from "@/components/layout/AppLayout";
import IndexPage from "./pages/Index";
import CountryComparison from "./pages/CountryComparison";
import SustainabilityPriorities from "./pages/SustainabilityPriorities";
import SustainabilityInfluences from "./pages/SustainabilityInfluences";
import SustainabilityDiscussions from "./pages/SustainabilityDiscussions";
import MaterialityAreas from "./pages/MaterialityAreas";
import SustainabilityImpact from "./pages/SustainabilityImpact";
import SustainabilityKnowledge from "./pages/SustainabilityKnowledge";
import SustainabilityPerception from "./pages/SustainabilityPerception";
import BehaviourGroups from "./pages/BehaviourGroups";
import Auth from "./pages/Auth";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AdminPanel } from "./components/admin/AdminPanel";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<IndexPage />} />
              <Route path="country-comparison" element={<CountryComparison />} />
              <Route path="sustainability-priorities" element={<SustainabilityPriorities />} />
              <Route path="sustainability-influences" element={<SustainabilityInfluences />} />
              <Route path="sustainability-knowledge" element={<SustainabilityKnowledge />} />
              <Route path="sustainability-discussions" element={<SustainabilityDiscussions />} />
              <Route path="materiality-areas" element={<MaterialityAreas />} />
              <Route path="sustainability-impact" element={<SustainabilityImpact />} />
              <Route path="sustainability-perception" element={<SustainabilityPerception />} />
              <Route path="behaviour-groups" element={<BehaviourGroups />} />
              <Route path="admin" element={<AdminPanel />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
