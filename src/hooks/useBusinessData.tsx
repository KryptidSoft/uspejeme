import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { usePersistentState } from './usePersistentState';

export interface BusinessData {
  hourlyRate: number;
  monthlyExpenses: number;
  desiredNetIncome: number;
  taxReservePercent: number;
}

interface BusinessContextType {
  data: BusinessData;
  updateData: (newData: Partial<BusinessData>) => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const BusinessProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = usePersistentState<BusinessData>('rozhodni_global_data', {
    hourlyRate: 0,
    monthlyExpenses: 30000,
    desiredNetIncome: 60000,
    taxReservePercent: 25,
  });

  // Funkce pro aktualizaci dat s logem
  const updateData = (newData: Partial<BusinessData>) => {
    console.log("Context: Přijímám nová data k uložení:", newData);
    setData(prev => {
      const updated = { ...prev, ...newData };
      console.log("Context: Nový stav odeslán do persistence:", updated);
      return updated;
    });
  };

  // Sledování změn (pro ladění)
  useEffect(() => {
    console.log("Context: Aktuální stav v paměti:", data);
  }, [data]);

  return (
    <BusinessContext.Provider value={{ data, updateData }}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusinessData = () => {
  const context = useContext(BusinessContext);
  if (!context) throw new Error('useBusinessData must be used within BusinessProvider');
  return context;
};