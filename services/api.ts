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

// Category types - 3 level hierarchy
// Level 2: Sub-subcategory (has products)
export interface SubSubcategory {
  id: string;
  name: string;
  description: string | null;
  parent_id: string;
  level: number;
  created_at: string;
  updated_at: string;
}

// Level 1: Subcategory (e.g., "Fruits & Vegetables")
export interface Subcategory {
  id: string;
  name: string;
  description: string | null;
  parent_id: string;
  level: number;
  created_at: string;
  updated_at: string;
  subcategories?: SubSubcategory[]; // Level 2 children
}

// Level 0: Top-level Category (e.g., "Grocery & Kitchen")
export interface Category {
  id: string;
  name: string;
  description: string | null;
  parent_id: string | null;
  level: number;
  created_at: string;
  updated_at: string;
  subcategories: Subcategory[]; // Level 1 children
}

// Get all categories with subcategories (Public)
export const getCategories = async (): Promise<ApiResponse<Category[]>> => {
  return apiRequest<Category[]>('/categories');
};

// Product types
export interface Product {
  id: string;
  sub_category_id: string;
  name: string;
  description: string | null;
  price: string;
  stock_quantity: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  subcategory?: Subcategory & {
    parent?: Category;
  };
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

// Get products with optional filters (Public)
export const getProducts = async (params?: {
  category_id?: string;
  sub_category_id?: string;
  sub_sub_category_id?: string;
  search?: string;
  per_page?: number;
  page?: number;
}): Promise<ApiResponse<PaginatedResponse<Product>>> => {
  const queryParams = new URLSearchParams();

  if (params?.category_id) queryParams.append('category_id', params.category_id);
  if (params?.sub_category_id) queryParams.append('sub_category_id', params.sub_category_id);
  if (params?.sub_sub_category_id) queryParams.append('sub_sub_category_id', params.sub_sub_category_id);
  if (params?.search) queryParams.append('search', params.search);
  if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
  if (params?.page) queryParams.append('page', params.page.toString());

  const queryString = queryParams.toString();
  const endpoint = `/products${queryString ? `?${queryString}` : ''}`;

  return apiRequest<PaginatedResponse<Product>>(endpoint);
};

// Cart types
export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product: Product;
}

export interface CartResponse {
  items: CartItem[];
  total: number;
}

// Add product to cart
export const addToCart = async (
  productId: string,
  quantity: number = 1
): Promise<ApiResponse<CartItem>> => {
  return apiRequest<CartItem>('/cart', {
    method: 'POST',
    body: JSON.stringify({ product_id: productId, quantity }),
  });
};

// Get cart items
export const getCart = async (): Promise<ApiResponse<CartResponse>> => {
  return apiRequest<CartResponse>('/cart');
};

// Update cart item quantity
export const updateCartItem = async (
  cartItemId: string,
  quantity: number
): Promise<ApiResponse<CartItem>> => {
  return apiRequest<CartItem>(`/cart/${cartItemId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  });
};

// Remove item from cart
export const removeFromCart = async (
  cartItemId: string
): Promise<ApiResponse<null>> => {
  return apiRequest<null>(`/cart/${cartItemId}`, {
    method: 'DELETE',
  });
};

// Address types
export interface Address {
  id: string;
  user_id: string;
  label: 'home' | 'work' | 'other';
  address_line: string;
  area_name: string;
  landmark: string | null;
  receiver_name: string;
  receiver_phone: string;
  latitude: number;
  longitude: number;
  pincode: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// Get user addresses
export const getAddresses = async (): Promise<ApiResponse<Address[]>> => {
  return apiRequest<Address[]>('/addresses');
};

// Get default address
export const getDefaultAddress = async (): Promise<ApiResponse<Address>> => {
  return apiRequest<Address>('/addresses/default');
};

// Create new address
export const createAddress = async (data: {
  label: 'home' | 'work' | 'other';
  address_line: string;
  area_name: string;
  landmark?: string;
  receiver_name: string;
  receiver_phone: string;
  latitude: number;
  longitude: number;
  pincode: string;
  is_default?: boolean;
}): Promise<ApiResponse<Address>> => {
  return apiRequest<Address>('/addresses', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Order types
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: string;
  product: Product;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'placed' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  total_amount: string;
  delivery_address: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

// Create order from cart
export const createOrder = async (data: {
  delivery_address: string;
}): Promise<ApiResponse<Order>> => {
  return apiRequest<Order>('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Get user orders
export const getOrders = async (params?: {
  per_page?: number;
  page?: number;
}): Promise<ApiResponse<PaginatedResponse<Order>>> => {
  const queryParams = new URLSearchParams();
  if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
  if (params?.page) queryParams.append('page', params.page.toString());

  const queryString = queryParams.toString();
  const endpoint = `/orders${queryString ? `?${queryString}` : ''}`;

  return apiRequest<PaginatedResponse<Order>>(endpoint);
};

// Get single order
export const getOrder = async (orderId: string): Promise<ApiResponse<Order>> => {
  return apiRequest<Order>(`/orders/${orderId}`);
};

// Payment types
export interface PaymentOrder {
  order_id: string;
  payment_id: string;
  gateway_order_id: string;
  key_id: string;
  amount: number;
  amount_display: number;
  currency: string;
}

export interface PaymentVerifyData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Create payment order
export const createPaymentOrder = async (data: {
  order_id: string;
  payment_method: 'online' | 'cod';
}): Promise<ApiResponse<PaymentOrder>> => {
  return apiRequest<PaymentOrder>('/payments/create-order', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Verify payment
export const verifyPayment = async (
  data: PaymentVerifyData
): Promise<ApiResponse<{ payment_id: string; status: string; order_id: string }>> => {
  return apiRequest<{ payment_id: string; status: string; order_id: string }>(
    '/payments/verify',
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
};

// Get payment status
export const getPaymentStatus = async (
  orderId: string
): Promise<ApiResponse<{ status: string; payment_method: string }>> => {
  return apiRequest<{ status: string; payment_method: string }>(
    `/payments/${orderId}/status`
  );
};

export { API_BASE_URL };
