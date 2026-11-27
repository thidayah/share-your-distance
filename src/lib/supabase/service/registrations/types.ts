export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'expired' | 'refunded' | 'cancelled';

export interface Registration {
  id: string;
  registration_number: string;
  category_id: string;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other' | null;
  instagram: string | null;
  strava_url: string;
  nationality: string | null;
  id_number: string | null;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
  medical_conditions: string | null;
  total_amount: number;
  payment_status: PaymentStatus;
  payment_method: string | null;
  external_order_id: string | null;
  external_transaction_id: string | null;
  payment_date: string | null;
  consent_given_at: string | null;
  ip_address: string | null;
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    name: string;
    description: string;
    price: number;
    distance: string;
    max_participants: number | null;
    current_participants: number | null;
  };
}

export interface RegistrationCreateInput {
  registration_number: string;
  category_id: string;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  instagram?: string | null;
  strava_url: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
  medical_conditions?: string | null;
  total_amount: number;
  consent_given_at: string;
  external_order_id?: string | null;
  ip_address?: string | null;
}

export interface RegistrationFilters {
  search?: string;
  payment_status?: string;
  category_id?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
}
