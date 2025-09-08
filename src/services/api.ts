import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, APP_CONFIG } from '../constants/config';
import type { ApiResponse, ApiError } from '../types';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      async (config) => {
        try {
          const token = await AsyncStorage.getItem(APP_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.warn('Failed to get token from storage:', error);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling and token refresh
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // Handle 401 errors (token expired)
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = await AsyncStorage.getItem(APP_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
            
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken);
              const accessToken = response.data.access_token;
              
              await AsyncStorage.setItem(APP_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, accessToken);
              
              // Retry the original request with new token
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            await this.clearAuthData();
            // You might want to use navigation here to redirect to login
            console.warn('Token refresh failed, user needs to login again');
          }
        }

        return Promise.reject(this.transformError(error));
      }
    );
  }

  private async refreshToken(refreshToken: string) {
    return this.client.post('/api/v1/auth/refresh', {
      refreshToken,
    });
  }

  private async clearAuthData() {
    try {
      await AsyncStorage.multiRemove([
        APP_CONFIG.STORAGE_KEYS.ACCESS_TOKEN,
        APP_CONFIG.STORAGE_KEYS.REFRESH_TOKEN,
        APP_CONFIG.STORAGE_KEYS.USER_DATA,
      ]);
    } catch (error) {
      console.warn('Failed to clear auth data:', error);
    }
  }

  private transformError(error: AxiosError): ApiError {
    console.warn('API Error:', error);
    
    if (error.response?.data) {
      return error.response.data as ApiError;
    }

    return {
      success: false,
      message: error.message || 'Network error occurred',
    };
  }

  // Generic HTTP methods
  async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    const response = await this.client.get(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.client.post(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.client.put(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.client.delete(url);
    return response.data;
  }

  async patch<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.client.patch(url, data);
    return response.data;
  }

  // Upload method for files
  async upload<T>(url: string, formData: FormData): Promise<ApiResponse<T>> {
    const response = await this.client.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export const apiService = new ApiService();
