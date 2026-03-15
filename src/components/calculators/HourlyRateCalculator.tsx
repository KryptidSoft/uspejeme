import React, { useState } from 'react';
import { 
  Clock, 
  ShieldAlert, 
  TrendingUp, 
  AlertCircle, 
  Info, 
  Zap, 
  BookOpen, 
  CheckCircle2, 
  Calendar,
  Wallet
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { InputGroup } from '../ui/InputGroup';
import { calculateHourlyRate } from '../../utils/calculations/hourly';
import { formatCZK } from '../../utils/calculations/mathHelpers';
import { useBusinessData } from '../../hooks/useBusinessData';

// ... předchozí kód (importy, useState)

export const HourlyRateCalculator: React.FC = () => {
  const { data: globalData, updateData } = useBusinessData();
  const [inputs, setInputs] = useState({
	  grossIncome: globalData.desiredNetIncome || 60000,
    billableHours: 100,
    vacationWeeks: 4,
    bufferDays: 10,
    costs: {
      taxes: globalData.taxMode === 'pausal_dan' ? (globalData.pausalAmount || 8916) : 15000,
      overhead: globalData.monthlyExpenses || 30000
    }
  });
  const [results, setResults] = useState<any>(null);

  // SEM VLOŽÍTE TU NOVOU FUNKCI:
const handleCalculate = () => {
  // 'inputs' musí odpovídat rozhraní HourlyInputs, které máte v helperu
  const res = calculateHourlyRate(inputs); 
  setResults(res);

  updateData({
    hourlyRate: res.rate,
    monthlyExpenses: inputs.costs.overhead + inputs.costs.taxes,
    desiredNetIncome: inputs.grossIncome,
    // Tyto hodnoty dashboard využije pro analýzu stability
    vacationWeeks: inputs.vacationWeeks,
    bufferDays: inputs.bufferDays
  });
};

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '25px', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* --- STRATEGICKÝ ÚVOD --- */}
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <h1 style={{ color: 'white', fontSize: '2.2rem', marginBottom: '10px', fontWeight: '800' }}>Kalkulačka férové hodinové sazby</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
          Mnoho freelancerů zapomíná, že hodinovka musí zaplatit i dny, kdy jsou nemocní, mají dovolenou nebo jen dělají administrativu. 
          Tato kalkulačka vám ukáže <strong>reálnou cenu vašeho času</strong>, aby vaše podnikání bylo dlouhodobě udržitelné.
        </p>
      </div>

      <GlassCard>
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Clock size={28} color="var(--primary)" />
          <h2 style={{ margin: 0 }}>Nastavení vaší sazby</h2>
        </div>

        <div style={{ marginBottom: '25px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '12px', padding: '15px', borderLeft: '4px solid var(--primary)' }}>
          <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text)', lineHeight: '1.5' }}>
            <Zap size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} color="#fbbf24" />
            <strong>Tip:</strong> Jakmile kliknete na "Vypočítat a propojit", vaše nová hodinovka se okamžitě promítne do Plánovače i dalších nástrojů na tomto webu.
          </p>
        </div>

        <div className="calculator-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          <div className="inputs">
            <InputGroup
              label="Požadovaný čistý příjem"
              unit="Kč"
              value={inputs.grossIncome}
              onChange={(val) => setInputs({...inputs, grossIncome: parseFloat(val) || 0})}
              tooltip="Částka, kterou si chcete reálně vyplatit 'do kapsy' po zdanění a zaplacení všech nákladů."
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <InputGroup
                label="Dovolená"
                unit="týdny/rok"
                value={inputs.vacationWeeks}
                onChange={(val) => setInputs({...inputs, vacationWeeks: parseFloat(val) || 0})}
                tooltip="Počet týdnů volna. Kalkulačka zvýší vaši hodinovku tak, aby vám zaplatila i tyto dny odpočinku."
              />
              <InputGroup
                label="Nemoc / Rezerva"
                unit="dny/rok"
                value={inputs.bufferDays}
                onChange={(val) => setInputs({...inputs, bufferDays: parseFloat(val) || 0})}
                tooltip="Dny v roce, kdy nebudete pracovat kvůli nemoci nebo úřadům. Počítejte raději alespoň s 10 dny."
              />
            </div>

            <InputGroup
              label="Fakturovatelné hodiny"
              unit="hod/měs"
              value={inputs.billableHours}
              onChange={(val) => setInputs({...inputs, billableHours: parseFloat(val) || 0})}
              tooltip="Kolik hodin měsíčně reálně naúčtujete klientům. Průměr u OSVČ bývá kolem 100-120 hodin měsíčně."
            />

            <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '15px', marginBottom: '20px', border: '1px solid var(--border)' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '0.9rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>Měsíční náklady a daně</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <InputGroup 
                  label="Daně a odvody"
                  unit="Kč"
                  value={inputs.costs.taxes}
                  onChange={(val) => setInputs({...inputs, costs: {...inputs.costs, taxes: parseFloat(val) || 0}})}
                  tooltip="Sociální, zdravotní pojištění a daň z příjmu (např. částka vaší paušální daně)."
                />
                <InputGroup 
                  label="Provozní režie"
                  unit="Kč"
                  value={inputs.costs.overhead}
                  onChange={(val) => setInputs({...inputs, costs: {...inputs.costs, overhead: parseFloat(val) || 0}})}
                  tooltip="Pravidelné náklady: SW, telefon, účetní, nájem kanceláře nebo marketing."
                />
              </div>
            </div>

            <button className="calculate-btn" onClick={handleCalculate} style={{ width: '100%', padding: '15px', fontWeight: '800', fontSize: '1rem', cursor: 'pointer' }}>
              VYPOČÍTAT A PROPOJIT SYSTÉM
            </button>
          </div>

          <div className="results" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {results ? (
              <div className="results-box fade-in" style={{ textAlign: 'center', padding: '40px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '30px', border: '1px solid rgba(59, 130, 246, 0.2)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, padding: '10px' }}>
                  <CheckCircle2 color="#10b981" size={24} />
                </div>
                <span style={{ color: 'var(--text-dim)', fontSize: '1rem', fontWeight: '500' }}>Vaše minimální udržitelná sazba:</span>
                <div style={{ fontSize: '4.5rem', fontWeight: '900', color: 'white', margin: '15px 0', textShadow: '0 0 30px rgba(59, 130, 246, 0.4)' }}>
                  {formatCZK(results.rate)}
                </div>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                  <p style={{ fontSize: '1rem', color: 'var(--text)', margin: 0 }}>
                    Měsíční obrat: <strong>{formatCZK(results.totalRequired)}</strong>
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', margin: 0 }}>
                    (Sazba pokryje náklady, daně i vaši dovolenou)
                  </p>
                </div>
                
                <div style={{ marginTop: '30px', padding: '15px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', fontSize: '0.85rem', textAlign: 'left', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <ShieldAlert size={18} style={{ color: '#10b981', flexShrink: 0 }} />
                  <span style={{ color: '#10b981', fontWeight: '600' }}>Sazba byla úspěšně uložena do globální strategie.</span>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px', border: '2px dashed var(--border)', borderRadius: '30px', opacity: 0.5 }}>
                <TrendingUp size={48} style={{ marginBottom: '15px' }} />
                <p>Zadejte své cíle vlevo a zjistěte, jaká hodinovka vás dovede k prosperitě.</p>
              </div>
            )}
          </div>
        </div>
      </GlassCard>

      {/* --- EDUKATIVNÍ SEKCE: HLOUBKOVÝ ROZBOR --- */}
      <div className="no-print">
        <GlassCard style={{ padding: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
            <BookOpen size={32} color="var(--primary)" />
            <h2 style={{ margin: 0 }}>Jak správně nacenit svou práci?</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px' }}>
                <h4 style={{ color: 'white', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={18} color="#fbbf24" /> Neviditelný čas
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.6', margin: 0 }}>
                  Průměrný OSVČ stráví <strong>20–30 % času</strong> činnostmi, které nikomu nevyfakturuje (maily, schůzky, vzdělávání). 
                  Kalkulačka s tímto "hlušším" časem počítá, aby vás nezaskočil prázdný účet na konci měsíce.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px' }}>
                <h4 style={{ color: 'white', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Wallet size={18} color="#10b981" /> Daně nejsou váš zisk
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.6', margin: 0 }}>
                  Hrubá hodinovka, kterou vidíte na faktuře, je klamavá. Po odečtení paušální daně, sociálního pojištění a režií vám zbude reálná 
                  <strong> "čistá hodinovka"</strong>. Tato kalkulačka vám pomůže vidět tu reálnou pravdu.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px' }}>
                <h4 style={{ color: 'white', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={18} color="var(--primary)" /> Psychologická bariéra
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.6', margin: 0 }}>
                  Vyšla vám vyšší částka, než na kterou jste zvyklí? To je v pořádku. Sazba pod 800 Kč je v roce 2026 pro kvalifikovanou práci 
                  hranicí přežití. Nebojte se říct si o peníze, které vaše podnikání potřebuje ke zdraví.
                </p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default HourlyRateCalculator;