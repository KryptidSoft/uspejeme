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
  
  // PŘIDEJTE TYTO TŘI ŘÁDKY:
  hasContracts: boolean;
  hasDeposits: boolean;
  hasBackup: boolean;

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

export const OSVC_MINIMALNI_ODVOZY = {
  social: 6723,
  health: 3161
};

export const BusinessProvider = ({ children }: { children: ReactNode }) => {
const [data, setData] = usePersistentState<BusinessData>('uspejeme_global_data', {
  hourlyRate: 0,
  monthlyExpenses: 30000,
  desiredNetIncome: 60000,
  reserves: 0,
  taxMode: 'pausal_dan',
  pausalBand: 'pasmo1',
  pausalAmount: 9984,
  vatMode: 'neplatce',
  businessType: 'hlavni',
  socialMin: 6723,
  healthMin: 3161,
  topClientShare: 0,
  incomeStability: 100,
  taxReservePercent: 25,
  hasContracts: false,
  hasDeposits: false,
  hasBackup: false
});

useEffect(() => {
    // Kontrola na staré částky z roku 2025
    if (data.pausalAmount === 8916 || data.pausalAmount === 8914) {
      // Místo updateData to zapište přímo do setData, aby to bylo okamžité
      setData(prev => ({
        ...prev,
        pausalAmount: PAUSALNI_DAN_PASMA[prev.pausalBand || 'pasmo1']
      }));
    }
  }, []); // Spustí se jen jednou při načtení

  const updateData = (newData: Partial<BusinessData>) => {
    logger("Přijímám nová data k uložení:", newData);
    setData(prev => {
      const updated = { ...prev, ...newData };

      // 1. Pokud se mění pásmo, automaticky nastavíme správnou částku
      if (newData.pausalBand) {
        updated.pausalAmount = PAUSALNI_DAN_PASMA[newData.pausalBand];
      }

      // 2. Pokud se mění taxMode na paušál, zajistíme, že tam není stará hodnota
      if (newData.taxMode === 'pausal_dan') {
        updated.pausalAmount = PAUSALNI_DAN_PASMA[updated.pausalBand];
      }

      // 3. Zajištění minimálních odvodů 2026 pro výpočty mimo paušál
      if (updated.businessType === 'hlavni') {
        updated.socialMin = OSVC_MINIMALNI_ODVOZY.social;
        updated.healthMin = OSVC_MINIMALNI_ODVOZY.health;
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