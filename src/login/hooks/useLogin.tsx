// src/auth/hooks/useLogin.ts
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/ContextApp";
import type { LoginData } from "../types/auth";
import { LoginEndPoint } from "../services/authService";

export const useLogin = (category?: string) => {
  const { showToast } = useAppContext();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (user: LoginData) => LoginEndPoint.post(user),

    onSuccess: (data: any) => {
      if (data?.role) {
        localStorage.setItem("role", data.role);
        showToast(data.message || "Login successful!", "success");

        const role = data.role;
        console.log(data.role)
        if (role === "Admin") {
          console.log('FaCheck')
          navigate("/app/manage-files");
        } else if (role === "User") {
          console.log(role)
          if (category)
            navigate(`/dashboard/${category.charAt(0).toUpperCase() + category.slice(1)}`);
          else
            navigate("/dashboard");

        }
        else {
          showToast("Unexpected role received from server!", "error");
        }
      } else {
        showToast("Unexpected response from server!", "error");
      }
    },

    onError: (error: any) => {
      if (error.response?.status === 401) {
        showToast("Invalid credentials. Please try again.", "error");
      } else if (error.response?.status === 403) {
        showToast("You do not have permission to access this resource.", "error");
      } else if (error.response?.status === 500) {
        showToast("Server error. Please try again later.", "error");
      } else {
        showToast(error.response?.data?.message || "Login failed!", "error");
      }
      console.error("Login Error:", error);
    },
  });
};
