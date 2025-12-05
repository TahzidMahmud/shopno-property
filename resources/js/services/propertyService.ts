import axios from 'axios';
import { Property, PropertyFormData } from '../types/Property';

const API_BASE_URL = '/api/properties';

// Configure axios defaults
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Set CSRF token from meta tag
const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (token) {
  axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
}

export const propertyService = {
  // Get all properties
  getAll: async (): Promise<Property[]> => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  },

  // Get single property
  getById: async (id: number): Promise<Property> => {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  // Create new property
  create: async (data: PropertyFormData): Promise<Property> => {
    const formData = new FormData();

    // Append text fields
    formData.append('title', data.title);
    formData.append('status', data.status);
    formData.append('area', data.area);
    formData.append('location', data.location);
    formData.append('type', data.type);
    formData.append('total_floor', data.total_floor.toString());
    formData.append('total_flat', data.total_flat.toString());
    formData.append('flat_size', data.flat_size.toString());
    formData.append('total_parking', data.total_parking.toString());
    formData.append('price_range', data.price_range);
    formData.append('full_address', data.full_address);
    formData.append('under_development', data.under_development);
    formData.append('bedrooms', data.bedrooms.toString());
    formData.append('bathrooms', data.bathrooms.toString());
    formData.append('company_name', data.company_name);

    // Append key_transports array
    data.key_transports.forEach((transport, index) => {
      formData.append(`key_transports[${index}]`, transport);
    });

    // Append facilities array
    data.facilities.forEach((facilityId, index) => {
      formData.append(`facilities[${index}]`, facilityId.toString());
    });

    // Append files
    if (data.main_image) {
      formData.append('main_image', data.main_image);
    }

    if (data.demo_video) {
      formData.append('demo_video', data.demo_video);
    }

    // Append multiple files
    data.layout_images.forEach((file, index) => {
      formData.append(`layout_images[${index}]`, file);
    });

    data.gallery_images.forEach((file, index) => {
      formData.append(`gallery_images[${index}]`, file);
    });

    const response = await axios.post(API_BASE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Update property
  update: async (id: number, data: PropertyFormData): Promise<Property> => {
    const formData = new FormData();

    // Add method spoofing for PUT request
    formData.append('_method', 'PUT');

    // Append text fields
    formData.append('title', data.title);
    formData.append('status', data.status);
    formData.append('area', data.area);
    formData.append('location', data.location);
    formData.append('type', data.type);
    formData.append('total_floor', data.total_floor.toString());
    formData.append('total_flat', data.total_flat.toString());
    formData.append('flat_size', data.flat_size.toString());
    formData.append('total_parking', data.total_parking.toString());
    formData.append('price_range', data.price_range);
    formData.append('full_address', data.full_address);
    formData.append('under_development', data.under_development);
    formData.append('bedrooms', data.bedrooms.toString());
    formData.append('bathrooms', data.bathrooms.toString());
    formData.append('company_name', data.company_name);

    // Append key_transports array
    data.key_transports.forEach((transport, index) => {
      formData.append(`key_transports[${index}]`, transport);
    });

    // Append facilities array
    data.facilities.forEach((facilityId, index) => {
      formData.append(`facilities[${index}]`, facilityId.toString());
    });

    // Append files only if they exist
    if (data.main_image) {
      formData.append('main_image', data.main_image);
    }

    if (data.demo_video) {
      formData.append('demo_video', data.demo_video);
    }

    // Append multiple files
    data.layout_images.forEach((file, index) => {
      formData.append(`layout_images[${index}]`, file);
    });

    data.gallery_images.forEach((file, index) => {
      formData.append(`gallery_images[${index}]`, file);
    });

    const response = await axios.post(`${API_BASE_URL}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Delete property
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/${id}`);
  },
};
