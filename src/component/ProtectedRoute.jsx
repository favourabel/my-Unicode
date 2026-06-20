import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const { currentUser, loading } = useAuth();

  // Also check localStorage (for offline admin fallback)
  const stored = localStorage.getItem("user");
  const localUser = stored ? JSON.parse(stored) : null;

  // Show loader while Supabase checks — but skip if we have a local user
  if (loading && !localUser) {
    return <div className="text-center py-8">Loading...</div>;
  }

  // Authenticated if EITHER source has a user
  if (!currentUser && !localUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}