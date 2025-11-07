// src/auth/services/authService.ts
import APIClient from "../../services/apiClient";
import type { LoginData } from "../types/auth";

export const LoginEndPoint=new APIClient<LoginData>('/auth/login')
export const RegisterEndPoint=new APIClient<LoginData>('/users/register')
