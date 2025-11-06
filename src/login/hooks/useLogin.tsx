// src/auth/hooks/useLogin.ts
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/ContextApp";
import type {  LoginData } from "../types/auth";
import { LoginEndPoint } from "../services/authService";

export const useLogin = () => {
  const { showToast, setUser } = useAppContext();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (user: LoginData) => LoginEndPoint.post(user),
    onSuccess: (result: any) => {
      const data = result?.data;
      if (data?.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        showToast(data.message || "Login successful!", "success");
        if (navigate) {
          navigate("/app/game/dashboard");
        }
      } else {
        showToast("No token received from server!", "error");
      }
    },
    onError: (error: any) => {
      const errorMsg = error?.response?.data?.message || error.message || "Login failed!";
      showToast(errorMsg, "error");
    },
  });
};