import axios from 'axios';

const API_BASE_URL = '/api/property-listings';

// Configure axios defaults
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Set CSRF token from meta tag
const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (token) {
  axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
}

// Get stored token from localStorage
const getStoredToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Set token in axios headers
const setAuthToken = (token: string | null): void => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Initialize axios with stored token
const storedToken = getStoredToken();
if (storedToken) {
  setAuthToken(storedToken);
}

export interface PropertyListing {
  id?: number;
  property_name: string;
  property_type?: string;
  property_status?: string;
  location: string;
  size?: string;
  images?: string[];
  brochure?: string;
  handover_date?: string;
  price?: number;
  user_id?: number;
  status?: 'pending' | 'approved' | 'rejected';
  created_at?: string;
  updated_at?: string;
}

export interface PropertyListingFormData {
  property_name: string;
  property_type?: string;
  property_status?: string;
  location: string;
  size?: string;
  images?: File[];
  brochure?: File | null;
  handover_date?: string;
  price?: number;
}

export const propertyListingService = {
  // Get all property listings
  getAll: async (): Promise<PropertyListing[]> => {
    const response = await axios.get(API_BASE_URL, {
      withCredentials: true,
    });
    return response.data;
  },

  // Get single property listing
  getById: async (id: number): Promise<PropertyListing> => {
    const response = await axios.get(`${API_BASE_URL}/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },

  // Create property listing
  create: async (data: PropertyListingFormData): Promise<PropertyListing> => {
    const formData = new FormData();
    formData.append('property_name', data.property_name);
    if (data.property_type) {
      formData.append('property_type', data.property_type);
    }
    if (data.property_status) {
      formData.append('property_status', data.property_status);
    }
    formData.append('location', data.location);
    if (data.size) {
      formData.append('size', data.size);
    }
    if (data.handover_date) {
      formData.append('handover_date', data.handover_date);
    }
    if (data.price !== undefined) {
      formData.append('price', data.price.toString());
    }
    
    // Append multiple images
    if (data.images && data.images.length > 0) {
      data.images.forEach((image) => {
        formData.append('images[]', image);
      });
    }
    
    // Append brochure if provided
    if (data.brochure) {
      formData.append('brochure', data.brochure);
    }

    const response = await axios.post(API_BASE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
    return response.data.data;
  },

  // Update property listing
  update: async (id: number, data: Partial<PropertyListingFormData>): Promise<PropertyListing> => {
    const formData = new FormData();
    
    if (data.property_name) {
      formData.append('property_name', data.property_name);
    }
    if (data.property_type !== undefined) {
      formData.append('property_type', data.property_type || '');
    }
    if (data.property_status !== undefined) {
      formData.append('property_status', data.property_status || '');
    }
    if (data.location) {
      formData.append('location', data.location);
    }
    if (data.size !== undefined) {
      formData.append('size', data.size || '');
    }
    if (data.handover_date) {
      formData.append('handover_date', data.handover_date);
    }
    if (data.price !== undefined) {
      formData.append('price', data.price.toString());
    }
    
    if (data.images && data.images.length > 0) {
      data.images.forEach((image) => {
        formData.append('images[]', image);
      });
    }
    
    if (data.brochure) {
      formData.append('brochure', data.brochure);
    }

    const response = await axios.put(`${API_BASE_URL}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
    return response.data.data;
  },

  // Delete property listing
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/${id}`, {
      withCredentials: true,
    });
  },

  // Update listing status
  updateStatus: async (id: number, status: 'pending' | 'approved' | 'rejected'): Promise<PropertyListing> => {
    const response = await axios.post(
      `${API_BASE_URL}/${id}/status`,
      { status },
      { withCredentials: true }
    );
    return response.data.data;
  },
};

