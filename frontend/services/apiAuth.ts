import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '@/services/baseUrl';

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  age?: number;
  weight?: number;
  height?: number;
  gender?: string;
}

export interface ApiResponse<T = any> {
  success: boolean; 
  message?: string; 
  data?: T;
  token?: string;
}

export interface LoginResponse extends ApiResponse<User> {
  token: string;
  data: User; 
}

export interface RegisterResponse extends ApiResponse<User> {
  token?: string;
  data: User; 
}

const extractUserFromResponse = (response: ApiResponse<User>): User => {
  if (response.data && typeof response.data === 'object' && 'id' in response.data) {
    return response.data as User; 
  }
  throw new Error('Invalid response: No user data found');
};

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female' | 'other';
}

export interface UpdateProfileData {
  name?: string;
  age?: number;
}

const API_BASE = 'https://thegt.my.id';

const getAuthConfig = async (extraHeaders?: AxiosRequestConfig['headers']): Promise<AxiosRequestConfig> => {
  const token = await AsyncStorage.getItem('token');
  return {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': token ? `Bearer ${token}` : undefined,
      ...extraHeaders,
    },
    validateStatus: (status) => true,
  };
};

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    validateStatus: (status) => true,
  };

  console.log('Login request:', { endpoint: '/api/login', credentials }); // Debug log

  try {
    const response: AxiosResponse<LoginResponse> = await client.post('/api/login', credentials, config);

    console.log('Login response status:', response.status); 
    console.log('Login response data:', response.data); 

    if (!response.data.success) {
      throw new Error(response.data.message || 'Login failed');
    }

    if (response.data.token) {
      await Promise.all([
        AsyncStorage.setItem('token', response.data.token),
        AsyncStorage.setItem('userData', JSON.stringify(response.data.data)), // Nested "data" as user
      ]);
      client.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      console.log('Login success: Token and user stored'); 
    } else {
      throw new Error('No token received');
    }

    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const errorMessage = err.response?.data?.message || err.response?.data || 'Login error';
      console.error('Login Axios error:', errorMessage); // Debug log
      throw new Error(errorMessage);
    }
    console.error('Login unexpected error:', err); // Debug log
    throw err;
  }
};

// Updated register: Similar fixes (assuming same response structure)
export const register = async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    validateStatus: (status) => true,
  };

  try {
    const response: AxiosResponse<RegisterResponse> = await client.post('/api/register', credentials, config);

    console.log('Register response data:', response.data); // Debug log

    // Updated: Check response.data.success
    if (!response.data.success) {
      throw new Error(response.data.message || 'Registration failed');
    }

    // Updated: Store from nested "data"
    if (response.data.token && response.data.data) {
      await Promise.all([
        AsyncStorage.setItem('token', response.data.token),
        AsyncStorage.setItem('userData', JSON.stringify(response.data.data)),
      ]);
      client.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }

    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const errorMessage = err.response?.data?.message || err.response?.data || 'Registration error';
      throw new Error(errorMessage);
    }
    throw err;
  }
};

// Updated getProfile: Check "success"; extract from "data"
export const getProfile = async (): Promise<User> => {
  const config = await getAuthConfig();

  try {
    const response: AxiosResponse<ApiResponse<User>> = await client.get('/api/user/profile', config);

    console.log('Profile response data:', response.data); // Debug log

    // Updated: Check response.data.success
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch profile');
    }

    return extractUserFromResponse(response.data);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const errorMessage = err.response?.data?.message || err.response?.data || 'Profile fetch error';
      if (err.response?.status === 401) {
        await logout();
      }
      throw new Error(errorMessage);
    }
    throw err;
  }
};

// Updated updateProfile: Similar fixes
export const updateProfile = async (data: UpdateProfileData): Promise<User> => {
  const config = await getAuthConfig({
    'Content-Type': 'application/json',
  });

  try {
    const response: AxiosResponse<ApiResponse<User>> = await client.put('/api/user/profile', data, config);

    console.log('Update profile response data:', response.data); // Debug log

    // Updated: Check response.data.success
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to update profile');
    }

    const updatedUser  = extractUserFromResponse(response.data);

    await AsyncStorage.setItem('userData', JSON.stringify(updatedUser ));

    return updatedUser ;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const errorMessage = err.response?.data?.message || err.response?.data || 'Profile update error';
      if (err.response?.status === 401) {
        await logout();
      }
      throw new Error(errorMessage);
    }
    throw err;
  }
};

// Updated isLoggedIn: No change needed, but added log
export const isLoggedIn = async (): Promise<boolean> => {
  try {
    const [token, userData] = await Promise.all([
      AsyncStorage.getItem('token'),
      AsyncStorage.getItem('userData'),
    ]);
    const loggedIn = !!(token && userData);
    console.log('isLoggedIn check:', loggedIn); // Debug log
    return loggedIn;
  } catch (error) {
    console.error('isLoggedIn error:', error);
    return false;
  }
};

// Updated logout: No change needed
export const logout = async (): Promise<void> => {
  await Promise.all([
    AsyncStorage.removeItem('token'),
    AsyncStorage.removeItem('userData'),
  ]);
  delete client.defaults.headers.common['Authorization'];
  console.log('User  logged out'); // Debug log
};

// Optional: Add getStoredUser  if not already (for displaying name in UI)
export const getStoredUser  = async (): Promise<User | null> => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    return userData ? JSON.parse(userData) as User : null;
  } catch (error) {
    console.error('Error getting stored user:', error);
    return null;
  }
};