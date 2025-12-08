import { Facility } from './Facility';

export interface KeyTransport {
  name: string;
  icon: string;
  distance: string;
}

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
  booking_form_background_image?: string;
  full_address?: string;
  latitude?: number;
  longitude?: number;
  key_transports?: KeyTransport[];
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
  booking_form_background_image: File | null;
  full_address: string;
  latitude: number | '';
  longitude: number | '';
  key_transports: KeyTransport[];
  under_development: string;
  bedrooms: number | '';
  bathrooms: number | '';
  company_name: string;
  facilities: number[];
}
