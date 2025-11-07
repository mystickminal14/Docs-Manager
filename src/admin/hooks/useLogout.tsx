import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { LogoutEndPoint } from "../services/UserService"; // You’ll define this
import { useAppContext } from "../../context/ContextApp";

export const useLogout = () => {
  const navigate = useNavigate();
  const {  showToast } = useAppContext();
const queryClient=useQueryClient()
  return useMutation({
    mutationFn: async () => {
      // Call your API endpoint to logout
      const response = await LogoutEndPoint.delete();
      return response;
    },

    onSuccess: () => {
      // Clear user context and local storage
      localStorage.removeItem("user");
      localStorage.removeItem("role");
 queryClient.clear();
      // Redirect to login
      navigate("/");

      // Optional toast message
      showToast("Logged out successfully ✅", "success");
    },
    onError: (error: any) => {
      console.error("Logout failed:", error);
      showToast("Logout failed ❌", "error");
    },
  });
};
