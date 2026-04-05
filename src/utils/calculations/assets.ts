export const RATES = {
  GOLD_G: 3203,
  SILVER_G: 51,
  BTC: 1428045,
  CHF: 26.61
};

export const convertFiatToAssets = (czk: number) => {
  return {
    gold: (czk / RATES.GOLD_G).toFixed(3),
    silver: (czk / RATES.SILVER_G).toFixed(3),
    btc: (czk / RATES.BTC).toFixed(8),
    chf: (czk / RATES.CHF).toFixed(2)
  };
};