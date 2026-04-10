import { safeNumber } from './mathHelpers';

// Přidali jsme 'type' pro jistotu, že to kompilátor oddělí
export type HourlyInputs = {
  grossIncome: number;
  billableHours: number;
  nonBillableHours: number; 
  vacationWeeks: number;
  bufferDays: number;
  costs: {
    taxes: number;
    overhead: number;
    reserves: number;
  };
}

export const calculateHourlyRate = (data: HourlyInputs) => {
  // Náklady
  const taxes = safeNumber(data.costs.taxes);
  const overhead = safeNumber(data.costs.overhead);
  const reserves = safeNumber(data.costs.reserves);
  const totalCosts = taxes + overhead + reserves;

  // Cílový hrubý příjem (včetně nákladů)
  const targetGross = safeNumber(data.grossIncome);
  const monthlyNeed = targetGross + totalCosts;

  // Efektivní pracovní dny
  const workWeeksPerYear = 52 - safeNumber(data.vacationWeeks);
  const workDaysPerYear = (workWeeksPerYear * 5) - safeNumber(data.bufferDays);
  const realWorkDaysPerMonth = workDaysPerYear / 12;

  // Multiplier pro průměrný měsíc (21 dní) vs vaše dostupné dny
  const availabilityMultiplier = 21 / (realWorkDaysPerMonth > 0 ? realWorkDaysPerMonth : 1);

  // Fakturovatelné + ne-fakturovatelné hodiny
  const effectiveHours = safeNumber(data.billableHours) + safeNumber(data.nonBillableHours);

  // Výpočet hodinové sazby
  const rawRate = effectiveHours > 0 ? (monthlyNeed / effectiveHours) * availabilityMultiplier : 0;

  return {
    rate: Math.ceil(rawRate / 10) * 10, // Zaokrouhlení na nejbližší desítku
    totalCosts,
    totalRequired: Math.ceil(monthlyNeed * availabilityMultiplier),
    realWorkDays: realWorkDaysPerMonth.toFixed(1)
  };
};