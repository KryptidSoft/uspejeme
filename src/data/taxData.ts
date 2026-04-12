export interface CountryTaxInfo {
  id: string;
  nameCz: string;
  nameEn: string;
  incomeTaxRate: number; 
  socialRate: number;    
  healthRate: number;    
  isCzechPausal?: boolean;
}

export const TAX_DATA: CountryTaxInfo[] = [
  { id: 'bg', nameCz: 'Bulharsko', nameEn: 'Bulgaria', incomeTaxRate: 0.10, socialRate: 0.07, healthRate: 0.05 },
  { id: 'ro', nameCz: 'Rumunsko', nameEn: 'Romania', incomeTaxRate: 0.10, socialRate: 0.10, healthRate: 0.05 },
  { id: 'cz', nameCz: 'Česko (Paušál)', nameEn: 'Czechia (Flat Tax)', incomeTaxRate: 0, socialRate: 0.15, healthRate: 0.14, isCzechPausal: true },
  { id: 'hu', nameCz: 'Maďarsko', nameEn: 'Hungary', incomeTaxRate: 0.15, socialRate: 0.13, healthRate: 0.055 },
  { id: 'sk', nameCz: 'Slovensko', nameEn: 'Slovakia', incomeTaxRate: 0.15, socialRate: 0.14, healthRate: 0.06 },
  { id: 'pl', nameCz: 'Polsko', nameEn: 'Poland', incomeTaxRate: 0.12, socialRate: 0.17, healthRate: 0.09 },
  { id: 'at', nameCz: 'Rakousko', nameEn: 'Austria', incomeTaxRate: 0.20, socialRate: 0.18, healthRate: 0.10 },
  { id: 'de', nameCz: 'Německo', nameEn: 'Germany', incomeTaxRate: 0.25, socialRate: 0.10, healthRate: 0.17 },
];

export const calculateEfficiency = (country: CountryTaxInfo): number => {
  if (country.isCzechPausal) return 70.5; 
  const totalLevy = country.incomeTaxRate + country.socialRate + country.healthRate;
  return Math.round((1 - totalLevy) * 1000) / 10;
};