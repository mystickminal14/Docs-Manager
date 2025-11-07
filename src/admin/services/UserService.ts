import APIClient from "../../services/apiClient";
import type { UserIdModel } from "../hooks/useEnableUser";
import type { ChangePassword, PaginationParams, PaginationResponse, User } from "../type/User";

export const UserEndpoint = new APIClient<User>("/user");
export const LogoutEndPoint=new APIClient('/auth/logout')

export const UserEndpointRegister = new APIClient<User>("/users/register");
export const DisableUser = new APIClient<UserIdModel>("/users/disable");
export const EnableUser = new APIClient<UserIdModel>("/users/enable");

export const ChangePasswordEndpoint = (uid: string, passwordData: { password: string }) => {
  const client = new APIClient<ChangePassword>(`/users/change-password/${uid}`);
  return client.post(passwordData);
};

// Create a new instance for paginated users
// src/features/users/services/UserService.ts
const PaginatedUserClient = new APIClient<PaginationResponse<User>>("/users");

export const PaginatedUserEndpoint = {
  get: async (params: PaginationParams) => {
    const response = await PaginatedUserClient.get(undefined, { params });
    return response;
  },
};

