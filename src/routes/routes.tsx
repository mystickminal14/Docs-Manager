import { createBrowserRouter,  } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import NotFoundPage from "../components/NoRouteFound";
import LoginPage from "../login/page/LoginPage";
import AdminPage from "../admin/AdminPage";
import { RoleProtectedRoute } from "./ProtectedRoute";
import UserDashboard from "../user/UserDashboard";

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
    element: <AppLayout />,
    children: [
      {
        path: "dashboard",
        element: (
          <RoleProtectedRoute allowedRoles={[ "user"]}>
            <UserDashboard />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "admin",
        element: (
          <RoleProtectedRoute allowedRoles={["admin"]}>
            <AdminPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "unauthorized",
        element: <div>Unauthorized Access</div>,
      },
    ],
  },
]);

export default router;
