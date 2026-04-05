/* eslint-disable @typescript-eslint/no-explicit-any */
export const calculateEnergy = (data: Record<string, any>) => {
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

  const consumedUnits = currentReadingValue - lastReadingValue;
  const costToDate = consumedUnits * pricePerUnit;

  // 2. Zálohy
  const monthlyRate = monthlyDeposit;
  const dailyDepositRate = (monthlyRate * 12) / 365;
  const depositsPaidSoFar = dailyDepositRate * daysPassed;
  const totalYearlyDeposits = monthlyDeposit * 12;

  // 3. Bilance a doporučený limit (TOTO MUSÍ BÝT PŘED PREDIKCÍ)
  const remainingDays = 365 - daysPassed;
  const remainingBudget = totalYearlyDeposits - costToDate;
  
  // Definujeme targetUnitsPerDay
  const targetUnitsPerDay = remainingBudget > 0 
    ? (remainingBudget / pricePerUnit) / (remainingDays || 1) 
    : 0;

  // 4. Predikce na rok (teď už můžeme použít targetUnitsPerDay)
  const predictedYearlyUnits = targetUnitsPerDay * 365;
  const predictedYearlyCost = predictedYearlyUnits * pricePerUnit;

  // 5. Finální výsledky
  const finalBalance = totalYearlyDeposits - predictedYearlyCost;
  const currentBalance = depositsPaidSoFar - costToDate;

  return {
    consumedUnits,
    targetUnitsPerDay,
    predictedYearlyCost,
    balance: finalBalance,
    currentBalance,
    costToDate,
    depositsPaidSoFar, // Tato proměnná musí existovat
    daysPassed
  };
};