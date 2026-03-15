// utils/calculations/taxHelpers.ts
export const TAX_CONSTANTS = {
  PAUSAL_AMOUNT_2025: 8916,
  ESTIMATED_TAX_DRIVE_60: 0.78, // Vaše konstanta 22% (1 - 0.22)
};

export const calculateGrossFromNet = (netNeeded: number, taxMode: string, customRate: number, pausalAmount: number) => {
  switch (taxMode) {
    case 'pausal_dan':
      return netNeeded + pausalAmount;
    case 'vydaje_60':
      return netNeeded / TAX_CONSTANTS.ESTIMATED_TAX_DRIVE_60;
    case 'realne_vydaje':
      return netNeeded / (1 - customRate / 100);
    default:
      return netNeeded;
  }
};