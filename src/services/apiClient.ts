// src/api/APIClient.ts
import axios, { type AxiosRequestConfig } from "axios";
import { BASE_URL } from "../constants";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 5000,
  withCredentials: true, // ✅ important for cookie-based sessions
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
}

export default APIClient;
