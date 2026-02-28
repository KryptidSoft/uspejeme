import { safeNumber } from './mathHelpers';

/**
 * Definice rozhraní pro vstupy kalkulačky hodinové sazby.
 */
export interface HourlyInputs {
  grossIncome: number;
  billableHours: number;
  nonBillableHours: number;
  costs: {
    taxes: number;
    overhead: number;
    material: number;
    reserves: number;
  };
}

/**
 * Výpočet hodinové sazby tak, aby pokryla náklady i požadovaný zisk.
 */
export const calculateHourlyRate = (data: HourlyInputs) => {
  const taxes = safeNumber(data.costs.taxes);
  const overhead = safeNumber(data.costs.overhead);
  const material = safeNumber(data.costs.material);
  const reserves = safeNumber(data.costs.reserves);
  
  const totalCosts = taxes + overhead + material + reserves;
  const targetGross = safeNumber(data.grossIncome);
  const totalRequired = targetGross + totalCosts;
  
  const billableHours = safeNumber(data.billableHours);
  // Sazba = (Požadovaný čistý příjem + náklady) / fakturovatelné hodiny
  const rate = billableHours > 0 ? totalRequired / billableHours : 0;

  return {
    rate: Math.round(rate),
    totalCosts,
    totalRequired
  };
};