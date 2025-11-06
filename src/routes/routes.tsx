import { createBrowserRouter,  } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import NotFoundPage from "../components/NoRouteFound";
import LoginPage from "../login/page/LoginPage";
import UserDashboard from "../user/UserDashboard"; // example user page
import { RoleProtectedRoute } from "./ProtectedRoute";
import { AdminPage } from "../admin/AdminPage";

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
            <UserDashboard />
        ),
      },
      {
        path: "admin",
        element: (
            <AdminPage />
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
