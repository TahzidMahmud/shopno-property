import axios from 'axios';

const API_BASE_URL = '/api/property-queries';

// Configure axios defaults
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Set CSRF token from meta tag
const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (token) {
  axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
}

export interface PropertyQuery {
  id?: number;
  property_id: number;
  full_name: string;
  phone_number: string;
  email?: string;
  query: string;
  created_at?: string;
  updated_at?: string;
  property?: {
    id: number;
    title: string;
  };
}

export const propertyQueryService = {
  // Submit a property query (public)
  submit: async (data: {
    property_id: number;
    full_name: string;
    phone_number: string;
    email?: string;
    query: string;
  }): Promise<PropertyQuery> => {
    const response = await axios.post(API_BASE_URL, data);
    return response.data.data;
  },

  // Get all queries (admin only)
  getAll: async (): Promise<PropertyQuery[]> => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  },

  // Get single query (admin only)
  getById: async (id: number): Promise<PropertyQuery> => {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  // Delete query (admin only)
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/${id}`);
  },
};

