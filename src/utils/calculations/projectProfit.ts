// utils/calculations/projectProfit.ts

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
  riskFactor: number; // 0–1
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
    const totalHours = p.prepHours + p.workHours + p.adminHours;
    const netProfit =
      p.price - 
      (p.materialCosts + p.softwareCosts + p.energyCosts + p.otherCosts) - 
      hourlyRate * totalHours;
    const adjustedProfit = netProfit * (1 - p.riskFactor);
    const roiPerHour = totalHours ? adjustedProfit / totalHours : 0;
    return { ...p, totalHours, netProfit, adjustedProfit, roiPerHour };
  });
};