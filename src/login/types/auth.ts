// src/auth/types/auth.ts
export interface LoginData {
  username: string;
  password: string;
}

export interface UserModel {
 userId: string;
  fullName: string;
  username: string;
  status: "Active" | "Inactive"; // assuming status can toggle
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  deletedAt: string | null;
  role: "Admin" | "User"; 
}

export interface User {
  userId: string;
  fullName: string;
  username: string;
  status: "Active" | "Inactive"; // assuming status can toggle
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  deletedAt: string | null;
  role: "Admin" | "User"; // adjust based on your system roles
}
