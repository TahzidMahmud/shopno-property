export interface HeaderSetting {
  key: string;
  value: string | null;
}

export interface HeaderNavigationLink {
  id?: number;
  label: string;
  url: string;
  order: number;
  is_active: boolean;
  type: 'link' | 'dropdown';
  dropdown_items?: HeaderDropdownItem[];
}

export interface HeaderDropdownItem {
  id?: number;
  navigation_link_id: number;
  label: string;
  url: string;
  order: number;
  is_active: boolean;
}

export interface HeaderNavigationLinkFormData {
  label: string;
  url: string;
  order: number;
  is_active: boolean;
  type: 'link' | 'dropdown';
}

export interface HeaderDropdownItemFormData {
  navigation_link_id: number;
  label: string;
  url: string;
  order: number;
  is_active: boolean;
}

export interface FooterSetting {
  key: string;
  value: string | null;
}

export interface FooterQuickLink {
  id?: number;
  label: string;
  url: string;
  order: number;
  is_active: boolean;
}

export interface FooterDiscoverLink {
  id?: number;
  label: string;
  url: string;
  order: number;
  is_active: boolean;
}

export interface FooterSocialLink {
  id?: number;
  platform: 'facebook' | 'linkedin' | 'twitter' | 'instagram';
  url: string;
  is_active: boolean;
}

export interface FooterQuickLinkFormData {
  label: string;
  url: string;
  order: number;
  is_active: boolean;
}

export interface FooterDiscoverLinkFormData {
  label: string;
  url: string;
  order: number;
  is_active: boolean;
}

export interface FooterSocialLinkFormData {
  platform: 'facebook' | 'linkedin' | 'twitter' | 'instagram';
  url: string;
  is_active: boolean;
}

