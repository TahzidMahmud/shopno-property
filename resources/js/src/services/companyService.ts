import axios from 'axios';

const API_BASE_URL = '/api/companies';

// Configure axios defaults
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Set CSRF token from meta tag
const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (token) {
  axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
}

export interface Company {
  id?: number;
  name: string;
  logo?: string;
  owner_name: string;
  created_at?: string;
  updated_at?: string;
}

export interface CompanyFormData {
  name: string;
  logo: File | null;
  owner_name: string;
}

export const companyService = {
  // Get all companies
  getAll: async (): Promise<Company[]> => {
    const response = await axios.get(API_BASE_URL, {
      withCredentials: true,
    });
    return response.data;
  },

  // Get single company
  getById: async (id: number): Promise<Company> => {
    const response = await axios.get(`${API_BASE_URL}/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },

  // Create company
  create: async (data: CompanyFormData): Promise<Company> => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('owner_name', data.owner_name);
    if (data.logo) {
      formData.append('logo', data.logo);
    }

    const response = await axios.post(API_BASE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
    return response.data.data;
  },

  // Update company
  update: async (id: number, data: CompanyFormData): Promise<Company> => {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('name', data.name);
    formData.append('owner_name', data.owner_name);
    if (data.logo) {
      formData.append('logo', data.logo);
    }

    const response = await axios.post(`${API_BASE_URL}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
    return response.data.data;
  },

  // Delete company
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/${id}`, {
      withCredentials: true,
    });
  },
};

