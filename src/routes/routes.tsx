import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../login/page/LoginPage";
import RegisterPage from './../login/page/Register';
import ProtectedRoute from "./ProtectedRoute";
import GameDashboard from "../game/components/GameDashboard";


const LoginRoute = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    return <Navigate to="/app/game/dashboard" replace />;
  }
  return <LoginPage />;
};

const RegisterRoute = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    return <Navigate to="/app/game/dashboard" replace />;
  }
  return <RegisterPage />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginRoute />,
  },
  {
    path: "/register",
    element: <RegisterRoute />,
  },
  {
    path: "/app/game/dashboard",
    element: (
      <ProtectedRoute>
        <GameDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <div>404 - Page Not Found</div>,
  },
]);

export default router;