import React, { useState, useMemo } from "react";
import { TrendingUp, FileDown, Table } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { InputGroup } from '../ui/InputGroup';
import { calculateROI } from "../../utils/calculations/roi";

export const ROICalculator: React.FC = () => {
  const [investment, setInvestment] = useState<number>(100000);
  const [initialCosts, setInitialCosts] = useState<number>(0);
  const [monthlyBenefit, setMonthlyBenefit] = useState<number>(10000);
  const [discountRate, setDiscountRate] = useState<number>(8);
  const [months, setMonths] = useState<number>(12);

  const result = useMemo(() => {
    // Posíláme čistá čísla, funkce v roi.ts si zajistí zbytek
    return calculateROI({ 
      investment: Number(investment), 
      initialCosts: Number(initialCosts), 
      monthlyCashflow: Number(monthlyBenefit), 
      discountRate: Number(discountRate), 
      months: Number(months) 
    });
  }, [investment, initialCosts, monthlyBenefit, discountRate, months]);

  // Funkce pro lidsky srozumitelný formát času
  const formatTime = (totalMonths: number | null) => {
    if (totalMonths === null || totalMonths <= 0) return "V horizontu nenastane";
    
    // 1. PŘÍPAD: Méně než měsíc (zobrazení ve dnech)
    if (totalMonths < 1) {
      const days = Math.round(totalMonths * 30.44);
      if (days === 0) return "Okamžitě";
      return `${days} ${days === 1 ? 'den' : (days < 5 ? 'dny' : 'dní')}`;
    }
    
    // 2. PŘÍPAD: Méně než rok (zobrazení v měsících)
    if (totalMonths < 12) {
      const m = Math.round(totalMonths);
      return `${m} ${m === 1 ? 'měsíc' : (m < 5 ? 'měsíce' : 'měsíců')}`;
    }
    
    // 3. PŘÍPAD: Rok a více (kombinované zobrazení)
    const years = Math.floor(totalMonths / 12);
    const remainingMonths = Math.round(totalMonths % 12);
    
    let resultStr = `${years} ${years === 1 ? 'rok' : (years < 5 ? 'roky' : 'let')}`;
    if (remainingMonths > 0) {
      resultStr += ` a ${remainingMonths} ${remainingMonths === 1 ? 'měsíc' : (remainingMonths < 5 ? 'měsíce' : 'měsíců')}`;
    }
    return resultStr;
  };

  const handleExportPDF = () => alert("Export do PDF se připravuje.");
  const handleExportCSV = () => alert("Export do CSV se připravuje.");

  return (
    <GlassCard className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
        <TrendingUp size={28} color="var(--primary)" />
        <h2 style={{ margin: 0 }}>ROI Kalkulačka (DCF analýza)</h2>
      </div>

      <div className="calculator-grid">
        {/* LEVÝ SLOUPEC: VSTUPY */}
        <div className="inputs-section">
          <InputGroup 
            label="Investice" 
            unit="Kč" 
            value={investment} 
            onChange={v => setInvestment(Number(v))}
            tooltip="Celková kapitálová investice (např. nákup technologie)."
          />
          
          <InputGroup 
            label="Počáteční náklady" 
            unit="Kč" 
            value={initialCosts} 
            onChange={v => setInitialCosts(Number(v))}
            tooltip="Jednorázové náklady na instalaci či školení."
          />

          <InputGroup 
            label="Měsíční přínos" 
            unit="Kč" 
            value={monthlyBenefit} 
            onChange={v => setMonthlyBenefit(Number(v))}
            tooltip="Očekávaný měsíční zisk nebo úspora."
          />

          <InputGroup 
            label="Diskontní sazba" 
            unit="%" 
            value={discountRate} 
            onChange={v => setDiscountRate(Number(v))}
            tooltip="Očekávaný výnos alternativní investice (inflace + rezerva)."
          />
          
          <InputGroup 
            label="Časový horizont" 
            unit="měsíců" 
            type="range" min={1} max={60} 
            value={months} 
            onChange={v => setMonths(Number(v))}
            tooltip="Doba sledování návratnosti."
          />
        </div>

        {/* PRAVÝ SLOUPEC: VÝSLEDKY */}
        <div className="results-section" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '25px', borderRadius: '20px', border: '1px solid var(--border)' }}>
            
            <div style={{ marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Čistá současná hodnota (NPV):</span>
              <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: (result?.npv ?? 0) >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                {Math.round(result?.npv ?? 0).toLocaleString()} Kč
              </span>
            </div>
            
            <div style={{ marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Diskontované ROI:</span>
              <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{(result?.roiPercent ?? 0).toFixed(2)}%</span>
            </div>

            <div style={{ marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Návratnost (prostá):</span>
              <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                {formatTime(result?.simplePaybackMonths)}
              </span>
            </div>

            <div style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Reálná návratnost:</span>
              <span style={{ fontWeight: 'bold', fontSize: '1rem', color: result?.discountedPaybackMonths ? 'var(--text)' : 'var(--text-dim)' }}>
                {formatTime(result?.discountedPaybackMonths)}
              </span>
            </div>

            {/* TLAČÍTKA EXPORTU */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleExportPDF} className="calculate-btn" style={{ flex: 1, fontSize: '0.85rem' }}>
                <FileDown size={18} /> PDF
              </button>
              <button onClick={handleExportCSV} className="calculate-btn" style={{ flex: 1, fontSize: '0.85rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}>
                <Table size={18} /> CSV
              </button>
            </div>
          </div>

          <p className="disclaimer-text">
            Výpočet využívá metodu diskontovaných peněžních toků (DCF). Referenční kurzy jsou orientační.
          </p>
        </div>
      </div>
    </GlassCard>
  );
};

export default ROICalculator;