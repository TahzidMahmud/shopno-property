import axios from 'axios';
import { Facility, FacilityFormData } from '../types/Facility';

const API_BASE_URL = '/api/facilities';

// Configure axios defaults
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Set CSRF token from meta tag
const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (token) {
  axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
}

export const facilityService = {
  // Get all facilities
  getAll: async (): Promise<Facility[]> => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  },

  // Get single facility
  getById: async (id: number): Promise<Facility> => {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  // Create new facility
  create: async (data: FacilityFormData): Promise<Facility> => {
    const formData = new FormData();

    // Append text fields
    formData.append('title', data.title);

    // Append image file
    if (data.image) {
      formData.append('image', data.image);
    }

    const response = await axios.post(API_BASE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Update facility
  update: async (id: number, data: FacilityFormData): Promise<Facility> => {
    const formData = new FormData();

    // Add method spoofing for PUT request
    formData.append('_method', 'PUT');

    // Append text fields
    formData.append('title', data.title);

    // Append image file only if it exists
    if (data.image) {
      formData.append('image', data.image);
    }

    const response = await axios.post(`${API_BASE_URL}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Delete facility
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/${id}`);
  },
};
