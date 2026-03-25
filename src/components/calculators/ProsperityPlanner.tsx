import React, { useState, useMemo } from 'react'; 
import { 
  Target, Save, AlertCircle, FileText, 
  TrendingUp, Check, Zap, BookOpen, ShieldCheck, 
  Clock, DollarSign 
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { InputGroup } from '../ui/InputGroup';
import { formatCZK } from '../../utils/calculations/mathHelpers';
import { useBusinessData } from '../../hooks/useBusinessData';
import { calculateGrossFromNet } from '../../utils/calculations/businessLogic';

export const ProsperityPlanner: React.FC = () => {
  const { data: globalData, updateData } = useBusinessData();
  const [saved, setSaved] = useState(false);

  // STAV: Musí být uvnitř ProsperityPlanner, aby viděl na globalData
  const [data, setData] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('exp')) {
      return {
        monthlyExpenses: Number(params.get('exp')),
        desiredSavings: Number(params.get('sav')),
        billableHours: Number(params.get('hrs')),
        safetyBufferMonths: Number(params.get('buf')),
        taxMode: params.get('tax') || 'pausal_dan',
        customTaxRate: Number(params.get('rate')) || 25,
        pausalAmount: Number(params.get('pamt')) || 9984,
      };
    }

    const savedLocal = localStorage.getItem('last_planner_data');
    if (savedLocal) {
      try { return JSON.parse(savedLocal); } catch (e) { console.error(e); }
    }

    return {
      monthlyExpenses: globalData.monthlyExpenses || 40000,
      desiredSavings: 15000,
      billableHours: 100,
      safetyBufferMonths: 6,
      taxMode: 'pausal_dan',
      customTaxRate: 25,
      pausalAmount: 9984,
    };
  });

  const analysis = useMemo(() => {
    const monthlyExpenses = Number(data.monthlyExpenses || globalData.monthlyExpenses || 0);
    const desiredSavings = Number(data.desiredSavings || 0);
    const billableHours = Number(data.billableHours || 1);
    const safetyBufferMonths = Number(data.safetyBufferMonths || 0);
    
    const netNeeded = monthlyExpenses + desiredSavings;
    const grossNeeded = calculateGrossFromNet(
      netNeeded, 
      data.taxMode as any, 
      Number(data.customTaxRate), 
      Number(data.pausalAmount)
    );

    const hourlyRate = Math.ceil(grossNeeded / billableHours);
    const totalReserveGoal = monthlyExpenses * safetyBufferMonths;

    return { 
      hourlyRate, 
      grossNeeded, 
      totalReserveGoal, 
      netNeeded,
      taxNote: data.taxMode === 'pausal_dan' 
        ? `Včetně paušálu ${formatCZK(data.pausalAmount)}` 
        : data.taxMode === 'vydaje_60' 
          ? "Odhad odvodů při 60% paušálu" 
          : "Dle vašeho odhadu zdanění"
    };
  }, [data, globalData]);

  const handleSave = () => {
    localStorage.setItem('last_planner_data', JSON.stringify(data));
    updateData({
      hourlyRate: analysis.hourlyRate,
      monthlyExpenses: Number(data.monthlyExpenses),
      desiredNetIncome: analysis.netNeeded,
      taxReservePercent: Number(data.customTaxRate),
      taxMode: data.taxMode as any,
      reserves: analysis.totalReserveGoal
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fade-in app-container">
      
      {/* --- ÚVODNÍ SEKCE: STRATEGICKÝ KONTEXT --- */}
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '15px', fontWeight: '800' }}>Plánovač finanční prosperity</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', maxWidth: '850px', margin: '0 auto', lineHeight: '1.7' }}>
          Většina freelancerů dělá chybu, že svou hodinovou sazbu "střílí od boku". <strong>Tento plánovač to mění. </strong> 
          Spojuje vaše životní náklady, daně a ambice do jedné vítězné strategie. Zjistěte, kolik musíte reálně fakturovat, abyste ne jen přežívali, ale skutečně rostli.
        </p>
      </div>

      <div className="calculator-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <GlassCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Target size={32} color="var(--primary)" />
                <h2 style={{ margin: 0 }}>Vstupní parametry</h2>
              </div>
              <div className="no-print" style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => window.print()} className="nav-item" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', padding: '8px 15px', color: '#10b981' }}>
                  <FileText size={14} /> TISK REPORTU
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '25px', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', borderLeft: '3px solid var(--primary)' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.5' }}>
                💡 <strong>Data se propisují:</strong> Jakmile si zde nastavíte svou cílovou strategii a uložíte ji, ostatní kalkulačky na webu budou automaticky pracovat s těmito hodnotami.
              </p>
            </div>

            <div className="smart-grid" style={{ gap: '20px' }}>
              <section>
                <h3 style={{ fontSize: '1rem', color: 'var(--accent)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={18} /> Životní standard
                </h3>
                <InputGroup 
                  label="Měsíční náklady" 
                  unit="Kč" 
                  value={data.monthlyExpenses} 
                  onChange={(v) => setData({...data, monthlyExpenses: Number(v)})}
                  tooltip="Součet všech vašich soukromých výdajů (nájem, jídlo, energie, služby). Je to základní meta, kterou musíte každý měsíc pokrýt."
                />
                <InputGroup 
                  label="Měsíční spoření" 
                  unit="Kč" 
                  value={data.desiredSavings} 
                  onChange={(v) => setData({...data, desiredSavings: Number(v)})}
                  tooltip="Částka, kterou si chcete odložit stranou jako čistý zisk pro investice nebo budoucí nákupy."
                />
                <div className="no-print">
                  <InputGroup 
                    label={`Rezerva: ${data.safetyBufferMonths} měs.`} 
                    unit="měs" 
                    type="range" 
                    min={1} 
                    max={12} 
                    value={data.safetyBufferMonths} 
                    onChange={(v) => setData({...data, safetyBufferMonths: Number(v)})}
                    tooltip="Kolik měsíců chcete přežít bez příjmů v případě výpadku zakázek. Doporučujeme 6 měsíců."
                  />
                </div>
              </section>

              <section>
                <h3 style={{ fontSize: '1rem', color: 'var(--accent)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={18} /> Daňový režim
                </h3>
                <select 
                  value={data.taxMode} 
                  onChange={(e) => setData({...data, taxMode: e.target.value as any})}
                  style={{ width: '100%', padding: '12px', background: '#1e293b', color: 'white', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '20px', outline: 'none' }}
                >
                  <option value="pausal_dan">Paušální daň (1. pásmo)</option>
                  <option value="vydaje_60">Výdajový paušál (60%)</option>
                  <option value="realne_vydaje">Vlastní odhad % zdanění</option>
                </select>

                {data.taxMode === 'pausal_dan' ? (
                  <InputGroup 
                    label="Měsíční paušál" 
                    unit="Kč" 
                    value={data.pausalAmount} 
                    onChange={(v) => setData({...data, pausalAmount: Number(v)})}
                    tooltip="Aktuální výše měsíční platby paušální daně. Obsahuje daň i sociální a zdravotní pojištění."
                  />
                ) : (
                  <InputGroup 
                    label="Odhad daní + odvodů" 
                    unit="%" 
                    value={data.customTaxRate} 
                    onChange={(v) => setData({...data, customTaxRate: Number(v)})}
                    tooltip="Váš odhad celkového procentuálního zatížení (daň + odvody). Obvykle se pohybuje kolem 25 %."
                  />
                )}

                <InputGroup 
                  label="Fakturovatelné hodiny" 
                  unit="h/měs" 
                  value={data.billableHours} 
                  onChange={(v) => setData({...data, billableHours: Number(v)})}
                  tooltip="Počet hodin, které měsíčně reálně vyfakturujete klientům (bez času na administrativu a marketing)."
                />
              </section>
            </div>
          </GlassCard>

          <GlassCard style={{ border: '1px solid rgba(59, 130, 246, 0.3)', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(255,255,255,0.01) 100%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <Zap size={20} color="var(--primary)" />
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Strategický výklad výsledků</h3>
            </div>
            <div style={{ lineHeight: '1.6', color: 'var(--text-dim)', fontSize: '0.95rem' }}>
              {analysis.hourlyRate < 800 ? (
                <p>Vaše sazba <strong>{formatCZK(analysis.hourlyRate)}</strong> je v zóně „přežití“. Pokrýváte sice náklady, ale nevytváříte si polštář pro budoucnost. Doporučujeme cílit na postupný růst k hranici 1 000 Kč.</p>
              ) : (
                <p>Sazba <strong>{formatCZK(analysis.hourlyRate)}</strong> je zdravým základem. Umožňuje vám tvořit rezervy a mít podnikání pod kontrolou bez neustálého stresu.</p>
              )}
              <p style={{ fontSize: '0.85rem', marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
                💡 <strong>Tip:</strong> Při této sazbě musíte denně vyfakturovat v průměru <strong>{formatCZK(analysis.grossNeeded / 21)}</strong> (při 21 pracovních dnech).
              </p>
            </div>
          </GlassCard>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #1d4ed8 100%)', padding: 'var(--card-padding)', borderRadius: '24px', textAlign: 'center', color: 'white', boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)' }}>
  <span style={{ fontSize: '0.8rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '1px' }}>Cílová hodinovka</span>
  <div style={{ fontSize: 'clamp(2rem, 8vw, 3.2rem)', fontWeight: 'bold', margin: '10px 0' }}>{formatCZK(analysis.hourlyRate)}</div>
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

               <button 
                onClick={handleSave} 
                className="calculate-btn no-print" 
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '10px', background: saved ? '#10b981' : '' }}
               >
                 {saved ? <><Check size={18} /> Propojeno se systémem</> : <><Save size={18} /> ULOŽIT DO MÉHO PANELU </>}
               </button>
             </div>
          </GlassCard>
        </div>
      </div>

      {/* --- NOVÁ SEKCE: HLOUBKOVÝ PRŮVODCE PROSPERITOU --- */}
      <div className="no-print">
        <GlassCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
            <BookOpen size={32} color="var(--primary)" />
            <h2 style={{ margin: 0 }}>Hloubkový průvodce finančním plánováním</h2>
          </div>

          <div className="smart-grid" style={{ color: 'var(--text-dim)', lineHeight: '1.8' }}>
            <div>
              <h3 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem' }}>
                <ShieldCheck size={20} color="#10b981" /> Proč 6 měsíců rezerva?
              </h3>
              <p>
                Finanční polštář není jen pro případ krize. Je to vaše <strong>"ne-peníze"</strong>. Když víte, že máte pokryté náklady na půl roku dopředu, 
                změní se vaše energie při vyjednávání s klienty. Přestáváte brát zakázky ze zoufalství a začínáte si vybírat ty, které vás baví a dávají smysl.
              </p>
            </div>

            <div>
              <h3 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem' }}>
                <Clock size={20} color="var(--primary)" /> Fakturovatelné hodiny vs. čas
              </h3>
              <p>
                Pracovní měsíc má cca 160 hodin. Jako freelancer ale nikdy nevyfakturujete 160 hodin. Musíte počítat s administrativou, 
                vzděláváním a obchodem. Realistický odhad pro zdravé podnikání je <strong>80–110 fakturovatelných hodin</strong> měsíčně.
              </p>
            </div>

            <div>
              <h3 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem' }}>
                <DollarSign size={20} color="#fbbf24" /> Past nízké hodinovky
              </h3>
              <p>
                Pokud vaše hodinovka jen těsně pokrývá náklady, jste v pasti. Jakákoliv neplánovaná oprava auta nebo delší nemoc 
                vás pošle do červených čísel. Skutečná prosperita začíná tam, kde vaše sazba obsahuje i <strong>investici do vašeho rozvoje</strong>.
              </p>
            </div>
          </div>

          <div style={{ marginTop: '40px', padding: '25px', background: 'rgba(59, 130, 246, 0.03)', borderRadius: '20px', border: '1px dashed var(--primary)' }}>
            <h4 style={{ color: 'white', marginTop: 0 }}>🚀 Jak s těmito daty pracovat dál?</h4>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>
              Jakmile získáte svou cílovou hodinovku, použijte ji jako benchmark. Pokud vám vyjde 1 200 Kč, ale vy fakturujete 800 Kč, 
              máte před sebou jasný úkol: buď zvýšit hodnotu své práce, nebo optimalizovat náklady. Tento plánovač je váš <strong>finanční kompas</strong>.
            </p>
          </div>
        </GlassCard>
      </div>

      <div className="print-only" style={{ display: 'none', textAlign: 'center', fontSize: '0.8rem', opacity: 0.5, marginTop: '20px' }}>
        Vygenerováno aplikací Uspejeme.cz | {new Date().toLocaleDateString('cs-CZ')}
      </div>
    </div>
  );
};

export default ProsperityPlanner;