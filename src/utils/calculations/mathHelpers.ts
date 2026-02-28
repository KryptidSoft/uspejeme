/**
 * Zajišťuje, že hodnota je vždy platné číslo. 
 * Pokud není (např. prázdný řetězec nebo text), vrátí 0 nebo definované minimum.
 */
export const safeNumber = (value: any, min: number = 0): number => {
  const num = parseFloat(value);
  return isNaN(num) ? min : num;
};

/**
 * Omezí číslo mezi minimální a maximální hodnotu.
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Zformátuje číslo jako měnu (např. 1 000 Kč).
 */
export const formatCZK = (value: number): string => {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Zformátuje číslo jako procento.
 */
export const formatPercent = (value: number): string => {
  return `${value.toFixed(1)} %`;
};

/**
 * Zaokrouhlí číslo na daný počet desetiných míst.
 */
export const roundTo = (value: number, decimals: number): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};