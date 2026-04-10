import { useState, useEffect } from 'react';
// Zde je opravený import, který nyní hledá soubor localStorage.ts
import { getFromStorage, saveToStorage } from '../utils/localStorage';

/**
 * Hook pro správu stavu, který se automaticky ukládá do localStorage.
 * @param key Unikátní klíč, pod kterým se data uloží
 * @param initialValue Výchozí hodnota, pokud v úložišti nic není
 */
export function usePersistentState<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(() => {
    return getFromStorage<T>(key, initialValue);
  });

  useEffect(() => {
    saveToStorage(key, state);
  }, [key, state]);

  return [state, setState] as const;
}