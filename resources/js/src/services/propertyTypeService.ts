import axios from 'axios';

const API_BASE_URL = '/api/property-types';

// Configure axios defaults
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Set CSRF token from meta tag
const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (token) {
  axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
}

export interface PropertyType {
  id?: number;
  name: string; // This is the label
  type_value: string;
  icon_name?: string;
  icon_image?: string;
  order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PropertyTypeFormData {
  name: string; // Label
  type_value: string;
  icon_name?: string;
  icon_image: File | null;
  order?: number;
  is_active?: boolean;
}

export const propertyTypeService = {
  // Get all property types
  getAll: async (): Promise<PropertyType[]> => {
    const response = await axios.get(API_BASE_URL, {
      withCredentials: true,
    });
    return response.data;
  },

  // Get active property types only
  getActive: async (): Promise<PropertyType[]> => {
    const response = await axios.get(API_BASE_URL, {
      withCredentials: true,
    });
    return response.data.filter((type: PropertyType) => type.is_active !== false);
  },

  // Get single property type
  getById: async (id: number): Promise<PropertyType> => {
    const response = await axios.get(`${API_BASE_URL}/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },

  // Create property type
  create: async (data: PropertyTypeFormData): Promise<PropertyType> => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('type_value', data.type_value);
    if (data.icon_name) {
      formData.append('icon_name', data.icon_name);
    }
    if (data.icon_image) {
      formData.append('icon_image', data.icon_image);
    }
    if (data.order !== undefined) {
      formData.append('order', data.order.toString());
    }
    if (data.is_active !== undefined) {
      formData.append('is_active', data.is_active ? '1' : '0');
    }

    const response = await axios.post(API_BASE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
    return response.data.data;
  },

  // Update property type
  update: async (id: number, data: PropertyTypeFormData): Promise<PropertyType> => {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('name', data.name);
    formData.append('type_value', data.type_value);
    if (data.icon_name) {
      formData.append('icon_name', data.icon_name);
    }
    if (data.icon_image) {
      formData.append('icon_image', data.icon_image);
    }
    if (data.order !== undefined) {
      formData.append('order', data.order.toString());
    }
    if (data.is_active !== undefined) {
      formData.append('is_active', data.is_active ? '1' : '0');
    }

    const response = await axios.post(`${API_BASE_URL}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
    return response.data.data;
  },

  // Delete property type
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/${id}`, {
      withCredentials: true,
    });
  },
};


