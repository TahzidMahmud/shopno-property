import axios from 'axios';

const API_BASE_URL = '/api/partner-submissions';

// Configure axios defaults
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Set CSRF token from meta tag
const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (token) {
  axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
}

export interface PartnerSubmission {
  id?: number;
  full_name: string;
  company_name?: string;
  location: string;
  phone_number: string;
  email?: string;
  project_details: string;
  created_at?: string;
  updated_at?: string;
}

export interface PartnerSubmissionFormData {
  full_name: string;
  company_name?: string;
  location: string;
  phone_number: string;
  email?: string;
  project_details: string;
}

export const partnerSubmissionService = {
  // Submit a new partner submission (public route)
  submit: async (data: PartnerSubmissionFormData): Promise<PartnerSubmission> => {
    const response = await axios.post(API_BASE_URL, data);
    return response.data.data;
  },

  // Get all submissions (admin only)
  getAll: async (): Promise<PartnerSubmission[]> => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  },

  // Get single submission (admin only)
  getById: async (id: number): Promise<PartnerSubmission> => {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  // Delete submission (admin only)
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/${id}`);
  },
};


