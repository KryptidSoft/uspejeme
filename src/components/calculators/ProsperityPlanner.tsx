import React, { useState, useMemo, useEffect } from 'react'; 
import { Target, Save, AlertCircle, Share2, FileText, Lightbulb, TrendingUp } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { InputGroup } from '../ui/InputGroup';
import { formatCZK } from '../../utils/calculations/mathHelpers';

export const ProsperityPlanner: React.FC = () => {
  const [data, setData] = useState({
    monthlyExpenses: 40000,
    desiredSavings: 15000,
    billableHours: 100,
    safetyBufferMonths: 6,
    taxMode: 'pausal_dan',
    customTaxRate: 25,
    pausalAmount: 8916,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('exp') || params.has('sav')) {
      setData({
        monthlyExpenses: Number(params.get('exp')) || data.monthlyExpenses,
        desiredSavings: Number(params.get('sav')) || data.desiredSavings,
        billableHours: Number(params.get('hrs')) || data.billableHours,
        safetyBufferMonths: Number(params.get('buf')) || data.safetyBufferMonths,
        taxMode: params.get('tax') || data.taxMode,
        customTaxRate: Number(params.get('rate')) || data.customTaxRate,
        pausalAmount: Number(params.get('pamt')) || data.pausalAmount,
      });
    } else {
      const saved = localStorage.getItem('last_planner_data');
      if (saved) {
        try { setData(JSON.parse(saved)); } catch (e) { console.error("Chyba načítání", e); }
      }
    }
  }, []);

  const analysis = useMemo(() => {
    const netNeeded = data.monthlyExpenses + data.desiredSavings;
    let grossNeeded = 0;
    let taxNote = "";

    if (data.taxMode === 'pausal_dan') {
      grossNeeded = netNeeded + (data.pausalAmount || 0);
      taxNote = `Včetně paušálu ${formatCZK(data.pausalAmount || 0)}`;
    } else if (data.taxMode === 'vydaje_60') {
      grossNeeded = netNeeded / 0.78;
      taxNote = "Odhad odvodů při 60% paušálu";
    } else {
      grossNeeded = netNeeded / (1 - data.customTaxRate / 100);
      taxNote = "Dle vašeho odhadu zdanění";
    }

    const hourlyRate = Math.ceil(grossNeeded / data.billableHours);
    const totalReserveGoal = data.monthlyExpenses * data.safetyBufferMonths;
    
    return { hourlyRate, grossNeeded, totalReserveGoal, taxNote };
  }, [data]);

  const handleSave = () => {
    localStorage.setItem('last_planner_data', JSON.stringify(data));
    alert("Strategie uložena do prohlížeče.");
  };

  const handleShare = () => {
    const params = new URLSearchParams({
      exp: data.monthlyExpenses.toString(),
      sav: data.desiredSavings.toString(),
      hrs: data.billableHours.toString(),
      buf: data.safetyBufferMonths.toString(),
      tax: data.taxMode,
      pamt: data.pausalAmount.toString()
    });
    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(shareUrl).then(() => alert("Odkaz na strategii zkopírován!"));
  };

  const handlePrint = () => window.print();

  return (
    <div className="fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '25px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <GlassCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Target size={32} color="var(--primary)" />
                <h2 style={{ margin: 0 }}>Plánovač prosperity</h2>
              </div>
              <div className="no-print" style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handlePrint} className="nav-item" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', padding: '8px 15px', color: '#10b981' }}>
                  <FileText size={14} /> PDF
                </button>
                <button onClick={handleShare} className="nav-item" style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', padding: '8px 15px' }}>
                  <Share2 size={14} /> SDÍLET
                </button>
              </div>
            </div>

            {/* TEXT NAHOŘE VLEVO */}
            <div style={{ marginBottom: '25px', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', borderLeft: '3px solid var(--primary)' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.5' }}>
                Kolik musíte vydělávat, aby váš život fungoval a rostl? Plánovač prosperity spojuje vaše náklady, daně i fakturovatelné hodiny do jednoho čísla. <strong>Už žádné střílení od boku</strong> – zjistěte svou skutečnou nutnou hodinovku.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <section>
                <h3 style={{ fontSize: '1rem', color: 'var(--accent)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={18} /> Životní standard
                </h3>
                <InputGroup label="Měsíční náklady" unit="Kč" value={data.monthlyExpenses} onChange={(v) => setData({...data, monthlyExpenses: Number(v)})} tooltip="Nájem, jídlo, režie, pojištění..." />
                <InputGroup label="Měsíční spoření" unit="Kč" value={data.desiredSavings} onChange={(v) => setData({...data, desiredSavings: Number(v)})} tooltip="Kolik chcete měsíčně odložit na investice a rezervu." />
                <div className="no-print">
                  <InputGroup label={`Rezerva: ${data.safetyBufferMonths} měs.`} unit="měs" type="range" min={1} max={12} value={data.safetyBufferMonths} onChange={(v) => setData({...data, safetyBufferMonths: Number(v)})} />
                </div>
              </section>

              <section>
                <h3 style={{ fontSize: '1rem', color: 'var(--accent)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={18} /> Daňový režim
                </h3>
                <select 
                  value={data.taxMode} 
                  onChange={(e) => setData({...data, taxMode: e.target.value})}
                  style={{ width: '100%', padding: '12px', background: '#1e293b', color: 'white', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '20px', outline: 'none' }}
                >
                  <option value="pausal_dan">Paušální daň (1. pásmo)</option>
                  <option value="vydaje_60">Výdajový paušál (60%)</option>
                  <option value="realne_vydaje">Skutečné výdaje / Jiné</option>
                </select>

                {data.taxMode === 'pausal_dan' && (
                  <InputGroup label="Měsíční paušál" unit="Kč" value={data.pausalAmount} onChange={(v) => setData({...data, pausalAmount: Number(v)})} />
                )}

                <InputGroup label="Fakturovatelné hodiny" unit="h/měs" value={data.billableHours} onChange={(v) => setData({...data, billableHours: Number(v)})} tooltip="Reálný počet hodin, které měsíčně vyúčtujete klientům (ne čas strávený administrativou)." />
              </section>
            </div>
          </GlassCard>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #1d4ed8 100%)', padding: '30px', borderRadius: '24px', textAlign: 'center', color: 'white', boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)' }}>
            <span style={{ fontSize: '0.9rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '1px' }}>Cílová hodinovka</span>
            <div style={{ fontSize: '3.2rem', fontWeight: 'bold', margin: '10px 0' }}>{formatCZK(analysis.hourlyRate)}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{analysis.taxNote}</div>
          </div>

          <GlassCard>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                 <span style={{ color: 'var(--text-dim)' }}>Měsíční obrat:</span>
                 <span style={{ fontWeight: 'bold' }}>{formatCZK(analysis.grossNeeded)}</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                 <span style={{ color: 'var(--text-dim)' }}>Cílová rezerva:</span>
                 <span style={{ fontWeight: 'bold' }}>{formatCZK(analysis.totalReserveGoal)}</span>
               </div>
               
               {/* RADY A DOPORUČENÍ VLEVO DOLE V PANELU */}
               <div style={{ marginTop: '10px', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px dashed var(--border)' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--accent)' }}>
                   <Lightbulb size={18} />
                   <strong style={{ fontSize: '0.85rem' }}>Akční doporučení</strong>
                 </div>
                 <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: 0, lineHeight: '1.4' }}>
                   Pokud vaše současná sazba neodpovídá této hodnotě, <strong>upravte ceny u klientů</strong> hned příští měsíc. Počítejte s tím, že fakturovatelné hodiny musí být reálné – podcenění času na administrativu je nejčastější chyba.
                 </p>
               </div>

               <button onClick={handleSave} className="calculate-btn no-print" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '10px' }}>
                 <Save size={18} /> Uložit strategii
               </button>
             </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default ProsperityPlanner;