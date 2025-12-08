import axios from 'axios';
import { ContactPageData, ContactPageSettingFormData, ContactPageKeyTransport, ContactPageKeyTransportFormData } from '../types/ContactPage';

const API_BASE_URL = '/api';

export const contactPageService = {
  getAll: async (): Promise<ContactPageData> => {
    const response = await axios.get(`${API_BASE_URL}/contact-page`);
    return response.data;
  },

  updateSetting: async (formData: ContactPageSettingFormData): Promise<any> => {
    const data = new FormData();
    data.append('key', formData.key);
    if (formData.file) {
      data.append('file', formData.file);
    } else if (formData.value) {
      data.append('value', formData.value);
    }
    const response = await axios.post(`${API_BASE_URL}/contact-page/settings`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export const contactPageKeyTransportService = {
  getAll: async (): Promise<ContactPageKeyTransport[]> => {
    const response = await axios.get(`${API_BASE_URL}/contact-page-key-transports`);
    return response.data;
  },

  create: async (data: ContactPageKeyTransportFormData): Promise<ContactPageKeyTransport> => {
    const response = await axios.post(`${API_BASE_URL}/contact-page-key-transports`, {
      ...data,
      is_active: data.is_active ? 1 : 0,
    });
    return response.data.data;
  },

  update: async (id: number, data: ContactPageKeyTransportFormData): Promise<ContactPageKeyTransport> => {
    const response = await axios.put(`${API_BASE_URL}/contact-page-key-transports/${id}`, {
      ...data,
      is_active: data.is_active ? 1 : 0,
    });
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/contact-page-key-transports/${id}`);
  },
};

