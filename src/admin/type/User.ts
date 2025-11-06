export interface User {
  id: number;
  fullName: string;
  email: string;
  password: string;
  role: "admin" | "user";
  status: "active" | "inactive";
}

export interface ChangePassword{
    password:string
}