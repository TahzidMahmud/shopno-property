import axios from 'axios';

const API_BASE_URL = '/api';

// Configure axios defaults
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Set CSRF token from meta tag
const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (token) {
  axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  phone: string;
  email?: string;
  password: string;
  location?: string;
}

export interface User {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  roles?: string[];
  permissions?: string[];
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Get stored token from localStorage
export const getStoredToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Set token in localStorage and axios headers
export const setAuthToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem('auth_token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('auth_token');
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Initialize axios with stored token on app load
const storedToken = getStoredToken();
if (storedToken) {
  setAuthToken(storedToken);
}

// Add axios interceptor to handle 401 errors (unauthorized)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear it
      setAuthToken(null);
      // Redirect to login if not already there
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(`${API_BASE_URL}/login`, credentials);
    const { token, user } = response.data;
    setAuthToken(token);
    return { token, user };
  },

  // Register
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(`${API_BASE_URL}/register`, credentials);
    const { token, user } = response.data;
    setAuthToken(token);
    return { token, user };
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await axios.post(`${API_BASE_URL}/logout`);
    } catch (error) {
      // Even if logout fails on server, clear local token
      console.error('Logout error:', error);
    } finally {
      setAuthToken(null);
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await axios.get<User>(`${API_BASE_URL}/user`);
      return response.data;
    } catch (error) {
      setAuthToken(null);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!getStoredToken();
  },
};

