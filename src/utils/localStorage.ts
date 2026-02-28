/**
 * Bezpečné uložení dat do localStorage s fallbackem.
 */
export const saveToStorage = (key: string, value: any): void => {
  try {
    const serializedValue = JSON.stringify(value);
    window.localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.warn(`Nepodařilo se uložit data pro klíč "${key}":`, error);
  }
};

/**
 * Bezpečné načtení dat z localStorage.
 */
export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Nepodařilo se načíst data pro klíč "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Kompletní smazání dat aplikace.
 */
export const clearAppStorage = (): void => {
  try {
    Object.keys(localStorage)
      .filter(key => key.startsWith('rozhodni_'))
      .forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error("Chyba při mazání úložiště:", error);
  }
};