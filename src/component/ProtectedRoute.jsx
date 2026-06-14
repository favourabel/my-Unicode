import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}