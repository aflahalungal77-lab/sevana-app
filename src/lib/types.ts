export type ServiceCategory = {
  id: string;
  name: string;
  slug: string;
  kind: "hotline" | "transport" | "worker";
  icon?: string | null;
};

export type ServiceListing = {
  id: string;
  name: string;
  phone: string;
  area: string | null;
  address?: string | null;
  description?: string | null;
  category_id?: string | null;
  category_slug?: string | null;
  category_name?: string | null;
  vehicle_type?: string | null;
  is_active?: boolean;
  sort_order?: number;
};

export type Donor = {
  id: string;
  name: string;
  blood_group: string;
  phone: string;
  area: string;
  available?: boolean;
};

export type BloodRequest = {
  patient_name: string;
  blood_group: string;
  units: number;
  hospital: string;
  area: string;
  contact_phone: string;
  needed_by: string;
  notes: string;
};
