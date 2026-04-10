import { safeNumber } from './mathHelpers';

export interface ROIInputs {
  investment: number;
  initialCosts: number;
  monthlyCashflow: number; // Musí být monthlyCashflow
  discountRate: number;    // Zde budeme očekávat celé číslo (např. 8)
  months: number;
}

export const calculateROI = (data: ROIInputs) => {
  const investment = safeNumber(data.investment);
  const initialCosts = safeNumber(data.initialCosts);
  const monthlyCashflow = safeNumber(data.monthlyCashflow);
  // Dělíme stem pouze TADY, v komponentě už ne.
  const annualDiscountRate = safeNumber(data.discountRate) / 100;
  const targetMonths = safeNumber(data.months) || 12;

  const totalInitialInvestment = investment + initialCosts;
  const monthlyDiscountRate = annualDiscountRate / 12;
  
  let npv = -totalInitialInvestment;
  let runningCashFlow = -totalInitialInvestment;
  let simplePaybackMonths: number | null = null;
  let discountedPaybackMonths: number | null = null;

  for (let month = 1; month <= targetMonths; month++) {
    const discountFactor = Math.pow(1 + monthlyDiscountRate, month);
    const discountedBenefit = monthlyCashflow / discountFactor;
    
    npv += discountedBenefit;

    // Prostá návratnost
    if (simplePaybackMonths === null) {
      runningCashFlow += monthlyCashflow;
      if (runningCashFlow >= 0) simplePaybackMonths = month;
    }

    // Diskontovaná návratnost
    if (discountedPaybackMonths === null && npv >= 0) {
      discountedPaybackMonths = month;
    }
  }

  const roiPercent = totalInitialInvestment > 0 
    ? (npv / totalInitialInvestment) * 100 
    : 0;

  return {
    npv: Math.round(npv),
    roiPercent: Math.round(roiPercent * 100) / 100,
    simplePaybackMonths,
    discountedPaybackMonths,
    totalInvestment: totalInitialInvestment
  };
};