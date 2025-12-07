import AsyncStorage from '@react-native-async-storage/async-storage';

// API Base URL - update this to your Laravel server URL
// Use your computer's local IP for physical device testing (localhost won't work)
const API_BASE_URL = 'http://192.168.1.104:8000/api/v1';

// Storage keys
const AUTH_TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

interface User {
  id: number;
  name: string;
  phone: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Get stored auth token
export const getAuthToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem(AUTH_TOKEN_KEY);
};

// Store auth token
export const setAuthToken = async (token: string): Promise<void> => {
  await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
};

// Clear auth token
export const clearAuthToken = async (): Promise<void> => {
  await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  await AsyncStorage.removeItem(USER_KEY);
};

// Get stored user data
export const getStoredUser = async (): Promise<User | null> => {
  const userData = await AsyncStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

// Store user data
export const setStoredUser = async (user: User): Promise<void> => {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
};

// API request helper
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token = await getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};

// Login with Firebase ID token
export const loginWithFirebaseToken = async (
  firebaseIdToken: string
): Promise<LoginResponse> => {
  const response = await apiRequest<{ user: User; token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ token: firebaseIdToken }),
  });

  // Store the auth token and user data
  await setAuthToken(response.data.token);
  await setStoredUser(response.data.user);

  return response as LoginResponse;
};

// Logout
export const logout = async (): Promise<void> => {
  try {
    await apiRequest('/auth/logout', { method: 'POST' });
  } catch (error) {
    // Ignore logout errors, just clear local storage
    console.log('Logout API error:', error);
  }
  await clearAuthToken();
};

// Get user profile
export const getProfile = async (): Promise<ApiResponse<User>> => {
  return apiRequest<User>('/profile');
};

// Update user profile
export const updateProfile = async (
  data: Partial<User>
): Promise<ApiResponse<User>> => {
  const response = await apiRequest<User>('/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  // Update stored user data
  await setStoredUser(response.data);

  return response;
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  const token = await getAuthToken();
  return !!token;
};

export { API_BASE_URL };
