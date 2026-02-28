import { safeNumber } from './mathHelpers';

export const calculateReserves = (data: any) => {
  // Přidali jsme otazníky (data?), které říkají: "Pokud to tam není, nespadni."
  const monthlyExpenses = safeNumber(data?.monthlyExpenses, 0);
  const targetMonths = safeNumber(data?.targetMonths, 6);
  const savingMonths = safeNumber(data?.savingMonths, 12);

  const totalTarget = monthlyExpenses * targetMonths;
  const monthlySavingNeeded = totalTarget / Math.max(savingMonths, 1);

  return {
    totalTarget,
    monthlySavingNeeded
  };
};