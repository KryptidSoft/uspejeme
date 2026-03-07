import { safeNumber } from './mathHelpers';

/**
 * Rozšířená definice vstupů o dovolenou a rezervní dny.
 */
export interface HourlyInputs {
  grossIncome: number;
  billableHours: number;
  nonBillableHours: number; 
  vacationWeeks: number; // NOVÉ: Týdny dovolené/rok
  bufferDays: number;    // NOVÉ: Nemoc, školení, rezerva v dnech/rok
  costs: {
    taxes: number;
    overhead: number;
    material: number;
    reserves: number;
  };
}

/**
 * Výpočet hodinové sazby se započtením výpadků příjmu (dovolená/nemoc).
 */
export const calculateHourlyRate = (data: HourlyInputs) => {
  const taxes = safeNumber(data.costs.taxes);
  const overhead = safeNumber(data.costs.overhead);
  const material = safeNumber(data.costs.material);
  const reserves = safeNumber(data.costs.reserves);
  
  const totalCosts = taxes + overhead + material + reserves;
  const targetGross = safeNumber(data.grossIncome);
  
  // Celková měsíční potřeba peněz (příjem + náklady)
  const monthlyNeed = targetGross + totalCosts;

  // LOGIKA DOVOLENÉ:
  // 1. Spočítáme, kolik týdnů v roce reálně pracujeme
  const workWeeksPerYear = 52 - safeNumber(data.vacationWeeks);
  
  // 2. Přepočítáme to na pracovní dny a odečteme rezervu na nemoc/studium
  const workDaysPerYear = (workWeeksPerYear * 5) - safeNumber(data.bufferDays);
  
  // 3. Zjistíme průměrný počet reálně odpracovaných dní v měsíci
  const realWorkDaysPerMonth = workDaysPerYear / 12;
  
  // 4. Standardní měsíc (bez dovolené) má cca 21 pracovních dní.
  const availabilityMultiplier = 21 / (realWorkDaysPerMonth > 0 ? realWorkDaysPerMonth : 1);

  const billableHours = safeNumber(data.billableHours);
  
  // Finální výpočet: (Měsíční potřeba / hodiny) * navýšení o dovolenou
  const rate = billableHours > 0 ? (monthlyNeed / billableHours) * availabilityMultiplier : 0;

  return {
    rate: Math.ceil(rate),
    totalCosts,
    totalRequired: Math.ceil(monthlyNeed * availabilityMultiplier),
    realWorkDays: realWorkDaysPerMonth.toFixed(1)
  };
};