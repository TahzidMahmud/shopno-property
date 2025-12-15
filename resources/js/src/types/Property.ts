import { Facility } from './Facility';

export interface KeyTransport {
  name: string;
  icon: string;
  distance: string;
}

export interface Property {
  id?: number;
  title: string;
  description?: string;
  status?: string;
  area?: string;
  location?: string;
  type?: string;
  total_floor?: number;
  total_flat?: number;
  flat_size?: number;
  total_parking?: number;
  price?: number;
  main_image?: string;
  layout_images?: string[];
  gallery_images?: string[];
  featured_images?: string[];
  demo_video?: string;
  demo_video_thumbnail?: string;
  brochure?: string;
  payment_schedule?: string;
  booking_form_background_image?: string;
  booking_form_image?: string;
  full_address?: string;
  latitude?: number;
  longitude?: number;
  key_transports?: KeyTransport[];
  under_development?: string;
  bedrooms?: number;
  bathrooms?: number;
  company_id?: number;
  company?: {
    id: number;
    name: string;
    logo?: string;
    owner_name: string;
  };
  facilities?: Facility[];
  created_at?: string;
  updated_at?: string;
}

export interface PropertyFormData {
  title: string;
  description: string;
  status: string;
  area: string;
  location: string;
  type: string;
  total_floor: number | '';
  total_flat: number | '';
  flat_size: number | '';
  total_parking: number | '';
  price: number | '';
  main_image: File | null;
  layout_images: File[];
  gallery_images: File[];
  featured_images: File[];
  demo_video: string;
  demo_video_thumbnail: File | null;
  brochure: File | null;
  payment_schedule: File | null;
  booking_form_background_image: File | null;
  booking_form_image: File | null;
  full_address: string;
  latitude: number | '';
  longitude: number | '';
  key_transports: KeyTransport[];
  under_development: string;
  bedrooms: number | '';
  bathrooms: number | '';
  company_id: number | '';
  facilities: number[];
  // Arrays of existing image paths to keep (for updates)
  existing_layout_images?: string[];
  existing_gallery_images?: string[];
}
