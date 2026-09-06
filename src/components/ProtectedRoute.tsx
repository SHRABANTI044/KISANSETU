import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="p-10 text-center text-sm text-gray-500">Loading...</div>;
  }

  // 1. Not logged in -> go to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

    // 2. Logged in, but profile NOT complete -> send to the intermediate page
  if (profile && !profile.profile_completed) {
    return <Navigate to="/complete-profile" replace />;
  }

  // 3. Logged in & profile complete -> allow access!
  return <>{children}</>;
}