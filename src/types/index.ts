export type BusinessType = 'osvc_pausal' | 'osvc_hlavni' | 'sro' | 'vse' | 'platec_dph' | 'all';

export interface Deadline {
  id: string;
  date: Date;
  title: string;
  description: string;
  type: 'dan' | 'pojistne' | 'ostatni' | 'svatek' | 'strategie';
  for: BusinessType[];
}

export interface OfferItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
}