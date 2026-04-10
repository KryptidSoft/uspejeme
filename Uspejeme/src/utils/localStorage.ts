/**
 * Prefix pro klíče aplikace, aby nedocházelo ke kolizím s jinými weby 
 * běžícími na stejném portu/doméně.
 */
const APP_PREFIX = 'uspejeme_';

/**
 * Bezpečné uložení dat do localStorage.
 * Přidává prefix ke klíči automaticky.
 */
export const saveToStorage = (key: string, value: unknown): void => {
  try {
    const serializedValue = JSON.stringify(value);
    window.localStorage.setItem(`${APP_PREFIX}${key}`, serializedValue);
  } catch (error) {
    // Zachytí např. QuotaExceededError (plné úložiště)
    console.warn(`Nepodařilo se uložit data pro klíč "${key}":`, error);
  }
};

/**
 * Bezpečné načtení dat z localStorage s typovou kontrolou.
 */
export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = window.localStorage.getItem(`${APP_PREFIX}${key}`);
    if (item === null) return defaultValue;

    return JSON.parse(item) as T;
  } catch (error) {
    console.warn(`Nepodařilo se načíst nebo parsovat data pro klíč "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Odstranění konkrétní položky.
 */
export const removeFromStorage = (key: string): void => {
  try {
    window.localStorage.removeItem(`${APP_PREFIX}${key}`);
  } catch (error) {
    console.error(`Chyba při odstraňování klíče "${key}":`, error);
  }
};

/**
 * Kompletní smazání dat patřících pouze této aplikaci.
 */
export const clearAppStorage = (): void => {
  try {
    // Bezpečnější iterace skrze klíče
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith(APP_PREFIX)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => window.localStorage.removeItem(key));
  } catch (error) {
    console.error("Chyba při mazání úložiště aplikace:", error);
  }
};