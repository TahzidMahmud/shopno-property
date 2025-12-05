import { Facility } from './Facility';

export interface Property {
  id?: number;
  title: string;
  status?: string;
  area?: string;
  location?: string;
  type?: string;
  total_floor?: number;
  total_flat?: number;
  flat_size?: number;
  total_parking?: number;
  price_range?: string;
  main_image?: string;
  layout_images?: string[];
  gallery_images?: string[];
  demo_video?: string;
  full_address?: string;
  key_transports?: string[];
  under_development?: string;
  bedrooms?: number;
  bathrooms?: number;
  company_name?: string;
  facilities?: Facility[];
  created_at?: string;
  updated_at?: string;
}

export interface PropertyFormData {
  title: string;
  status: string;
  area: string;
  location: string;
  type: string;
  total_floor: number | '';
  total_flat: number | '';
  flat_size: number | '';
  total_parking: number | '';
  price_range: string;
  main_image: File | null;
  layout_images: File[];
  gallery_images: File[];
  demo_video: File | null;
  full_address: string;
  key_transports: string[];
  under_development: string;
  bedrooms: number | '';
  bathrooms: number | '';
  company_name: string;
  facilities: number[];
}
