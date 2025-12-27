import axios from 'axios';

const API_BASE_URL = '/api/permissions';
const USER_API_BASE_URL = '/api/users';

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

export interface UserPermissions {
  roles: Role[];
  permissions: Permission[];
  direct_permissions: Permission[];
}

export const permissionService = {
  // Get all permissions
  getAllPermissions: async (): Promise<Permission[]> => {
    const response = await axios.get(API_BASE_URL, {
      withCredentials: true,
    });
    return response.data;
  },

  // Get all roles
  getAllRoles: async (): Promise<Role[]> => {
    const response = await axios.get(`${API_BASE_URL}/roles`, {
      withCredentials: true,
    });
    return response.data;
  },

  // Get user permissions
  getUserPermissions: async (userId: number): Promise<UserPermissions> => {
    const response = await axios.get(`${USER_API_BASE_URL}/${userId}/permissions`, {
      withCredentials: true,
    });
    return response.data;
  },

  // Assign role to user
  assignRole: async (userId: number, roleName: string): Promise<void> => {
    await axios.post(
      `${USER_API_BASE_URL}/${userId}/roles`,
      { role: roleName },
      { withCredentials: true }
    );
  },

  // Remove role from user
  removeRole: async (userId: number, roleName: string): Promise<void> => {
    await axios.delete(`${USER_API_BASE_URL}/${userId}/roles`, {
      data: { role: roleName },
      withCredentials: true,
    });
  },

  // Assign permission to user
  assignPermission: async (userId: number, permissionName: string): Promise<void> => {
    await axios.post(
      `${USER_API_BASE_URL}/${userId}/permissions`,
      { permission: permissionName },
      { withCredentials: true }
    );
  },

  // Remove permission from user
  removePermission: async (userId: number, permissionName: string): Promise<void> => {
    await axios.delete(`${USER_API_BASE_URL}/${userId}/permissions`, {
      data: { permission: permissionName },
      withCredentials: true,
    });
  },

  // Sync roles for user
  syncRoles: async (userId: number, roles: string[]): Promise<void> => {
    await axios.put(
      `${USER_API_BASE_URL}/${userId}/roles`,
      { roles },
      { withCredentials: true }
    );
  },

  // Sync permissions for user
  syncPermissions: async (userId: number, permissions: string[]): Promise<void> => {
    await axios.put(
      `${USER_API_BASE_URL}/${userId}/permissions`,
      { permissions },
      { withCredentials: true }
    );
  },
};


