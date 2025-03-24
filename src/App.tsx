
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Auth from "@/pages/Auth";
import Index from "@/pages/Index";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { UserNavbar } from "@/components/UserNavbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-[#f9f2e8] dark:bg-slate-950">
              <UserNavbar />
              <main id="content">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                </Routes>
              </main>
              <Toaster position="top-center" richColors />
            </div>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
