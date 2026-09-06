import { useEffect } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { Store, Truck } from "lucide-react";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import AboutPage from "./pages/AboutPage";
import BuyerProfilePage from "./pages/BuyerProfilePage";
import FarmerProfilePage from "./pages/FarmerProfilePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import MobileLoginPage from "./pages/MobileLoginPage";
import NotFound from "./pages/NotFound";
import PlaceholderPage from "./pages/PlaceholderPage";
import RegisterPage from "./pages/RegisterPage";

/**
 * Handles scrolling on route changes: honours #section hashes (so navbar
 * anchor links also work from pages like /about), otherwise scrolls to top.
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

/** Site chrome (existing navbar + footer) shared by all non-auth pages. */
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

        {/* Farmer dashboard module — isolated under src/dashboard, shared shell */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/crop-lots" element={<CropLotsPage />} />
        <Route path="/dashboard/market-prices" element={<MarketPricesPage />} />
        <Route path="/dashboard/buyers" element={<BuyersPage />} />
        <Route path="/dashboard/ai-advisor" element={<AIAdvisorPage />} />
        <Route path="/dashboard/offers" element={<OffersPage />} />
        <Route path="/dashboard/orders" element={<OrdersTrackingPage />} />
        <Route path="/dashboard/earnings" element={<EarningsPage />} />
        <Route path="/dashboard/help-support" element={<HelpSupportPage />} />
        <Route path="/dashboard/settings" element={<SettingsPage />} />

        {/* Legacy dashboard URLs kept working — redirect into the module */}
        <Route path="/farmer-dashboard" element={<Navigate to="/dashboard" replace />} />
        <Route path="/my-crop-lots" element={<Navigate to="/dashboard/crop-lots" replace />} />
        <Route path="/market-prices" element={<Navigate to="/dashboard/market-prices" replace />} />
        <Route path="/buyers" element={<Navigate to="/dashboard/buyers" replace />} />
        <Route path="/ai-advisor" element={<Navigate to="/dashboard/ai-advisor" replace />} />
        <Route path="/deals-offers" element={<Navigate to="/dashboard/offers" replace />} />
        <Route path="/orders-shipments" element={<Navigate to="/dashboard/orders" replace />} />
        <Route path="/earnings" element={<Navigate to="/dashboard/earnings" replace />} />
        <Route path="/support" element={<Navigate to="/dashboard/help-support" replace />} />
        <Route path="/settings" element={<Navigate to="/dashboard/settings" replace />} />

        {/* All site pages keep the existing navbar + footer */}
        <Route element={<SiteLayout />}>
          {/* Public pages */}
          <Route path="/" element={<Home />} />
          <Route path="/market-prices" element={<MarketPricesPage />} />
          <Route
            path="/buyers"
            element={
              <PlaceholderPage
                icon={Users}
                eyebrow="Buyers"
                title="Connect with Buyers"
                description="Discover verified buyers across regions, see their crop requirements, compare offers and contact the ones that fit your produce."
                points={["Verified buyer profiles", "Requirements & offers", "Direct communication"]}
              />
            }
          />
          <Route
            path="/sell-produce"
            element={
              <ProtectedRoute>
                <PlaceholderPage
                  icon={Store}
                  eyebrow="Sell Produce"
                  title="Sell Your Produce"
                  description="List your crop with quantity and quality details, choose a market, and receive buyer recommendations tailored to your produce."
                  points={["List in 7 simple steps", "Market recommendations", "Transparent negotiation"]}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PlaceholderPage
                icon={LayoutDashboard}
                eyebrow="My Dashboard"
                title="Your Personalised Dashboard"
                description="Farmers see prices, recommended markets and buyers, listed produce and earnings. Buyers see requirements, produce and transactions."
                points={["Role-based views", "Prices & recommendations", "Orders & earnings"]}
              />
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <PlaceholderPage
                  icon={Truck}
                  eyebrow="Orders"
                  title="Track Orders & Payments"
                  description="Follow every confirmed deal through pickup, delivery and payment — all the way to completion."
                  points={["Stage-by-stage tracking", "Delivery updates", "Payment records"]}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer-dashboard"
            element={
              <PlaceholderPage
                icon={Sprout}
                eyebrow="Farmer Dashboard"
                title="Farmer Dashboard"
                description="Your personalised farmer workspace — market prices, AI price predictions, market & buyer recommendations, produce listings, orders and earnings will live here."
                points={["Prices & AI predictions", "Market & buyer recommendations", "Produce, orders & earnings"]}
              />
            }
          />
          <Route
            path="/buyer-dashboard"
            element={
              <ProtectedRoute>
                <PlaceholderPage
                  icon={Store}
                  eyebrow="Buyer Dashboard"
                  title="Buyer Dashboard"
                  description="Your buyer workspace — post purchase requirements, discover quality produce, connect with suitable farmers and track orders and transactions."
                  points={["Post requirements", "Find produce & farmers", "Orders & transactions"]}
                />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
