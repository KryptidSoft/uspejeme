import { safeNumber, clamp } from './mathHelpers';

/**
 * Definice rozhraní pro vstupy stability.
 */
export interface StabilityInputs {
  reservesMonths: number;
  incomeSustainability: number;
  workload: number;
  roiEfficiency: number;
  expenseStability: number;
}

/**
 * Výpočet celkového indexu finanční a pracovní stability.
 */
export const calculateStability = (data: StabilityInputs) => {
  // Vážený průměr různých faktorů
  const reservesScore = clamp((safeNumber(data.reservesMonths) / 12) * 100, 0, 100);
  const sustainabilityScore = safeNumber(data.incomeSustainability);
  const workloadScore = 100 - safeNumber(data.workload); // Nižší workload (do 100) = vyšší stabilita
  const roiScore = safeNumber(data.roiEfficiency);
  const expenseScore = safeNumber(data.expenseStability);

  const totalScore = (
    reservesScore * 0.3 +
    sustainabilityScore * 0.25 +
    workloadScore * 0.15 +
    roiScore * 0.15 +
    expenseScore * 0.15
  );

  return {
    score: Math.round(totalScore),
    factors: {
      reserves: Math.round(reservesScore),
      income: Math.round(sustainabilityScore),
      workload: Math.round(workloadScore),
      efficiency: Math.round(roiScore),
      expenses: Math.round(expenseScore)
    }
  };
};