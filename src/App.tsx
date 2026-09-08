import { useEffect } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Public site pages
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import CompleteProfilePromptPage from "./pages/CompleteProfilePromptPage";

// Auth & onboarding pages
import LoginPage from "./pages/LoginPage";
import MobileLoginPage from "./pages/MobileLoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import RegisterPage from "./pages/RegisterPage";
import FarmerProfilePage from "./pages/FarmerProfilePage";
import BuyerProfilePage from "./pages/BuyerProfilePage";
import NotFound from "./pages/NotFound";

// Dashboard module pages
import DashboardPage from "./dashboard/pages/DashboardPage";
import CropLotsPage from "./dashboard/pages/CropLotsPage";
import DashboardMarketPricesPage from "./dashboard/pages/MarketPricesPage";
import BuyersPage from "./dashboard/pages/BuyersPage";
import AIAdvisorPage from "./dashboard/pages/AIAdvisorPage";
import OffersPage from "./dashboard/pages/OffersPage";
import OrdersTrackingPage from "./dashboard/pages/OrdersTrackingPage";
import EarningsPage from "./dashboard/pages/EarningsPage";
import HelpSupportPage from "./dashboard/pages/HelpSupportPage";
import SettingsPage from "./dashboard/pages/SettingsPage";
import ProfilePage from "./dashboard/pages/ProfilePage";

// Buyer dashboard
import BuyerDashboard from "./Buyer Dashboard/pages/BuyerDashboard";
import MyRequirements from "./Buyer Dashboard/pages/MyRequirements";
import Farmers from "./Buyer Dashboard/pages/Farmers";
import OffersNegotiations from "./Buyer Dashboard/pages/OffersNegotiations";
import BuyerOrdersTracking from "./Buyer Dashboard/pages/OrdersTracking";
import Payments from "./Buyer Dashboard/pages/Payments";
import TransportLogistics from "./Buyer Dashboard/pages/TransportLogistics";
import BuyerHelpSupport from "./Buyer Dashboard/pages/HelpSupport";

/**
 * Handles scrolling on route changes: honours #section hashes, otherwise scrolls to top.
 */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const timer = window.setTimeout(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
      return () => window.clearTimeout(timer);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

/** Site chrome (existing navbar + footer) shared by public marketing pages. */
function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <Routes>
        {/* Standalone auth & onboarding screens — no site navbar/footer */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/mobile" element={<MobileLoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/farmer-profile" element={<FarmerProfilePage />} />
        <Route path="/buyer-profile" element={<BuyerProfilePage />} />

        {/* Farmer dashboard module — protected routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/dashboard/crop-lots" element={<ProtectedRoute><CropLotsPage /></ProtectedRoute>} />
        <Route path="/dashboard/market-prices" element={<ProtectedRoute><DashboardMarketPricesPage /></ProtectedRoute>} />
        <Route path="/dashboard/buyers" element={<ProtectedRoute><BuyersPage /></ProtectedRoute>} />
        <Route path="/dashboard/ai-advisor" element={<ProtectedRoute><AIAdvisorPage /></ProtectedRoute>} />
        <Route path="/dashboard/offers" element={<ProtectedRoute><OffersPage /></ProtectedRoute>} />
        <Route path="/dashboard/orders" element={<ProtectedRoute><OrdersTrackingPage /></ProtectedRoute>} />
        <Route path="/dashboard/earnings" element={<ProtectedRoute><EarningsPage /></ProtectedRoute>} />
        <Route path="/dashboard/help-support" element={<ProtectedRoute><HelpSupportPage /></ProtectedRoute>} />
        <Route path="/dashboard/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/dashboard/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        {/* Buyer dashboard — protected routes */}
        <Route path="/buyer/dashboard" element={<ProtectedRoute><BuyerDashboard /></ProtectedRoute>} />
        <Route path="/buyer/requirements" element={<ProtectedRoute><MyRequirements /></ProtectedRoute>} />
        <Route path="/buyer/farmers" element={<ProtectedRoute><Farmers /></ProtectedRoute>} />
        <Route path="/buyer/offers-negotiations" element={<ProtectedRoute><OffersNegotiations /></ProtectedRoute>} />
        <Route path="/buyer/orders-tracking" element={<ProtectedRoute><BuyerOrdersTracking /></ProtectedRoute>} />
        <Route path="/buyer/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
        <Route path="/buyer/transport-logistics" element={<ProtectedRoute><TransportLogistics /></ProtectedRoute>} />
        <Route path="/buyer/help-support" element={<ProtectedRoute><BuyerHelpSupport /></ProtectedRoute>} />

        {/* Friendly URL redirects into the dashboard module */}
        <Route path="/farmer-dashboard" element={<Navigate to="/dashboard" replace />} />
        <Route path="/my-crop-lots" element={<Navigate to="/dashboard/crop-lots" replace />} />
        {/* Friendly URL redirects into the dashboard */}
        <Route path="/sell-produce" element={<Navigate to="/dashboard/crop-lots" replace />} />
        <Route path="/orders" element={<Navigate to="/dashboard/orders" replace />} />
        <Route path="/market-prices" element={<Navigate to="/dashboard/market-prices" replace />} />
        <Route path="/buyers" element={<Navigate to="/dashboard/buyers" replace />} />
        <Route path="/ai-advisor" element={<Navigate to="/dashboard/ai-advisor" replace />} />
        <Route path="/deals-offers" element={<Navigate to="/dashboard/offers" replace />} />
        <Route path="/orders-shipments" element={<Navigate to="/dashboard/orders" replace />} />
        <Route path="/earnings" element={<Navigate to="/dashboard/earnings" replace />} />
        <Route path="/support" element={<Navigate to="/dashboard/help-support" replace />} />
        <Route path="/settings" element={<Navigate to="/dashboard/settings" replace />} />

        {/* Public marketing pages (keeps header + footer) */}
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/complete-profile" element={<CompleteProfilePromptPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}