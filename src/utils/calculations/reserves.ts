import { safeNumber } from './mathHelpers';

export const calculateReserves = (data: any) => {
  const monthlyExpenses = safeNumber(data?.monthlyExpenses, 0);
  const targetMonths = safeNumber(data?.targetMonths, 6);
  const savingMonths = safeNumber(data?.savingMonths, 12);

  const totalTarget = monthlyExpenses * targetMonths;
  // Ošetření proti dělení nulou u doby spoření
  const monthlySavingNeeded = totalTarget / Math.max(savingMonths, 1);

  return {
    totalTarget,
    monthlySavingNeeded
  };
};