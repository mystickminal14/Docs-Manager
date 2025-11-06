// src/shared/services/api-client.ts
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

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/";
    }
    if (error.response?.status >= 500) {
      console.error("Server error:", error);
    }
    
    return Promise.reject(error);
  }
);

class APIClient<T, R = any> {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  getAll = async (params?: any, config?: AxiosRequestConfig): Promise<R[]> => {
    const url = params ? `${this.endpoint}/${params}` : this.endpoint;
    const response = await axiosInstance.get<R[]>(url, config);
    return response.data;
  };

  get = async (params?: any, config?: AxiosRequestConfig): Promise<R> => {
    const url = params ? `${this.endpoint}/${params}` : this.endpoint;
    const response = await axiosInstance.get<R>(url, config);
    return response.data;
  };

  post = async (data?: T, config?: AxiosRequestConfig): Promise<R> => {
    const response = await axiosInstance.post<R>(this.endpoint, data, config);
    return response.data;
  };

  delete = async (params?: any, config?: AxiosRequestConfig): Promise<R> => {
    const url = params ? `${this.endpoint}/${params}` : this.endpoint;
    const response = await axiosInstance.delete<R>(url, config);
    return response.data;
  };

  put = async (data: T, params?: any, config?: AxiosRequestConfig): Promise<R> => {
    const url = params ? `${this.endpoint}/${params}` : this.endpoint;
    const response = await axiosInstance.put<R>(url, data, config);
    return response.data;
  };
}

export default APIClient;