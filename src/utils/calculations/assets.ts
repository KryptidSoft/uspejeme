export const RATES = {
  GOLD_G: 3195,
  SILVER_G: 50,
  BTC: 1486520,
  CHF: 26.34
};

export const convertFiatToAssets = (czk: number) => {
  return {
    gold: (czk / RATES.GOLD_G).toFixed(3),
    silver: (czk / RATES.SILVER_G).toFixed(3),
    btc: (czk / RATES.BTC).toFixed(8),
    chf: (czk / RATES.CHF).toFixed(2)
  };
};