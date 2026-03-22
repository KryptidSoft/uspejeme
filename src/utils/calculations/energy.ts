export const calculateEnergy = (data: any) => {
  const { 
    lastReadingValue, 
    currentReadingValue, 
    lastReadingDate, 
    monthlyDeposit, 
    pricePerUnit 
  } = data;

  // Výpočet dní
  const start = new Date(lastReadingDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - start.getTime());
  const daysPassed = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

  // Spotřeba a náklady
  const consumedUnits = currentReadingValue - lastReadingValue;
  const monthsPassed = daysPassed / 30.42; // Průměrný měsíc
  const costToDate = (consumedUnits * pricePerUnit) + (monthsPassed * data.fixedMonthlyFee);

  // Zálohy (tady byla ta chyba - chyběla definice nebo byl překlep)
  const monthlyRate = monthlyDeposit;
  const dailyDepositRate = (monthlyRate * 12) / 365;
  const depositsPaidSoFar = dailyDepositRate * daysPassed;

  // Predikce na rok (365 dní)
  const predictedYearlyUnits = avgUnitsPerDay * 365;
  const predictedYearlyCost = (predictedYearlyUnits * pricePerUnit) + (12 * data.fixedMonthlyFee);
  const totalYearlyDeposits = monthlyDeposit * 12;

  // Bilance
  const finalBalance = totalYearlyDeposits - predictedYearlyCost;
  const currentBalance = depositsPaidSoFar - costToDate;

  // Doporučený limit pro zbytek roku, aby se skončilo na nule
  const remainingDays = 365 - daysPassed;
  const remainingBudget = totalYearlyDeposits - costToDate;
  const targetUnitsPerDay = remainingBudget > 0 
    ? (remainingBudget / pricePerUnit) / (remainingDays || 1) 
    : 0;

  return {
    consumedUnits,
    avgUnitsPerDay,
    predictedYearlyCost,
    balance: finalBalance,
    currentBalance,
    costToDate,
    depositsPaidSoFar, // Tato proměnná musí existovat
    targetUnitsPerDay,
    daysPassed
  };
};