import axios from 'axios';
import { 
  AboutPageData, 
  AboutPageSettingFormData, 
  AboutPageProject, 
  AboutPageProjectFormData,
  AboutPageTeamMember,
  AboutPageTeamMemberFormData,
  AboutPageTestimonial,
  AboutPageTestimonialFormData
} from '../types/AboutPage';

const API_BASE_URL = '/api';

export const aboutPageService = {
  getAll: async (): Promise<AboutPageData> => {
    const response = await axios.get(`${API_BASE_URL}/about-page`);
    return response.data;
  },

  updateSetting: async (formData: AboutPageSettingFormData): Promise<any> => {
    const data = new FormData();
    data.append('key', formData.key);
    if (formData.file) {
      data.append('file', formData.file);
    } else if (formData.value) {
      data.append('value', formData.value);
    }
    const response = await axios.post(`${API_BASE_URL}/about-page/settings`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export const aboutPageProjectService = {
  getAll: async (): Promise<AboutPageProject[]> => {
    const response = await axios.get(`${API_BASE_URL}/about-page-projects`);
    return response.data;
  },

  create: async (data: AboutPageProjectFormData): Promise<AboutPageProject> => {
    const formData = new FormData();
    formData.append('title', data.title);
    if (data.subtitle) formData.append('subtitle', data.subtitle);
    if (data.image) formData.append('image', data.image);
    formData.append('order', data.order.toString());
    formData.append('is_active', data.is_active ? '1' : '0');
    const response = await axios.post(`${API_BASE_URL}/about-page-projects`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  update: async (id: number, data: AboutPageProjectFormData): Promise<AboutPageProject> => {
    const formData = new FormData();
    // Use method spoofing for PUT with FormData (more reliable)
    formData.append('_method', 'PUT');
    formData.append('title', data.title);
    if (data.subtitle) formData.append('subtitle', data.subtitle);
    if (data.image) formData.append('image', data.image);
    formData.append('order', data.order.toString());
    formData.append('is_active', data.is_active ? '1' : '0');
    // Use POST with _method=PUT and manually set Content-Type (like propertyService)
    const response = await axios.post(`${API_BASE_URL}/about-page-projects/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/about-page-projects/${id}`);
  },
};

export const aboutPageTeamMemberService = {
  getAll: async (): Promise<AboutPageTeamMember[]> => {
    const response = await axios.get(`${API_BASE_URL}/about-page-team-members`);
    return response.data;
  },

  create: async (data: AboutPageTeamMemberFormData): Promise<AboutPageTeamMember> => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('position', data.position);
    if (data.image) formData.append('image', data.image);
    formData.append('order', data.order.toString());
    formData.append('is_active', data.is_active ? '1' : '0');
    const response = await axios.post(`${API_BASE_URL}/about-page-team-members`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  update: async (id: number, data: AboutPageTeamMemberFormData): Promise<AboutPageTeamMember> => {
    const formData = new FormData();
    // Use method spoofing for PUT with FormData (more reliable)
    formData.append('_method', 'PUT');
    formData.append('name', data.name);
    formData.append('position', data.position);
    if (data.image) formData.append('image', data.image);
    formData.append('order', data.order.toString());
    formData.append('is_active', data.is_active ? '1' : '0');
    // Use POST with _method=PUT and manually set Content-Type (like propertyService)
    const response = await axios.post(`${API_BASE_URL}/about-page-team-members/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/about-page-team-members/${id}`);
  },
};

export const aboutPageTestimonialService = {
  getAll: async (): Promise<AboutPageTestimonial[]> => {
    const response = await axios.get(`${API_BASE_URL}/about-page-testimonials`);
    return response.data;
  },

  create: async (data: AboutPageTestimonialFormData): Promise<AboutPageTestimonial> => {
    const formData = new FormData();
    formData.append('quote', data.quote);
    formData.append('author_name', data.author_name);
    formData.append('author_position', data.author_position);
    if (data.author_company) formData.append('author_company', data.author_company);
    formData.append('rating', data.rating.toString());
    if (data.image) formData.append('image', data.image);
    formData.append('order', data.order.toString());
    formData.append('is_active', data.is_active ? '1' : '0');
    const response = await axios.post(`${API_BASE_URL}/about-page-testimonials`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  update: async (id: number, data: AboutPageTestimonialFormData): Promise<AboutPageTestimonial> => {
    const formData = new FormData();
    // Use method spoofing for PUT with FormData (more reliable)
    formData.append('_method', 'PUT');
    formData.append('quote', data.quote);
    formData.append('author_name', data.author_name);
    formData.append('author_position', data.author_position);
    if (data.author_company) formData.append('author_company', data.author_company);
    formData.append('rating', data.rating.toString());
    if (data.image) formData.append('image', data.image);
    formData.append('order', data.order.toString());
    formData.append('is_active', data.is_active ? '1' : '0');
    // Use POST with _method=PUT and manually set Content-Type (like propertyService)
    const response = await axios.post(`${API_BASE_URL}/about-page-testimonials/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/about-page-testimonials/${id}`);
  },
};

