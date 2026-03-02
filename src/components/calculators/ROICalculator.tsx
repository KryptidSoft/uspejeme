import React, { useState, useMemo, useEffect } from "react";
import { TrendingUp, Share2, StickyNote, FileText, Info, Lightbulb, AlertCircle } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { InputGroup } from '../ui/InputGroup';
import { calculateROI } from "../../utils/calculations/roi";

export const ROICalculator: React.FC = () => {
  const [investment, setInvestment] = useState<number>(100000);
  const [initialCosts, setInitialCosts] = useState<number>(0);
  const [monthlyBenefit, setMonthlyBenefit] = useState<number>(10000);
  const [discountRate, setDiscountRate] = useState<number>(8);
  const [months, setMonths] = useState<number>(12);
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('inv')) {
      setInvestment(Number(params.get('inv')) || 100000);
      setInitialCosts(Number(params.get('ic')) || 0);
      setMonthlyBenefit(Number(params.get('ben')) || 10000);
      setDiscountRate(Number(params.get('dis')) || 8);
      setMonths(Number(params.get('m')) || 12);
    }
    const savedNotes = localStorage.getItem('roi_notes');
    if (savedNotes) setNotes(savedNotes);
  }, []);

  useEffect(() => {
    localStorage.setItem('roi_notes', notes);
  }, [notes]);

  const handleShare = () => {
    const params = new URLSearchParams({
      inv: investment.toString(),
      ic: initialCosts.toString(),
      ben: monthlyBenefit.toString(),
      dis: discountRate.toString(),
      m: months.toString()
    });
    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(shareUrl).then(() => alert("Odkaz na ROI analýzu zkopírován!"));
  };

  const handlePrint = () => window.print();

  const result = useMemo(() => {
    try {
      return calculateROI({ 
        investment: Number(investment), 
        initialCosts: Number(initialCosts), 
        monthlyCashflow: Number(monthlyBenefit), 
        discountRate: Number(discountRate), 
        months: Number(months) 
      });
    } catch (e) {
      return { npv: 0, roiPercent: 0, discountedPaybackMonths: null };
    }
  }, [investment, initialCosts, monthlyBenefit, discountRate, months]);

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      <GlassCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <TrendingUp size={28} color="var(--primary)" />
            <h2 style={{ margin: 0 }}>ROI Kalkulačka</h2>
          </div>
          
          <div className="no-print" style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handlePrint} className="nav-item" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', padding: '8px 15px', color: '#10b981' }}>
              <FileText size={14} /> EXPORT PDF
            </button>
            <button onClick={handleShare} className="nav-item" style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', padding: '8px 15px' }}>
              <Share2 size={14} /> SDÍLET ANALÝZU
            </button>
          </div>
        </div>

        <div className="calculator-grid">
          {/* LEVÁ STRANA: TEXT NAHOŘE + VSTUPY */}
          <div className="inputs-section">
            <div style={{ marginBottom: '20px', padding: '12px 15px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', borderLeft: '3px solid var(--primary)' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.5' }}>
                Vyplatí se vám ta investice – nebo to jen dobře zní? Tahle kalkulačka vám ukáže <strong>čísla bez emocí</strong>. Zadejte náklady a přínosy a uvidíte, jestli projekt skutečně dává smysl, nebo je to jen optimistický odhad.
              </p>
            </div>

            <div className="input-grid">
              <InputGroup label="Investice" unit="Kč" value={investment} onChange={v => setInvestment(Number(v))} />
              <InputGroup label="Počáteční náklady" unit="Kč" value={initialCosts} onChange={v => setInitialCosts(Number(v))} />
            </div>
            <div className="input-grid">
              <InputGroup label="Měsíční přínos" unit="Kč" value={monthlyBenefit} onChange={v => setMonthlyBenefit(Number(v))} />
              <InputGroup label="Diskontní sazba" unit="%" value={discountRate} onChange={v => setDiscountRate(Number(v))} />
            </div>
            <div className="no-print" style={{ marginTop: '10px' }}>
              <InputGroup label={`Doba sledování: ${months} měsíců`} type="range" min={1} max={60} value={months} onChange={v => setMonths(Number(v))} />
            </div>
          </div>

          {/* PRAVÁ STRANA: VÝSLEDKY + RADY DOLE */}
          <div className="results-section">
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '25px', borderRadius: '20px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-dim)' }}>Čistá hodnota (NPV):</span>
                <span style={{ fontWeight: 'bold', color: (result?.npv ?? 0) >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                  {Math.round(result?.npv ?? 0).toLocaleString()} Kč
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-dim)' }}>Návratnost (ROI):</span>
                <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{(result?.roiPercent ?? 0).toFixed(2)} %</span>
              </div>

              {/* DOPORUČENÍ POD VÝSLEDKY */}
              <div style={{ marginTop: '15px', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', textAlign: 'left', border: '1px dashed var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--accent)' }}>
                  <Lightbulb size={18} />
                  <strong style={{ fontSize: '0.9rem' }}>Rada pro investici</strong>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', margin: 0, lineHeight: '1.4' }}>
                  {(result?.roiPercent ?? 0) < 15 
                    ? "Pokud je ROI pod 15 % ročně, investici raději přehodnoťte. Počítejte s realistickou diskontní sazbou (kolem 8–10 %), aby vás nepřekvapila časová ztráta hodnoty peněz."
                    : "Čísla vypadají slibně! Nezapomeňte ale, že měsíční přínos by měl být spíše opatrný odhad než optimistický sen. Jen tak získáte skutečnou jistotu."
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
          <StickyNote size={20} color="var(--accent)" />
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Poznámky k investičnímu záměru</h3>
        </div>
        <textarea 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Např. Rizika projektu, zdroje dat, předpokládaný růst trhu..."
          className="notes-textarea"
          style={{ 
            width: '100%', 
            minHeight: '120px', 
            background: 'rgba(0,0,0,0.1)', 
            border: '1px solid var(--border)', 
            borderRadius: '12px', 
            color: 'white', 
            padding: '15px', 
            fontSize: '0.9rem',
            resize: 'vertical',
            outline: 'none'
          }}
        />
      </GlassCard>
      
      <div className="print-only" style={{ display: 'none', textAlign: 'center', fontSize: '0.8rem', opacity: 0.5, marginTop: '20px' }}>
        Vygenerováno aplikací Rozhodni.cz | {new Date().toLocaleDateString('cs-CZ')}
      </div>
    </div>
  );
};

export default ROICalculator;