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
  prev: number | null;
  category?:
    | "CategoryA"
    | "CategoryB"
    | "CategoryC"
    | "CategoryD"
    | "CategoryE";

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
  accessType: "Public" | "Closed";
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
   category?: "CategoryA" | "CategoryB" | "CategoryC" | "CategoryD" | "CategoryE";
  status?: "active" | "inactive";
}
type Category =
  | "CategoryA"
  | "CategoryB"
  | "CategoryC"
  | "CategoryD"
  | "CategoryE";

export interface FileModel {
  id: number;
  name: string;
  category: Category;
  uploadedAt: string;
  displayName?: string;
}
