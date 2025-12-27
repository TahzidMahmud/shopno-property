import axios from 'axios';

const API_BASE_URL = '/api/users';

// Configure axios defaults
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Set CSRF token from meta tag
const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (token) {
  axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
}

export interface User {
  id?: number;
  name: string;
  email?: string;
  phone: string;
  is_banned: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserFormData {
  name: string;
  email?: string;
  phone: string;
  password?: string;
  is_banned?: boolean;
}

export const userService = {
  // Get all users
  getAll: async (): Promise<User[]> => {
    const response = await axios.get(API_BASE_URL, {
      withCredentials: true,
    });
    return response.data;
  },

  // Get single user
  getById: async (id: number): Promise<User> => {
    const response = await axios.get(`${API_BASE_URL}/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },

  // Create user
  create: async (data: UserFormData): Promise<User> => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('phone', data.phone);
    if (data.email) {
      formData.append('email', data.email);
    }
    if (data.password) {
      formData.append('password', data.password);
    }
    if (data.is_banned !== undefined) {
      formData.append('is_banned', data.is_banned ? '1' : '0');
    }

    const response = await axios.post(API_BASE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
    return response.data.data;
  },

  // Update user
  update: async (id: number, data: UserFormData): Promise<User> => {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('name', data.name);
    formData.append('phone', data.phone);
    if (data.email) {
      formData.append('email', data.email);
    }
    if (data.password) {
      formData.append('password', data.password);
    }
    if (data.is_banned !== undefined) {
      formData.append('is_banned', data.is_banned ? '1' : '0');
    }

    const response = await axios.post(`${API_BASE_URL}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
    return response.data.data;
  },

  // Delete user
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/${id}`, {
      withCredentials: true,
    });
  },

  // Ban user
  ban: async (id: number): Promise<User> => {
    const response = await axios.post(`${API_BASE_URL}/${id}/ban`, {}, {
      withCredentials: true,
    });
    return response.data.data;
  },

  // Unban user
  unban: async (id: number): Promise<User> => {
    const response = await axios.post(`${API_BASE_URL}/${id}/unban`, {}, {
      withCredentials: true,
    });
    return response.data.data;
  },
};

