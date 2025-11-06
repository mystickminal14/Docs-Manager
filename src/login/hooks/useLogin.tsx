// src/auth/hooks/useLogin.ts
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/ContextApp";
import type { LoginData } from "../types/auth";
import { LoginEndPoint } from "../services/authService";

export const useLogin = () => {
  const { showToast,  } = useAppContext();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (user: LoginData) => LoginEndPoint.post(user),
    onSuccess: (result: any) => {
      const data = result;

      if (data?.error) {
        showToast(data.error, "error");
        return;
      }

      if (data?.role) {
        console.log("Role:", data.role);

        localStorage.setItem("role", data.role); // Store role separately
        
        showToast(data.message || "Login successful!", "success");

        const role = data.role.toLowerCase();
        if (role === "admin") {
          navigate("/app/admin");
        } else if (role === "user") {
          navigate("/app/dashboard");
        } else {
          showToast("Unexpected role received from server!", "error");
        }
      } else {
        showToast("Unexpected response from server!", "error");
      }
    },

    onError: (error: any) => {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Login failed!";
      showToast(errorMsg, "error");
    },
  });
};