import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Index from "./pages/Index";
import Monitor from "./pages/Monitor";
import ThreatDetail from "./pages/ThreatDetail";
import SessionSummary from "./pages/SessionSummary";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import { MediaPermissionsProvider } from "./contexts/MediaPermissionsContext";
import MediaPermissionsDialog from "./components/MediaPermissionsDialog";
import { useMediaPermissionsContext } from "./contexts/MediaPermissionsContext";

const queryClient = new QueryClient();

const AppContent = () => {
  const { showPermissionsDialog, setShowPermissionsDialog, dismissDialog } =
    useMediaPermissionsContext();

  return (
    <>
      <BrowserRouter>
        <Layout>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/monitor" element={<Monitor />} />
              <Route path="/threat/:id" element={<ThreatDetail />} />
              <Route path="/summary" element={<SessionSummary />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </Layout>
      </BrowserRouter>

      <MediaPermissionsDialog
        isOpen={showPermissionsDialog}
        onClose={dismissDialog}
        onPermissionsGranted={() => {
          setShowPermissionsDialog(false);
        }}
      />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <MediaPermissionsProvider>
        <AppContent />
      </MediaPermissionsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
