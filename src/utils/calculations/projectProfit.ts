// utils/calculations/projectProfit.ts
import { safeNumber } from './mathHelpers';

export interface ProjectInput {
  name: string;
  client: string;
  price: number;
  materialCosts: number;
  softwareCosts: number;
  energyCosts: number;
  otherCosts: number;
  prepHours: number;
  workHours: number;
  adminHours: number;
  riskFactor: number;
}

export interface ProjectResult extends ProjectInput {
  totalHours: number;
  netProfit: number;
  adjustedProfit: number;
  roiPerHour: number;
}

export const calculateProjectProfit = (
  projects: ProjectInput[],
  hourlyRate: number
): ProjectResult[] => {
  return projects.map((p) => {
    const totalHours = safeNumber(p.prepHours) + safeNumber(p.workHours) + safeNumber(p.adminHours);
    
    // Náklady na tvůj čas
    const timeCost = safeNumber(hourlyRate) * totalHours;
    
    // Přímé náklady
    const directCosts = 
      safeNumber(p.materialCosts) + 
      safeNumber(p.softwareCosts) + 
      safeNumber(p.energyCosts) + 
      safeNumber(p.otherCosts);

    const netProfit = safeNumber(p.price) - directCosts - timeCost;
    
    // Riziko snižuje čistý zisk (př. 0.1 = 10% dolů)
    const adjustedProfit = netProfit * (1 - safeNumber(p.riskFactor));
    const roiPerHour = totalHours > 0 ? adjustedProfit / totalHours : 0;

    return { ...p, totalHours, netProfit, adjustedProfit, roiPerHour };
  });
};