import APIClient from "../../services/apiClient";
import type {  FileModel, PaginationParams, PaginationResponse, User } from "../type/User";


export const FileEndpoint=new APIClient<FileModel>('/files')
// Create a new instance for paginated users
const PaginatedUserClient = new APIClient<PaginationResponse<User>>("/files");

export const PaginatedUserEndpoint = {
  get: async (params: PaginationParams) => {
    const response = await PaginatedUserClient.get(undefined, { params });
    return response;
  },
};
