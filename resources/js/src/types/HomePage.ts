export interface HeroSlide {
  id?: number;
  background_image: string;
  title: string;
  subtitle: string;
  description: string;
  button_text: string;
  button_link?: string;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface HeroSlideFormData {
  background_image: File | null;
  title: string;
  subtitle: string;
  description: string;
  button_text: string;
  button_link: string;
  order: number;
  is_active: boolean;
}

export interface WhyChooseUsFeature {
  id?: number;
  icon_name: string;
  title: string;
  description: string;
  video_url?: string;
  video_thumbnail?: string;
  is_active: boolean;
  order: number;
  created_at?: string;
  updated_at?: string;
}

export interface WhyChooseUsFeatureFormData {
  icon_name: string;
  title: string;
  description: string;
  video_url: string;
  video_thumbnail: File | null;
  is_active: boolean;
  order: number;
}

export interface InvestmentBenefit {
  id?: number;
  icon_name: string;
  title: string;
  description: string;
  order: number;
  created_at?: string;
  updated_at?: string;
}

export interface InvestmentBenefitFormData {
  icon_name: string;
  title: string;
  description: string;
  order: number;
}

export interface BlogPost {
  id?: number;
  title: string;
  content?: string;
  image: string;
  published_date: string;
  slug: string;
  is_published: boolean;
  order: number;
  created_at?: string;
  updated_at?: string;
}

export interface BlogPostFormData {
  title: string;
  content: string;
  image: File | null;
  published_date: string;
  slug: string;
  is_published: boolean;
  order: number;
}

export interface Partner {
  id?: number;
  name: string;
  logo: string;
  website?: string;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PartnerFormData {
  name: string;
  logo: File | null;
  website: string;
  order: number;
  is_active: boolean;
}

export interface SearchOption {
  id?: number;
  category: string;
  label: string;
  value: string;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SearchOptionFormData {
  category: string;
  label: string;
  value: string;
  order: number;
  is_active: boolean;
}

export interface HomePageSetting {
  id?: number;
  key: string;
  value: string;
  created_at?: string;
  updated_at?: string;
}

export interface HomePageSettingFormData {
  key: string;
  value: string;
  file: File | null;
}

export interface PropertyType {
  id?: number;
  name: string;
  type_value: string;
  icon_name: string;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PropertyTypeFormData {
  name: string;
  type_value: string;
  icon_name: string;
  order: number;
  is_active: boolean;
}


