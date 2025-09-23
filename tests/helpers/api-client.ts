import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { testEnv } from '../config/test-env';

export interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export class ApiClient {
  private client: AxiosInstance;
  private authToken?: string;

  constructor(config?: ApiClientConfig) {
    this.client = axios.create({
      baseURL: config?.baseURL || testEnv.API_URL,
      timeout: config?.timeout || testEnv.API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use((config) => {
      if (this.authToken) {
        config.headers.Authorization = `Bearer ${this.authToken}`;
      }
      return config;
    });
  }

  setAuthToken(token: string): void {
    this.authToken = token;
  }

  clearAuthToken(): void {
    this.authToken = undefined;
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config);
  }

  // Multipart form data upload
  async uploadFile<T = any>(url: string, file: Buffer | string, filename: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const formData = new FormData();
    
    if (typeof file === 'string' || file instanceof Buffer) {
      // Create a proper Blob for file data
      const fileData = typeof file === 'string' ? new TextEncoder().encode(file) : file;
      const arrayBuffer = fileData.buffer.slice(fileData.byteOffset, fileData.byteOffset + fileData.byteLength);
      const blob = new Blob([arrayBuffer as ArrayBuffer], { type: 'application/octet-stream' });
      formData.append('photo', blob, filename);
    }

    return this.client.post<T>(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    });
  }
}

// Export a default instance
export const apiClient = new ApiClient();