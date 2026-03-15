import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { usePersistentState } from './usePersistentState';

export interface BusinessData {
  // Finanční základy
  hourlyRate: number;
  monthlyExpenses: number;
  desiredNetIncome: number;
  reserves: number;

  // Daňový režim
  taxMode: 'pausal_dan' | 'vydaje_60' | 'skutecne_vydaje';
  pausalBand: 'pasmo1' | 'pasmo2' | 'pasmo3';
  pausalAmount: number; // aktuální částka paušální daně
  vatMode: 'neplatce' | 'platce' | 'identifikovana_osoba';

  // Sociální a zdravotní
  businessType: 'hlavni' | 'vedlejsi';
  socialMin: number;
  healthMin: number;

  // Klientská diverzifikace & stabilita
  topClientShare: number;  // % příjmu od největšího klienta
  incomeStability: number; // 0–100

  // Pokročilé metriky
  roi?: number;
  stability?: number;
  progress?: number;

  // Rezerva na daň
  taxReservePercent: number;
}

interface BusinessContextType {
  data: BusinessData;
  updateData: (newData: Partial<BusinessData>) => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

// Logger jen pro vývoj
const logger = (msg: string, payload?: any) => {
  if (import.meta.env.DEV) {
    console.log(`[BusinessContext] ${msg}`, payload || '');
  }
};

// Paušální daň 2026 podle pásma
export const PAUSALNI_DAN_PASMA = {
  pasmo1: 9984,
  pasmo2: 16745,
  pasmo3: 27139
};

// Minimální zálohy OSVČ 2026
export const OSVC_MINIMALNI_ODVOZY = {
  social: 5720,
  health: 3306
};

export const BusinessProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = usePersistentState<BusinessData>('uspejeme_global_data', {
    hourlyRate: 0,
    monthlyExpenses: 30000,
    desiredNetIncome: 60000,
    reserves: 0,

    taxMode: 'pausal_dan',
    pausalBand: 'pasmo1',
    pausalAmount: PAUSALNI_DAN_PASMA.pasmo1,
    vatMode: 'neplatce',

    businessType: 'hlavni',
    socialMin: OSVC_MINIMALNI_ODVOZY.social,
    healthMin: OSVC_MINIMALNI_ODVOZY.health,

    topClientShare: 0,
    incomeStability: 100,

    roi: undefined,
    stability: undefined,
    progress: undefined,

    taxReservePercent: 25
  });

  const updateData = (newData: Partial<BusinessData>) => {
    logger("Přijímám nová data k uložení:", newData);
    setData(prev => {
      const updated = { ...prev, ...newData };
      // Aktualizace paušální částky při změně pásma
      if (newData.pausalBand) {
        updated.pausalAmount = PAUSALNI_DAN_PASMA[newData.pausalBand];
      }
      return updated;
    });
  };

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log("Aktuální stav BusinessContext:", data);
    }
  }, [data]);

  return (
    <BusinessContext.Provider value={{ data, updateData }}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusinessData = () => {
  const ctx = useContext(BusinessContext);
  if (!ctx) throw new Error('useBusinessData must be used within BusinessProvider');
  return ctx;
};