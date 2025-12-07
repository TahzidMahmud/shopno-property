import axios from 'axios';
import {
  HeroSlide,
  HeroSlideFormData,
  WhyChooseUsFeature,
  WhyChooseUsFeatureFormData,
  InvestmentBenefit,
  InvestmentBenefitFormData,
  BlogPost,
  BlogPostFormData,
  Partner,
  PartnerFormData,
  SearchOption,
  SearchOptionFormData,
  HomePageSetting,
  HomePageSettingFormData,
  PropertyType,
  PropertyTypeFormData,
} from '../types/HomePage';

const API_BASE_URL = '/api';

axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Hero Slides
export const heroSlideService = {
  getAll: async (): Promise<HeroSlide[]> => {
    const response = await axios.get(`${API_BASE_URL}/hero-slides`);
    return response.data;
  },
  getById: async (id: number): Promise<HeroSlide> => {
    const response = await axios.get(`${API_BASE_URL}/hero-slides/${id}`);
    return response.data;
  },
  create: async (data: HeroSlideFormData): Promise<HeroSlide> => {
    const formData = new FormData();
    if (data.background_image) formData.append('background_image', data.background_image);
    formData.append('title', data.title);
    formData.append('subtitle', data.subtitle);
    formData.append('description', data.description);
    formData.append('button_text', data.button_text);
    formData.append('button_link', data.button_link || '');
    formData.append('order', data.order.toString());
    formData.append('is_active', data.is_active ? '1' : '0');
    
    const response = await axios.post(`${API_BASE_URL}/hero-slides`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },
  update: async (id: number, data: HeroSlideFormData): Promise<HeroSlide> => {
    const formData = new FormData();
    if (data.background_image) formData.append('background_image', data.background_image);
    formData.append('title', data.title);
    formData.append('subtitle', data.subtitle);
    formData.append('description', data.description);
    formData.append('button_text', data.button_text);
    formData.append('button_link', data.button_link || '');
    formData.append('order', data.order.toString());
    formData.append('is_active', data.is_active ? '1' : '0');
    
    const response = await axios.put(`${API_BASE_URL}/hero-slides/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/hero-slides/${id}`);
  },
};

// Why Choose Us Features
export const whyChooseUsFeatureService = {
  getAll: async (): Promise<WhyChooseUsFeature[]> => {
    const response = await axios.get(`${API_BASE_URL}/why-choose-us-features`);
    return response.data;
  },
  getById: async (id: number): Promise<WhyChooseUsFeature> => {
    const response = await axios.get(`${API_BASE_URL}/why-choose-us-features/${id}`);
    return response.data;
  },
  create: async (data: WhyChooseUsFeatureFormData): Promise<WhyChooseUsFeature> => {
    const response = await axios.post(`${API_BASE_URL}/why-choose-us-features`, data);
    return response.data.data;
  },
  update: async (id: number, data: WhyChooseUsFeatureFormData): Promise<WhyChooseUsFeature> => {
    const response = await axios.put(`${API_BASE_URL}/why-choose-us-features/${id}`, data);
    return response.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/why-choose-us-features/${id}`);
  },
};

// Investment Benefits
export const investmentBenefitService = {
  getAll: async (): Promise<InvestmentBenefit[]> => {
    const response = await axios.get(`${API_BASE_URL}/investment-benefits`);
    return response.data;
  },
  getById: async (id: number): Promise<InvestmentBenefit> => {
    const response = await axios.get(`${API_BASE_URL}/investment-benefits/${id}`);
    return response.data;
  },
  create: async (data: InvestmentBenefitFormData): Promise<InvestmentBenefit> => {
    const response = await axios.post(`${API_BASE_URL}/investment-benefits`, data);
    return response.data.data;
  },
  update: async (id: number, data: InvestmentBenefitFormData): Promise<InvestmentBenefit> => {
    const response = await axios.put(`${API_BASE_URL}/investment-benefits/${id}`, data);
    return response.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/investment-benefits/${id}`);
  },
};

