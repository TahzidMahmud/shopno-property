export interface AboutPageSetting {
  key: string;
  value: string | null;
}

export interface AboutPageProject {
  id?: number;
  title: string;
  subtitle?: string;
  image: string;
  order: number;
  is_active: boolean;
}

export interface AboutPageTeamMember {
  id?: number;
  name: string;
  position: string;
  image: string;
  order: number;
  is_active: boolean;
}

export interface AboutPageTestimonial {
  id?: number;
  quote: string;
  author_name: string;
  author_position: string;
  author_company?: string;
  rating: number;
  image?: string;
  order: number;
  is_active: boolean;
}

export interface AboutPageData {
  settings: Record<string, string>;
  projects: AboutPageProject[];
  team_members: AboutPageTeamMember[];
  testimonials: AboutPageTestimonial[];
}

export interface AboutPageSettingFormData {
  key: string;
  value: string;
  file?: File | null;
}

export interface AboutPageProjectFormData {
  title: string;
  subtitle?: string;
  image: File | null;
  order: number;
  is_active: boolean;
}

export interface AboutPageTeamMemberFormData {
  name: string;
  position: string;
  image: File | null;
  order: number;
  is_active: boolean;
}

export interface AboutPageTestimonialFormData {
  quote: string;
  author_name: string;
  author_position: string;
  author_company?: string;
  rating: number;
  image: File | null;
  order: number;
  is_active: boolean;
}

