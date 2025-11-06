// src/context/ContextApp.tsx
import { createContext, type ReactNode, useEffect, useState, useContext } from "react";
import { ToastContainer, toast, type ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AppContextType {
  showToast: (
    message: string,
    type?: "warn" | "success" | "error" | "info" | "default"
  ) => void;
  isOnline: boolean;
  user: any | null;
  logout: () => void;
}

interface ContextAppProps {
  children: ReactNode;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultToastOptions: ToastOptions = {
  position: "bottom-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
};

export default function ContextApp({ children }: ContextAppProps) {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check if user is logged in from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const logout = () => {
    // Clear all authentication data
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("isAuthenticated");
    setUser(null);
    showToast("Logged out successfully", "success");
  };

  const showToast = (
    message: string,
    type: "warn" | "success" | "error" | "info" | "default" = "default"
  ) => {
    switch (type) {
      case "warn":
        toast.warn(message, defaultToastOptions);
        break;
      case "success":
        toast.success(message, defaultToastOptions);
        break;
      case "error":
        toast.error(message, defaultToastOptions);
        break;
      case "info":
        toast.info(message, defaultToastOptions);
        break;
      default:
        toast(message, defaultToastOptions);
        break;
    }
  };

  return (
    <AppContext.Provider value={{ showToast, isOnline, user, logout }}>
      <ToastContainer />
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within ContextApp provider");
  }
  return context;
};