import { createBrowserRouter,  } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import NotFoundPage from "../components/NoRouteFound";
import LoginPage from "../login/page/LoginPage";
import UserDashboard from "../user/UserDashboard"; // example user page
import { RoleProtectedRoute } from "./ProtectedRoute";
import { AdminPage } from "../admin/AdminPage";
import ManageFiles from "../admin/components/ManageFiles";

const router = createBrowserRouter([
  {
    path: "/:category",
    element: <LoginPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },  {
        path: "dashboard",
        element: (
          <RoleProtectedRoute allowedRoles={[ "User"]}>
            <UserDashboard />
          </RoleProtectedRoute>
        ),
      },
  {
    path: "/app",
    element: <AppLayout />,
    children: [
    
      {
        path: "admin",
        element: (
          <RoleProtectedRoute allowedRoles={["Admin"]}>
            <AdminPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "manage-files",
        element: (
          <RoleProtectedRoute allowedRoles={["Admin"]}>
            <ManageFiles />
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
