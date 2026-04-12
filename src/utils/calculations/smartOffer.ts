import type { OfferItem } from '../../types';

export interface OfferData {
  clientName: string;
  projectName?: string;
  items: OfferItem[];
  currency: string;
  language: 'cs' | 'en';
  validUntil: string;
  note?: string;
}

export const calculateOfferTotals = (items: OfferItem[]) => {
  // 1. Spočítej řádky a zaokrouhli je hned
  const rows = items.map(item => {
    const lineSubtotal = item.quantity * item.unitPrice;
    const lineTax = lineSubtotal * (item.taxRate / 100);
    return {
      subtotal: Math.round(lineSubtotal * 100) / 100,
      tax: Math.round(lineTax * 100) / 100
    };
  });

  // 2. Sečti už zaokrouhlené hodnoty
  const subtotal = rows.reduce((sum, row) => sum + row.subtotal, 0);
  const taxTotal = rows.reduce((sum, row) => sum + row.tax, 0);

  return {
    subtotal: subtotal,
    taxTotal: taxTotal,
    total: subtotal + taxTotal
  };
};