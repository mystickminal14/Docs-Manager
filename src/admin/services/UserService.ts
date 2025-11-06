import APIClient from "../../services/apiClient";
import type { ChangePassword, User } from "../type/User";


export const UserEndpoint=new APIClient<User>('/user')
export const ChangePasswordEndpoint=new APIClient<ChangePassword>('/change-password')
