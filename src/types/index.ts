export interface Member {
  id: string;
  member_name: string;
  member_email?: string;
  member_phone?: string;
  member_id: string; // The gym's internal ID
  date_joined: string;
  is_active: boolean;
  qr_code_secret: string; // Unique secret for the QR code
  created_at: string;
}

export type NewMember = Omit<Member, 'id' | 'created_at' | 'date_joined'>;

export interface Perk {
  id: string;
  partner_name: string;
  category: string;
  discount: string;
  description: string;
  conditions: string;
  image_url: string | null;
  created_at: string;
}
