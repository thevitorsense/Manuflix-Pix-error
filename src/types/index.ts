export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  popular?: boolean;
}

export interface PaymentResponse {
  id: string;
  qrcode_image: string;
  copy_paste: string;
  expiration_date: string;
  status: string;
}

export interface Customer {
  email: string;
  name: string;
  cpf?: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  plan_id: string;
  amount: number;
  payment_id: string;
  payment_method: string;
  status: string;
  created_at: string;
  updated_at: string;
  expires_at: string | null;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  is_active: boolean;
  is_lifetime: boolean;
  starts_at: string;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DatabaseSubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration_days: number;
  is_lifetime: boolean;
  created_at: string;
  updated_at: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface BookingDetails {
  date: Date | null;
  time: string | null;
}

export interface PixResponse {
  id: string;
  qr_code: string;
  qr_code_base64: string;
}

export interface PaymentStatus {
  id: string;
  status: 'pending' | 'paid' | 'approved' | 'failed';
}