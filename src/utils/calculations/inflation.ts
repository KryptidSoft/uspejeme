export interface InflationPoint {
  year: number;
  value: number; // Toto zůstane pro CZK
  [key: string]: number; // Dynamické klíče pro zlato, btc, atd.
}

export function calculateInflationValue(
  amount: number,
  inflationRate: number,
  years: number
): number {
  return amount / Math.pow(1 + inflationRate / 100, years);
}

// Nová funkce pro srovnání
export function generateComparisonSeries(
  amount: number,
  inflationRate: number,
  years: number,
  activeAssets: { id: string; growth: number }[]
): InflationPoint[] {
  const data: InflationPoint[] = [];

  for (let year = 0; year <= years; year++) {
    const point: InflationPoint = {
      year,
      value: Math.round(amount / Math.pow(1 + inflationRate / 100, year)),
    };

    // Přidáme data pro každé zaškrtnuté aktivum
    activeAssets.forEach(asset => {
      // Výpočet: původní částka * (1 + růst/100)^rok
      point[asset.id] = Math.round(amount * Math.pow(1 + asset.growth / 100, year));
    });

    data.push(point);
  }

  return data;
}