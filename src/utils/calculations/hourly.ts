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

export const calculateHourlyRate = (data: HourlyInputs) => {
  const taxes = safeNumber(data.costs.taxes);
  const overhead = safeNumber(data.costs.overhead);
  const material = safeNumber(data.costs.material);
  const reserves = safeNumber(data.costs.reserves);
  
  const totalCosts = taxes + overhead + material + reserves;
  const targetGross = safeNumber(data.grossIncome);
  const monthlyNeed = targetGross + totalCosts;

  const workWeeksPerYear = 52 - safeNumber(data.vacationWeeks);
  const workDaysPerYear = (workWeeksPerYear * 5) - safeNumber(data.bufferDays);
  const realWorkDaysPerMonth = workDaysPerYear / 12;
  
  const availabilityMultiplier = 21 / (realWorkDaysPerMonth > 0 ? realWorkDaysPerMonth : 1);
  const billableHours = safeNumber(data.billableHours);
  
  // Výpočet čisté sazby
  const rawRate = billableHours > 0 ? (monthlyNeed / billableHours) * availabilityMultiplier : 0;

  return {
    // VYLEPŠENÍ: Zaokrouhlení nahoru na nejbližší desítku (např. 843 -> 850)
    rate: Math.ceil(rawRate / 10) * 10, 
    totalCosts,
    // Potřebný obrat včetně "vydělání si na dovolenou"
    totalRequired: Math.ceil(monthlyNeed * availabilityMultiplier),
    realWorkDays: realWorkDaysPerMonth.toFixed(1)
  };
};