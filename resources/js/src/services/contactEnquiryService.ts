import axios from 'axios';

const API_BASE_URL = '/api/contact-enquiries';

// Configure axios defaults
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Set CSRF token from meta tag
const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (token) {
  axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
}

export interface ContactEnquiry {
  id?: number;
  full_name: string;
  phone_number: string;
  email: string;
  project?: string;
  message?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ContactEnquiryFormData {
  full_name: string;
  phone_number: string;
  email: string;
  project?: string;
  message?: string;
}

export const contactEnquiryService = {
  // Submit a contact enquiry (public)
  submit: async (data: ContactEnquiryFormData): Promise<ContactEnquiry> => {
    const response = await axios.post(API_BASE_URL, data, {
      withCredentials: true,
    });
    return response.data.data;
  },

  // Get all enquiries (admin only)
  getAll: async (): Promise<ContactEnquiry[]> => {
    const response = await axios.get(API_BASE_URL, {
      withCredentials: true,
    });
    return response.data;
  },

  // Get single enquiry (admin only)
  getById: async (id: number): Promise<ContactEnquiry> => {
    const response = await axios.get(`${API_BASE_URL}/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },

  // Delete enquiry (admin only)
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/${id}`, {
      withCredentials: true,
    });
  },
};

