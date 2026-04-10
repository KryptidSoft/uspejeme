/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, type ReactNode, useEffect, useCallback } from 'react';
import { usePersistentState } from './usePersistentState';

export type BusinessType = 'hlavni' | 'vedlejsi' | 'vse' | 'all' | 'platec_dph';

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
  
    // Přidej tuto vlastnost
  safetyBufferMonths: number;
  
  billableHours?: number;
  vacationWeeks?: number;
  bufferDays?: number;
  nonBillableHours?: number;
  companyName?: string;
}

interface BusinessContextType {
  data: BusinessData;
  updateData: (newData: Partial<BusinessData>) => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

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
    hasBackup: false,
    safetyBufferMonths: 6
  });

  // Stabilní funkce pro aktualizaci dat
  const updateData = useCallback((newData: Partial<BusinessData>) => {
    setData(prev => {
      const updated = { ...prev, ...newData };

      // Automatické přepočty při změně režimů
      if (newData.pausalBand) {
        updated.pausalAmount = PAUSALNI_DAN_PASMA[newData.pausalBand];
      }

      if (newData.taxMode === 'pausal_dan') {
        updated.pausalAmount = PAUSALNI_DAN_PASMA[updated.pausalBand || 'pasmo1'];
      }

      if (updated.businessType === 'hlavni') {
        updated.socialMin = OSVC_MINIMALNI_ODVOZY.social;
        updated.healthMin = OSVC_MINIMALNI_ODVOZY.health;
      }

      // KLÍČOVÁ KONTROLA: Změnilo se reálně něco?
      const hasChanged = Object.keys(updated).some(
        key => updated[key as keyof BusinessData] !== prev[key as keyof BusinessData]
      );

      return hasChanged ? updated : prev;
    });
  }, [setData]);

  // JEDNORÁZOVÁ MIGRACE (z roku 2025 na 2026)
  useEffect(() => {
    const isOldAmount = data.pausalAmount === 8916 || data.pausalAmount === 8914;
    if (isOldAmount) {
      updateData({ 
        pausalAmount: PAUSALNI_DAN_PASMA[data.pausalBand || 'pasmo1'] 
      });
    }
  }, [data.pausalAmount, data.pausalBand, updateData]);

  // Debug logování v dev režimu
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