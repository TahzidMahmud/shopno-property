export interface Facility {
  id?: number;
  title: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FacilityFormData {
  title: string;
  image: File | null;
}

