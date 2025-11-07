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

export const ChangeAccessTypeEndpoint = (fileShareId: string, accessType: "Public" | "Private") => {
  const client = new APIClient<FileModel>(`/files/update-access/${fileShareId}`);
  return client.put({ accessType } as any);
};

export const ChangeDisplayNameEndpoint = (fileShareId: string, displayName: string) => {
  const client = new APIClient<{ message: string }>(`/files/display-name/${fileShareId}`);
  return client.put({ displayName } as any);
};