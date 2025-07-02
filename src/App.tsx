import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminProvider } from "@/contexts/AdminContext";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import About from "./pages/About";
import GetInvolved from "./pages/GetInvolved";
import Team from "./pages/Team";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Admin imports
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ParticipantsManager from "./pages/admin/ParticipantsManager";
import ProgramsManager from "./pages/admin/ProgramsManager";
import EventsManager from "./pages/admin/EventsManager";
import TestimonialsManager from "./pages/admin/TestimonialsManager";
import ContactFormsManager from "./pages/admin/ContactFormsManager";
import NewsletterManager from "./pages/admin/NewsletterManager";
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AdminProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/get-involved" element={<GetInvolved />} />
            <Route path="/team" element={<Team />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="participants" element={<ParticipantsManager />} />
              <Route path="programs" element={<ProgramsManager />} />
              <Route path="events" element={<EventsManager />} />
              <Route path="testimonials" element={<TestimonialsManager />} />
              <Route path="contacts" element={<ContactFormsManager />} />
              <Route path="newsletter" element={<NewsletterManager />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AdminProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;