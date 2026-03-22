export const calculateBusinessImpact = (data: {
  monthlyProfit: number; // To, co reálně zbude (příjem - výdaje - daně)
  currentReserves: number;
  itemPrice: number;
  expectedRoi?: number; // Kolik podnikateli vydělávají peníze v byznysu (např. 20 %)
}) => {
  const profit = data.monthlyProfit || 1;
  const reserves = data.currentReserves;
  const price = data.itemPrice;
  const roi = (data.expectedRoi || 0) / 100;

  // 1. Index zranitelnosti (Kolik % rezervy padne)
  const reserveDrop = (price / (reserves || 1)) * 100;

  // 2. Cena ušlé příležitosti za 1 rok (ROI)
  // Kdyby ty peníze neprojedl, ale otočil v byznysu
  const lostOpportunity = price * roi;

  // 3. Doba regenerace (Jak dlouho bude vydělávat čistě jen na tuhle věc)
  const recoveryMonths = price / profit;

  // 4. Bezpečnostní verdikt
  let verdict = "";
  let color = "#ef4444"; // default red
  
  if (reserveDrop < 10 && recoveryMonths < 1) {
    verdict = "STRATEGICKY ZANEDBATELNÉ. Kup to a neřeš to.";
    color = "#10b981";
  } else if (reserveDrop > 50) {
    verdict = "FINANČNÍ SEBEVRAŽDA. Nákup ohrožuje stabilitu firmy.";
  } else {
    verdict = "VYŽADUJE PLÁNOVÁNÍ. Rezerva se bude hojit příliš dlouho.";
    color = "#f59e0b";
  }

  return {
    reserveDrop: Math.round(reserveDrop),
    lostOpportunity: Math.round(lostOpportunity),
    recoveryMonths: Math.round(recoveryMonths * 10) / 10,
    verdict,
    color
  };
};