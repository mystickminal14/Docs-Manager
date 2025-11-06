import { createBrowserRouter, Navigate } from "react-router-dom";
import type { ReactNode } from "react";

import AppLayout from "../components/layout/AppLayout";

import NotFoundPage from "../components/NoRouteFound";
import LoginPage from "../login/page/LoginPage";
import AdminPage from "../admin/AdminPage";
import ManageFiles from "../admin/manageFiles/pages/ManageFiles";


const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const LoginRoute = () => {
  // return <Navigate to="/app/dashboard" />;
  // const token = localStorage.getItem("token");
  // if (token) {
  //   return <Navigate to="/app/dashboard" replace />;
  // }
  // return <LoginPage />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },

  {
    path: "/app",
    element: (
      <AppLayout />
    ),
    children: [
      {
        path: "dashboard",
        element: <ManageFiles />,
      },
      {
        path: "users",
        element: <AdminPage />,
      },
    ],
  },
]);

export default router;