export interface User {
  fullName: string;
  userId?: string;
  username: string;
  password: string;
  role?: "Admin" | "User";
  status?: "Active" | "Inactive";
}

export interface ChangePassword {
  password: string;
}

export interface Info {
  total: number;
  lastPage: number;
  category?: "CategoryA" | "CategoryB" | "CategoryC" | "CategoryD" | "CategoryE";
  prev: number | null;
  next: number | null;
}

export interface PaginationResponse<T> {
  data: T[];
  info: Info;
}

export interface FileModel {
  fileShareId: string;
  fileName: string;
  filePath: string;
  accessType: "Public" | "Private";
  sharedBy: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  category: "CategoryA" | "CategoryB" | "CategoryC" | "CategoryD" | "CategoryE";
  displayName?: string;
  status?: "Active" | "Inactive";
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  seed?: string;
  status?: "active" | "inactive";
}