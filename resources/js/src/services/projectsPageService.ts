import axios from 'axios';

const API_BASE_URL = '/api';

export interface ProjectsPageSettingFormData {
  key: string;
  value?: string;
  file?: File | null;
}

export const projectsPageService = {
  getAll: async (): Promise<Record<string, string>> => {
    const response = await axios.get(`${API_BASE_URL}/projects-page`);
    return response.data;
  },

  updateSetting: async (formData: ProjectsPageSettingFormData): Promise<any> => {
    const data = new FormData();
    data.append('key', formData.key);
    if (formData.file) {
      data.append('file', formData.file);
    } else if (formData.value) {
      data.append('value', formData.value);
    }
    const response = await axios.post(`${API_BASE_URL}/projects-page/settings`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

