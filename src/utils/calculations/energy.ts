import { safeNumber } from './mathHelpers';

export interface EnergyInputs {
  watts: number;
  hoursPerDay: number;
  pricePerKWh: number;
}

export const calculateEnergy = (data: EnergyInputs) => {
  const dailyKwh = (safeNumber(data.watts) * safeNumber(data.hoursPerDay)) / 1000;
  const monthlyCost = dailyKwh * 30 * safeNumber(data.pricePerKWh);
  return { dailyKwh, monthlyCost };
};