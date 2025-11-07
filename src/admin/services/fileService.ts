import APIClient from "../../services/apiClient";
import type { FileModel, PaginationParams, PaginationResponse } from "../type/User";

export const FileEndpoint = new APIClient<FileModel>('/files');

// Create a new instance for paginated files
const PaginatedFileClient = new APIClient<PaginationResponse<FileModel>>("/files");

export const PaginatedFileEndpoint = {
  get: async (params: PaginationParams) => {
    const response = await PaginatedFileClient.get(undefined, { params });
    return response;
  },
};

export const DeleteFileEndpoint = (fileShareId: string) => {
  const client = new APIClient<{ message: string }>(`/files/${fileShareId}`);
  return client.delete();
};

export const ChangeAccessTypeEndpoint = (fileShareId: string, accessType: "Public" | "Closed") => {
  const client = new APIClient<FileModel>(`/files/update-access/${fileShareId}`);
  return client.put({ accessType } as any);
};

export const ChangeDisplayNameEndpoint = (fileShareId: string, displayName: string, category?: string ) => {
  const client = new APIClient<{ message: string }>(`/files/edit/${fileShareId}`);
  return client.put({ displayName, category } as any);
};
export const viewFile = (fileShareId: string, ) => {
  const client = new APIClient<{ message: string }>(`/files/shared-file/${fileShareId}`);
  return client.get();
}