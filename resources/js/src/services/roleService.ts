import axios from 'axios';

const API_BASE_URL = '/api/roles';

// Configure axios defaults
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Set CSRF token from meta tag
const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (token) {
  axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
}

export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at?: string;
  updated_at?: string;
}

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  permissions?: Permission[];
  created_at?: string;
  updated_at?: string;
}

export interface RoleFormData {
  name: string;
  permissions: string[];
}

export const roleService = {
  // Get all roles
  getAll: async (): Promise<Role[]> => {
    const response = await axios.get(API_BASE_URL, {
      withCredentials: true,
    });
    return response.data;
  },

  // Get single role
  getById: async (id: number): Promise<Role> => {
    const response = await axios.get(`${API_BASE_URL}/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },

  // Get all permissions
  getPermissions: async (): Promise<Permission[]> => {
    const response = await axios.get(`${API_BASE_URL}/permissions`, {
      withCredentials: true,
    });
    return response.data;
  },

  // Create role
  create: async (data: RoleFormData): Promise<Role> => {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.permissions && data.permissions.length > 0) {
      data.permissions.forEach((perm) => {
        formData.append('permissions[]', perm);
      });
    }

    const response = await axios.post(API_BASE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
    return response.data.data;
  },

  // Update role
  update: async (id: number, data: RoleFormData): Promise<Role> => {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('name', data.name);
    if (data.permissions && data.permissions.length > 0) {
      data.permissions.forEach((perm) => {
        formData.append('permissions[]', perm);
      });
    } else {
      // If no permissions selected, send empty array
      formData.append('permissions[]', '');
    }

    const response = await axios.post(`${API_BASE_URL}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
    return response.data.data;
  },

  // Delete role
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/${id}`, {
      withCredentials: true,
    });
  },
};


