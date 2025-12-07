export interface Registration {
  id: string;
  registration_number: string;
  category_id: string;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  nationality: string;
  id_number?: string;
  tshirt_size?: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  running_experience?: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
  medical_conditions?: string;
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled';
  payment_method?: string;
  payment_date?: string;
  external_payment_id?: string;
  bib_number?: string;
  bib_assigned_at?: string;
  finish_time?: string;
  agreed_to_terms: boolean;
  agreed_to_privacy_policy: boolean;
  agreed_at: string;
  created_at: string;
  updated_at: string;
  ip_address?: string;
  category?: {
    name: string;
    distance: string;
  };
}

export interface RegistrationFilters {
  search?: string;
  payment_status?: string;
  category_id?: string;
  start_date?: string;
  end_date?: string;
  has_bib?: boolean;
  page?: number;
  limit?: number;
}