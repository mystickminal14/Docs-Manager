import APIClient from "../../services/apiClient";
import type {  User } from "../type/User";


export const FileEndpoint=new APIClient<User>('/files')
