export interface ContactPageSetting {
  key: string;
  value: string | null;
}

export interface ContactPageKeyTransport {
  id?: number;
  name: string;
  icon: string;
  distance: string;
  order: number;
  is_active: boolean;
}

export interface ContactPageData {
  settings: Record<string, string>;
  key_transports: ContactPageKeyTransport[];
}

export interface ContactPageSettingFormData {
  key: string;
  value: string;
  file?: File | null;
}

export interface ContactPageKeyTransportFormData {
  name: string;
  icon: string;
  distance: string;
  order: number;
  is_active: boolean;
}

