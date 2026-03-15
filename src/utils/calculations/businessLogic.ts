import type { BusinessData } from '../../hooks/useBusinessData';

// Pomocná funkce pro dynamické určení paušální daně podle příjmu (2026)
const getDynamicPausalAmount = (annualRevenue: number): number => {
  if (annualRevenue <= 1584440) return 9984;  // Pasmo 1
  if (annualRevenue <= 2000000) return 16745; // Pasmo 2
  return 27139;                               // Pasmo 3
};

export const calculateGrossFromNet = (
  netNeeded: number, 
  taxMode: string, 
  customTaxRate: number, 
  manualPausal: number
) => {
  if (taxMode === 'pausal_dan') {
    // Prvotní odhad pro určení pásma
    const roughGross = (netNeeded + manualPausal) * 12;
    const dynamicPausal = getDynamicPausalAmount(roughGross);
    return netNeeded + dynamicPausal;
  }
  // Standardní výpočet pro procentuální výdaje
  return netNeeded / (1 - (customTaxRate || 25) / 100);
};

export const calculateDashboardStats = (data: BusinessData) => {
  const rate = data.hourlyRate || 0;
  const exp = data.monthlyExpenses || 0;
  const netGoal = data.desiredNetIncome || 0; 
  const res = data.reserves || 0;
  const taxRate = data.taxReservePercent || 25; 
  const pausal = data.pausalAmount || 9984;

  // 1. EKONOMICKÁ ROVAHA
  const targetRevenue = calculateGrossFromNet(netGoal, data.taxMode, taxRate, pausal);
  const taxLiability = targetRevenue - netGoal;
  // 1. MARŽE ČISTÉHO ZISKU
  // Výpočet: (Čistý zisk po zdanění a výdajích / Celkový obrat) * 100
  const netProfitAfterAll = netGoal - exp;
  const profitMargin = targetRevenue > 0 ? (netProfitAfterAll / targetRevenue) * 100 : 0;
  
  // Vložit toto:
 const netAvailableCash = res - taxLiability;
 const disposableNet = netGoal - exp;   // Toto tu nech, potřebujeme to pro výpočet investic níže

  // 2. KAPACITA A WORKLOAD
  // Změna: 130 hodin jako realističtější udržitelný základ pro freelancera
  const standardCapacity = 130; 
  const requiredHours = rate > 0 ? Math.ceil(targetRevenue / rate) : 0;
  const workload = Math.round((requiredHours / standardCapacity) * 100);
  
  // Runway (kolik měsíců přežijete jen z úspor při nulovém příjmu)
  const monthlyTotalOutgoings = exp + (data.taxMode === 'pausal_dan' ? pausal : (taxLiability / 12));
  const runway = monthlyTotalOutgoings > 0 ? (res / monthlyTotalOutgoings) : 0;
  
  // Bod přežití (kolik hodin musíte odpracovat jen na náklady)
  const survivalHours = rate > 0 ? Math.ceil(monthlyTotalOutgoings / rate) : 0;

  // 3. DISTRIBUCE FINANCÍ (Pojistka)
  let safeToSpend = 0;
  let investAmount = 0;

  if (disposableNet > 0) {
    // Priorita: Pokud je runway < 3 měsíce, utrácíme 0 a vše sypeme do rezerv
    const savingsFocus = runway < 3 ? 0 : runway < 6 ? 0.5 : 1.0;
    
    let spendingMultiplier = runway >= 6 ? 0.4 : runway >= 3 ? 0.2 : 0;
    let investingMultiplier = runway >= 6 ? 0.3 : runway >= 3 ? 0.1 : 0;

    safeToSpend = disposableNet * spendingMultiplier * savingsFocus;
    investAmount = disposableNet * investingMultiplier * savingsFocus;
  }

  // 4. EFEKTIVITA
  // Započítáváme čas na administrativu/obchod (cca 20% času navíc)
  const totalTimeInvestment = requiredHours * 1.2;
  const effectiveRate = totalTimeInvestment > 0 ? (netGoal / totalTimeInvestment) : 0;

  // 5. PŘÍSNÉ HEALTH SCORE (0-100)
  // Pilíř 1: Finanční rezerva (max 40b) - Ideál je 6+ měsíců
  const stabilityPoints = Math.min((runway / 6) * 40, 40);
  
  // Pilíř 2: Pracovní vytížení (max 40b)
  let timePoints = 0;
  if (workload >= 60 && workload <= 90) {
    timePoints = 40; // "Sweet spot"
  } else if (workload < 60) {
    timePoints = 30; // Málo práce (podnikání nevyužito)
  } else if (workload <= 110) {
    timePoints = 15; // Mírné přetížení
  } else {
    timePoints = -30; // Kritické přetížení / Vyhoření
  }

  // Pilíř 3: Hodnota času (max 20b)
  const ratePoints = rate >= 1500 ? 20 : rate >= 1000 ? 15 : rate >= 600 ? 5 : 0;

  const healthScore = Math.max(0, Math.min(stabilityPoints + timePoints + ratePoints, 100));

return {
    rate, 
    exp, 
    netGoal, 
    res,
    targetRevenue, 
    taxLiability,
    profitMargin,
    netAvailableCash,
    disposableNet: netGoal - exp,    // <--- TOHLE JE VÁŠ ČISTÝ MĚSÍČNÍ PŘEBYTEK (netGoal - exp)
    requiredHours, 
    workload, 
    runway,
    survivalHours, 
    safeToSpend, 
    investAmount,
    effectiveRate, 
    healthScore: healthScore,
	singleClientRisk: data.topClientShare || 0
};
};