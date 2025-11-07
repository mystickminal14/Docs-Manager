// src/routes/RoleProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useGetProfile } from "../components/hooks/useGetProfile";

interface Props {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const RoleProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { data: profile, isLoading, isError } = useGetProfile();
  const location = useLocation(); 

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !profile) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(profile.role ?? "")) {
    return <Navigate to="/app/unauthorized" replace />;
  }

  const category = new URLSearchParams(location.search).get("category");

  return <>{children}</>;
};
