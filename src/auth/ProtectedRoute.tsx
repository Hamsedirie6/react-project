import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { PropsWithChildren } from "react";

export default function ProtectedRoute({ children }: PropsWithChildren) {
  const { user, loading } = useAuth();
  if (loading) return null; // kan ersättas med en spinner
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
