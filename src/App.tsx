import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthGate from "@/components/AuthGate";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index.tsx";
import Hotels from "./pages/Hotels.tsx";
import HotelDetail from "./pages/HotelDetail.tsx";
import Vehicles from "./pages/Vehicles.tsx";
import VehicleSelection from "./pages/VehicleSelection.tsx";
import Experiences from "./pages/Experiences.tsx";
import ExperienceDetail from "./pages/ExperienceDetail.tsx";
import Profile from "./pages/Profile.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import AdminOverview from "./pages/admin/AdminOverview.tsx";
import AdminQueue from "./pages/admin/AdminQueue.tsx";
import AdminBookings from "./pages/admin/AdminBookings.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AuthGate />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/hotels/:id" element={<HotelDetail />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/vehicles/:categoryId" element={<VehicleSelection />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/experiences/:id" element={<ExperienceDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admin" element={<AdminOverview />} />
            <Route path="/admin/queue" element={<AdminQueue />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