// Blog Posts
export const blogPostService = {
  getAll: async (): Promise<BlogPost[]> => {
    const response = await axios.get(`${API_BASE_URL}/blog-posts`);
    return response.data;
  },
  getById: async (id: number): Promise<BlogPost> => {
    const response = await axios.get(`${API_BASE_URL}/blog-posts/${id}`);
    return response.data;
  },
  create: async (data: BlogPostFormData): Promise<BlogPost> => {
    const formData = new FormData();
    if (data.image) formData.append('image', data.image);
    formData.append('title', data.title);
    formData.append('content', data.content || '');
    formData.append('published_date', data.published_date);
    formData.append('slug', data.slug || '');
    formData.append('is_published', data.is_published ? '1' : '0');
    formData.append('order', data.order.toString());
    
    const response = await axios.post(`${API_BASE_URL}/blog-posts`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },
  update: async (id: number, data: BlogPostFormData): Promise<BlogPost> => {
    const formData = new FormData();
    if (data.image) formData.append('image', data.image);
    formData.append('title', data.title);
    formData.append('content', data.content || '');
    formData.append('published_date', data.published_date);
    formData.append('slug', data.slug || '');
    formData.append('is_published', data.is_published ? '1' : '0');
    formData.append('order', data.order.toString());
    
    const response = await axios.put(`${API_BASE_URL}/blog-posts/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/blog-posts/${id}`);
  },
};

// Partners
export const partnerService = {
  getAll: async (): Promise<Partner[]> => {
    const response = await axios.get(`${API_BASE_URL}/partners`);
    return response.data;
  },
  getById: async (id: number): Promise<Partner> => {
    const response = await axios.get(`${API_BASE_URL}/partners/${id}`);
    return response.data;
  },
  create: async (data: PartnerFormData): Promise<Partner> => {
    const formData = new FormData();
    if (data.logo) formData.append('logo', data.logo);
    formData.append('name', data.name);
    formData.append('website', data.website || '');
    formData.append('order', data.order.toString());
    formData.append('is_active', data.is_active ? '1' : '0');
    
    const response = await axios.post(`${API_BASE_URL}/partners`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },
  update: async (id: number, data: PartnerFormData): Promise<Partner> => {
    const formData = new FormData();
    if (data.logo) formData.append('logo', data.logo);
    formData.append('name', data.name);
    formData.append('website', data.website || '');
    formData.append('order', data.order.toString());
    formData.append('is_active', data.is_active ? '1' : '0');
    
    const response = await axios.put(`${API_BASE_URL}/partners/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/partners/${id}`);
  },
};

// Search Options
export const searchOptionService = {
  getAll: async (category?: string): Promise<SearchOption[]> => {
    const url = category 
      ? `${API_BASE_URL}/search-options?category=${category}`
      : `${API_BASE_URL}/search-options`;
    const response = await axios.get(url);
    return response.data;
  },
  getById: async (id: number): Promise<SearchOption> => {
    const response = await axios.get(`${API_BASE_URL}/search-options/${id}`);
    return response.data;
  },
  create: async (data: SearchOptionFormData): Promise<SearchOption> => {
    const response = await axios.post(`${API_BASE_URL}/search-options`, data);
    return response.data.data;
  },
  update: async (id: number, data: SearchOptionFormData): Promise<SearchOption> => {
    const response = await axios.put(`${API_BASE_URL}/search-options/${id}`, data);
    return response.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/search-options/${id}`);
  },
};

// Home Page Settings
export const homePageSettingService = {
  getAll: async (): Promise<Record<string, string>> => {
    const response = await axios.get(`${API_BASE_URL}/home-page-settings`);
    return response.data;
  },
  getByKey: async (key: string): Promise<HomePageSetting> => {
    const response = await axios.get(`${API_BASE_URL}/home-page-settings/${key}`);
    return response.data;
  },
  create: async (data: HomePageSettingFormData): Promise<HomePageSetting> => {
    const formData = new FormData();
    formData.append('key', data.key);
    if (data.file) {
      formData.append('file', data.file);
    } else {
      formData.append('value', data.value);
    }
    
    const response = await axios.post(`${API_BASE_URL}/home-page-settings`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },
  update: async (key: string, data: HomePageSettingFormData): Promise<HomePageSetting> => {
    const formData = new FormData();
    if (data.file) {
      formData.append('file', data.file);
    } else {
      formData.append('value', data.value);
    }
    
    const response = await axios.put(`${API_BASE_URL}/home-page-settings/${key}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },
  delete: async (key: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/home-page-settings/${key}`);
  },
};

// Property Types
export const propertyTypeService = {
  getAll: async (): Promise<PropertyType[]> => {
    const response = await axios.get(`${API_BASE_URL}/property-types`);
    return response.data;
  },
  getById: async (id: number): Promise<PropertyType> => {
    const response = await axios.get(`${API_BASE_URL}/property-types/${id}`);
    return response.data;
  },
  create: async (data: PropertyTypeFormData): Promise<PropertyType> => {
    const response = await axios.post(`${API_BASE_URL}/property-types`, data);
    return response.data.data;
  },
  update: async (id: number, data: PropertyTypeFormData): Promise<PropertyType> => {
    const response = await axios.put(`${API_BASE_URL}/property-types/${id}`, data);
    return response.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/property-types/${id}`);
  },
};


