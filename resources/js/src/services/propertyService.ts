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
    const response = await axios.get(API_BASE_URL, {
      withCredentials: true,
    });
    return response.data;
  },

  // Get single property
  getById: async (id: number): Promise<Property> => {
    const response = await axios.get(`${API_BASE_URL}/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },

  // Create new property
  create: async (data: PropertyFormData): Promise<Property> => {
    const formData = new FormData();

    // Append text fields
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('status', data.status);
    formData.append('area', data.area);
    formData.append('location', data.location);
    formData.append('type', data.type);
    formData.append('property_category', data.property_category);
    formData.append('total_floor', data.total_floor.toString());
    formData.append('total_flat', data.total_flat.toString());
    formData.append('flat_size', data.flat_size.toString());
    formData.append('total_parking', data.total_parking.toString());
    formData.append('land', data.land);
    formData.append('building_height', data.building_height);
    if (data.hand_over_date) {
      formData.append('hand_over_date', data.hand_over_date);
    }
    formData.append('face', data.face);
    formData.append('road', data.road);
    if (data.price !== '') {
      formData.append('price', data.price.toString());
    }
    formData.append('full_address', data.full_address);
    if (data.latitude !== '') formData.append('latitude', data.latitude.toString());
    if (data.longitude !== '') formData.append('longitude', data.longitude.toString());
    formData.append('under_development', data.under_development);
    formData.append('bedrooms', data.bedrooms.toString());
    formData.append('bathrooms', data.bathrooms.toString());
    if (data.company_id !== '') {
      formData.append('company_id', data.company_id.toString());
    }

    // Append key_transports array as objects
    data.key_transports.forEach((transport, index) => {
      formData.append(`key_transports[${index}][name]`, transport.name);
      formData.append(`key_transports[${index}][icon]`, transport.icon);
      formData.append(`key_transports[${index}][distance]`, transport.distance);
    });

    // Append facilities array
    data.facilities.forEach((facilityId, index) => {
      formData.append(`facilities[${index}]`, facilityId.toString());
    });

    // Append files
    if (data.main_image) {
      formData.append('main_image', data.main_image);
    }

    // demo_video is now a YouTube URL string, not a file
    if (data.demo_video) {
      formData.append('demo_video', data.demo_video);
    }

    if (data.demo_video_thumbnail) {
      formData.append('demo_video_thumbnail', data.demo_video_thumbnail);
    }

    if (data.brochure) {
      formData.append('brochure', data.brochure);
    }

    if (data.payment_schedule) {
      formData.append('payment_schedule', data.payment_schedule);
    }

    if (data.booking_form_background_image) {
      formData.append('booking_form_background_image', data.booking_form_background_image);
    }
    if (data.booking_form_image) {
      formData.append('booking_form_image', data.booking_form_image);
    }

    // Append multiple files
    if (data.layout_images && data.layout_images.length > 0) {
      data.layout_images.forEach((file, index) => {
        formData.append(`layout_images[${index}]`, file);
      });
    }

    if (data.gallery_images && data.gallery_images.length > 0) {
      data.gallery_images.forEach((file, index) => {
        formData.append(`gallery_images[${index}]`, file);
      });
    }

    if (data.featured_images && data.featured_images.length > 0) {
      data.featured_images.forEach((file, index) => {
        formData.append(`featured_images[${index}]`, file);
      });
    }

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
    formData.append('description', data.description);
    formData.append('status', data.status);
    formData.append('area', data.area);
    formData.append('location', data.location);
    formData.append('type', data.type);
    formData.append('property_category', data.property_category);
    formData.append('total_floor', data.total_floor.toString());
    formData.append('total_flat', data.total_flat.toString());
    formData.append('flat_size', data.flat_size.toString());
    formData.append('total_parking', data.total_parking.toString());
    formData.append('land', data.land);
    formData.append('building_height', data.building_height);
    if (data.hand_over_date) {
      formData.append('hand_over_date', data.hand_over_date);
    }
    formData.append('face', data.face);
    formData.append('road', data.road);
    if (data.price !== '') {
      formData.append('price', data.price.toString());
    }
    formData.append('full_address', data.full_address);
    if (data.latitude !== '') formData.append('latitude', data.latitude.toString());
    if (data.longitude !== '') formData.append('longitude', data.longitude.toString());
    formData.append('under_development', data.under_development);
    formData.append('bedrooms', data.bedrooms.toString());
    formData.append('bathrooms', data.bathrooms.toString());
    if (data.company_id !== '') {
      formData.append('company_id', data.company_id.toString());
    }

    // Append key_transports array as objects
    data.key_transports.forEach((transport, index) => {
      formData.append(`key_transports[${index}][name]`, transport.name);
      formData.append(`key_transports[${index}][icon]`, transport.icon);
      formData.append(`key_transports[${index}][distance]`, transport.distance);
    });

    // Append facilities array
    data.facilities.forEach((facilityId, index) => {
      formData.append(`facilities[${index}]`, facilityId.toString());
    });

    // Append files only if they exist
    if (data.main_image) {
      formData.append('main_image', data.main_image);
    }

    // demo_video is now a YouTube URL string, not a file
    if (data.demo_video) {
      formData.append('demo_video', data.demo_video);
    }

    if (data.demo_video_thumbnail) {
      formData.append('demo_video_thumbnail', data.demo_video_thumbnail);
    }

    if (data.brochure) {
      formData.append('brochure', data.brochure);
    }

    if (data.payment_schedule) {
      formData.append('payment_schedule', data.payment_schedule);
    }

    if (data.booking_form_background_image) {
      formData.append('booking_form_background_image', data.booking_form_background_image);
    }
    if (data.booking_form_image) {
      formData.append('booking_form_image', data.booking_form_image);
    }

    // Append multiple files
    if (data.layout_images && data.layout_images.length > 0) {
      data.layout_images.forEach((file, index) => {
        formData.append(`layout_images[${index}]`, file);
      });
    }

    if (data.gallery_images && data.gallery_images.length > 0) {
      data.gallery_images.forEach((file, index) => {
        formData.append(`gallery_images[${index}]`, file);
      });
    }

    if (data.featured_images && data.featured_images.length > 0) {
      data.featured_images.forEach((file, index) => {
        formData.append(`featured_images[${index}]`, file);
      });
    }

    // Append existing image paths that should be kept (for image removal)
    if (data.existing_layout_images && data.existing_layout_images.length > 0) {
      data.existing_layout_images.forEach((path, index) => {
        formData.append(`existing_layout_images[${index}]`, path);
      });
    }

    if (data.existing_gallery_images && data.existing_gallery_images.length > 0) {
      data.existing_gallery_images.forEach((path, index) => {
        formData.append(`existing_gallery_images[${index}]`, path);
      });
    }

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
