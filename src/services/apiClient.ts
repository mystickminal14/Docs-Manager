// src/services/apiClient.ts
import axios, { type AxiosRequestConfig } from "axios";
import { BASE_URL } from "../constants";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

class APIClient<T> {
  endpoint: string;


  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  getAll = async (params?: any, config?: AxiosRequestConfig) => {
    const url = params ? `${this.endpoint}/${params}` : this.endpoint;
    const response = await axiosInstance.get<T[]>(url, config);
    return response.data;
  };

  get = async (params?: any, config?: AxiosRequestConfig) => {
    const url = params ? `${this.endpoint}/${params}` : this.endpoint;
    const response = await axiosInstance.get<T>(url, config);
    return response.data;
  };

  post = async (data: T, config?: AxiosRequestConfig) => {
    const response = await axiosInstance.post<T>(this.endpoint, data, config);
    return response.data;
  };

  delete = async (params?: any, config?: AxiosRequestConfig) => {
    const url = params ? `${this.endpoint}/${params}` : this.endpoint;
    const response = await axiosInstance.delete<T>(url, config);
    return response.data;
  };

  put = async (data: T, params?: any, config?: AxiosRequestConfig) => {
    const url = params ? `${this.endpoint}/${params}` : this.endpoint;
    const response = await axiosInstance.put<T>(url, data, config);
    return response.data;
  };

  // ✅ New: file upload method
  // ✅ Updated upload method to include category & displayName
upload = async (
  files: File[],
  category: string,
  displayName?: string,
  config?: AxiosRequestConfig
) => {
  const formData = new FormData();

  // Append all files
  files.forEach((file) => formData.append("sharedFiles", file));

  // Append additional fields
  formData.append("category", category);
  if (displayName) formData.append("displayName", displayName);

  const response = await axiosInstance.post<T>(
    this.endpoint,
    formData,
    {
      ...config,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

}

export default APIClient;
