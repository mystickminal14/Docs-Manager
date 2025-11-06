// src/routes/RoleProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useGetProfile } from "../components/hooks/useGetProfile";

interface Props {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const RoleProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { data: profile, isLoading, isError } = useGetProfile();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !profile) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(profile.role??"")) {
    return <Navigate to="/app/unauthorized" replace />;
  }

  return <>{children}</>;
};
