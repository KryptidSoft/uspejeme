export interface EnergyInput {
  lastReadingValue: number;
  currentReadingValue: number;
  lastReadingDate: string;
  monthlyDeposit: number;
  pricePerUnit: number;
  isGasInM3?: boolean;
  isSeasonal?: boolean; 
}

export interface EnergyResult {
  consumedUnits: number;
  costToDate: number;
  depositsPaidSoFar: number;
  currentBalance: number;
  daysPassed: number;
  avgUnitsPerDay: number;
  targetUnitsPerDay: number;
  predictedYearlyCost: number;
  balance: number;
}

export const calculateEnergy = (data: EnergyInput): EnergyResult => {
  const { 
    lastReadingValue, 
    currentReadingValue, 
    lastReadingDate, 
    monthlyDeposit, 
    pricePerUnit,
    isSeasonal 
  } = data;

  const start = new Date(lastReadingDate);
  const now = new Date();
  
  if (isNaN(start.getTime()) || start > now) {
    return {
      consumedUnits: 0, costToDate: 0, depositsPaidSoFar: 0, currentBalance: 0,
      daysPassed: 0, avgUnitsPerDay: 0, targetUnitsPerDay: 0, predictedYearlyCost: 0, balance: 0
    };
  }

  const diffTime = now.getTime() - start.getTime();
  const daysPassed = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 1);

  const consumedUnits = currentReadingValue < lastReadingValue ? 0 : currentReadingValue - lastReadingValue;
  const costToDate = consumedUnits * pricePerUnit;

  const currentYear = now.getFullYear();
  const daysInYear = (currentYear % 4 === 0 && currentYear % 100 !== 0) || currentYear % 400 === 0 ? 366 : 365;
  
  const dailyDepositRate = (monthlyDeposit * 12) / daysInYear;
  const depositsPaidSoFar = dailyDepositRate * daysPassed;

  const currentBalance = depositsPaidSoFar - costToDate;
  const avgUnitsPerDay = consumedUnits / daysPassed;

  const totalYearlyDeposits = monthlyDeposit * 12;
  const remainingDays = Math.max(daysInYear - daysPassed, 0);
  
  const remainingBudget = totalYearlyDeposits - costToDate;
  const targetUnitsPerDay = (remainingDays > 0 && pricePerUnit > 0) 
    ? Math.max(remainingBudget / pricePerUnit / remainingDays, 0)
    : 0;

  // --- LOGIKA PREDIKCE (Fixní březnový cyklus) ---
  const standardYearlyUnits = avgUnitsPerDay * daysInYear;
  let predictedYearlyUnits = standardYearlyUnits;

  if (isSeasonal) {
    const currentMonth = now.getMonth(); // 0 = Leden, 11 = Prosinec
    
    // Léto (duben až září): spotřeba je nízká, musíme predikci navýšit o budoucí zimu
    const isSummerHalf = currentMonth >= 3 && currentMonth <= 8;

    if (isSummerHalf) {
      // Aktuální průměr je nízký, celoroční odhad násobíme nahoru
      predictedYearlyUnits = standardYearlyUnits * 1.65;
    } else {
      // Je zima (říjen až březen): aktuální průměr je vysoký, násobíme dolů, 
      // protože přijde letní útlum.
      predictedYearlyUnits = standardYearlyUnits * 0.75;
    }

    // Bezpečnostní pojistka: Předpokládaná roční spotřeba nemůže být nižší 
    // než to, co uživatel reálně propálil doteď.
    if (predictedYearlyUnits < consumedUnits) {
      predictedYearlyUnits = consumedUnits;
    }
  }

  const predictedYearlyCost = predictedYearlyUnits * pricePerUnit;
  const balance = totalYearlyDeposits - predictedYearlyCost;

  return {
    consumedUnits, 
    costToDate, 
    depositsPaidSoFar, 
    currentBalance,
    daysPassed, 
    avgUnitsPerDay, 
    targetUnitsPerDay, 
    predictedYearlyCost, 
    balance
  };
};