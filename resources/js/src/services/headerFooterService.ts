import axios from 'axios';
import {
  HeaderNavigationLink,
  HeaderNavigationLinkFormData,
  HeaderDropdownItem,
  HeaderDropdownItemFormData,
  FooterQuickLink,
  FooterQuickLinkFormData,
  FooterDiscoverLink,
  FooterDiscoverLinkFormData,
  FooterSocialLink,
  FooterSocialLinkFormData,
} from '../types/HeaderFooter';

const API_BASE_URL = '/api';

axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Header Services
export const headerService = {
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/header`);
    return response.data;
  },
  updateSetting: async (key: string, value: string | null, file?: File) => {
    const formData = new FormData();
    formData.append('key', key);
    if (value !== null) formData.append('value', value);
    if (file) formData.append('file', file);
    
    const response = await axios.post(`${API_BASE_URL}/header/settings`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },
};

export const headerNavigationLinkService = {
  getAll: async (): Promise<HeaderNavigationLink[]> => {
    const response = await axios.get(`${API_BASE_URL}/header-navigation-links`);
    return response.data;
  },
  getById: async (id: number): Promise<HeaderNavigationLink> => {
    const response = await axios.get(`${API_BASE_URL}/header-navigation-links/${id}`);
    return response.data;
  },
  create: async (data: HeaderNavigationLinkFormData): Promise<HeaderNavigationLink> => {
    const response = await axios.post(`${API_BASE_URL}/header-navigation-links`, {
      ...data,
      is_active: data.is_active ? 1 : 0,
    });
    return response.data.data;
  },
  update: async (id: number, data: Partial<HeaderNavigationLinkFormData>): Promise<HeaderNavigationLink> => {
    const updateData: any = { ...data };
    if (data.is_active !== undefined) {
      updateData.is_active = data.is_active ? 1 : 0;
    }
    const response = await axios.put(`${API_BASE_URL}/header-navigation-links/${id}`, updateData);
    return response.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/header-navigation-links/${id}`);
  },
};

export const headerDropdownItemService = {
  getByNavigationLink: async (navigationLinkId: number): Promise<HeaderDropdownItem[]> => {
    const response = await axios.get(`${API_BASE_URL}/header-dropdown-items/navigation-link/${navigationLinkId}`);
    return response.data;
  },
  getById: async (id: number): Promise<HeaderDropdownItem> => {
    const response = await axios.get(`${API_BASE_URL}/header-dropdown-items/${id}`);
    return response.data;
  },
  create: async (data: HeaderDropdownItemFormData): Promise<HeaderDropdownItem> => {
    const response = await axios.post(`${API_BASE_URL}/header-dropdown-items`, {
      ...data,
      is_active: data.is_active ? 1 : 0,
    });
    return response.data.data;
  },
  update: async (id: number, data: Partial<HeaderDropdownItemFormData>): Promise<HeaderDropdownItem> => {
    const updateData: any = { ...data };
    if (data.is_active !== undefined) {
      updateData.is_active = data.is_active ? 1 : 0;
    }
    const response = await axios.put(`${API_BASE_URL}/header-dropdown-items/${id}`, updateData);
    return response.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/header-dropdown-items/${id}`);
  },
};

// Footer Services
export const footerService = {
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/footer`);
    return response.data;
  },
  updateSetting: async (key: string, value: string | null, file?: File) => {
    const formData = new FormData();
    formData.append('key', key);
    if (value !== null) formData.append('value', value);
    if (file) formData.append('file', file);
    
    const response = await axios.post(`${API_BASE_URL}/footer/settings`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },
};

export const footerQuickLinkService = {
  getAll: async (): Promise<FooterQuickLink[]> => {
    const response = await axios.get(`${API_BASE_URL}/footer-quick-links`);
    return response.data;
  },
  getById: async (id: number): Promise<FooterQuickLink> => {
    const response = await axios.get(`${API_BASE_URL}/footer-quick-links/${id}`);
    return response.data;
  },
  create: async (data: FooterQuickLinkFormData): Promise<FooterQuickLink> => {
    const response = await axios.post(`${API_BASE_URL}/footer-quick-links`, {
      ...data,
      is_active: data.is_active ? 1 : 0,
    });
    return response.data.data;
  },
  update: async (id: number, data: Partial<FooterQuickLinkFormData>): Promise<FooterQuickLink> => {
    const updateData: any = { ...data };
    if (data.is_active !== undefined) {
      updateData.is_active = data.is_active ? 1 : 0;
    }
    const response = await axios.put(`${API_BASE_URL}/footer-quick-links/${id}`, updateData);
    return response.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/footer-quick-links/${id}`);
  },
};

export const footerDiscoverLinkService = {
  getAll: async (): Promise<FooterDiscoverLink[]> => {
    const response = await axios.get(`${API_BASE_URL}/footer-discover-links`);
    return response.data;
  },
  getById: async (id: number): Promise<FooterDiscoverLink> => {
    const response = await axios.get(`${API_BASE_URL}/footer-discover-links/${id}`);
    return response.data;
  },
  create: async (data: FooterDiscoverLinkFormData): Promise<FooterDiscoverLink> => {
    const response = await axios.post(`${API_BASE_URL}/footer-discover-links`, {
      ...data,
      is_active: data.is_active ? 1 : 0,
    });
    return response.data.data;
  },
  update: async (id: number, data: Partial<FooterDiscoverLinkFormData>): Promise<FooterDiscoverLink> => {
    const updateData: any = { ...data };
    if (data.is_active !== undefined) {
      updateData.is_active = data.is_active ? 1 : 0;
    }
    const response = await axios.put(`${API_BASE_URL}/footer-discover-links/${id}`, updateData);
    return response.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/footer-discover-links/${id}`);
  },
};

export const footerSocialLinkService = {
  getAll: async (): Promise<FooterSocialLink[]> => {
    const response = await axios.get(`${API_BASE_URL}/footer-social-links`);
    return response.data;
  },
  getById: async (id: number): Promise<FooterSocialLink> => {
    const response = await axios.get(`${API_BASE_URL}/footer-social-links/${id}`);
    return response.data;
  },
  create: async (data: FooterSocialLinkFormData): Promise<FooterSocialLink> => {
    const response = await axios.post(`${API_BASE_URL}/footer-social-links`, {
      ...data,
      is_active: data.is_active ? 1 : 0,
    });
    return response.data.data;
  },
  update: async (id: number, data: Partial<FooterSocialLinkFormData>): Promise<FooterSocialLink> => {
    const updateData: any = { ...data };
    if (data.is_active !== undefined) {
      updateData.is_active = data.is_active ? 1 : 0;
    }
    const response = await axios.put(`${API_BASE_URL}/footer-social-links/${id}`, updateData);
    return response.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/footer-social-links/${id}`);
  },
};

