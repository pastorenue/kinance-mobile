import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from './api';
import { APP_CONFIG, ENDPOINTS } from '../constants/config';
import type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  User,
  AuthTokens,
  ApiResponse,
} from '../types';

class AuthService {
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiService.post<LoginResponse>(
      ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    if (response.success) {
      await this.storeAuthData(response.data);
    }

    return response;
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiService.post<LoginResponse>(
      ENDPOINTS.AUTH.REGISTER,
      userData
    );

    if (response.success) {
      await this.storeAuthData(response.data);
    }

    return response;
  }

  async logout(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        APP_CONFIG.STORAGE_KEYS.ACCESS_TOKEN,
        APP_CONFIG.STORAGE_KEYS.REFRESH_TOKEN,
        APP_CONFIG.STORAGE_KEYS.USER_DATA,
      ]);
    } catch (error) {
      console.warn('Error during logout:', error);
    }
  }

  async refreshToken(): Promise<ApiResponse<AuthTokens>> {
    const refreshToken = await AsyncStorage.getItem(APP_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiService.post<AuthTokens>(
      ENDPOINTS.AUTH.REFRESH,
      { refresh_token: refreshToken }
    );

    if (response.success) {
      await this.storeTokens(response.data);
    }

    return response;
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(APP_CONFIG.STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.warn('Error getting current user:', error);
      return null;
    }
  }

  async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(APP_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
    } catch (error) {
      console.warn('Error getting access token:', error);
      return null;
    }
  }

  async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(APP_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.warn('Error getting refresh token:', error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem(APP_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
      const user = await AsyncStorage.getItem(APP_CONFIG.STORAGE_KEYS.USER_DATA);
      return !!(token && user);
    } catch (error) {
      console.warn('Error checking authentication status:', error);
      return false;
    }
  }

  private async storeAuthData(data: LoginResponse): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [APP_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, data.access_token],
        [APP_CONFIG.STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token],
        [APP_CONFIG.STORAGE_KEYS.USER_DATA, JSON.stringify(data.user)],
      ]);
    } catch (error) {
      console.error('Error storing auth data:', error);
      throw error;
    }
  }

  private async storeTokens(tokens: AuthTokens): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [APP_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, tokens.access_token],
        [APP_CONFIG.STORAGE_KEYS.REFRESH_TOKEN, tokens.refresh_token],
      ]);
    } catch (error) {
      console.error('Error storing tokens:', error);
      throw error;
    }
  }

  async updateUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(
        APP_CONFIG.STORAGE_KEYS.USER_DATA,
        JSON.stringify(user)
      );
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
