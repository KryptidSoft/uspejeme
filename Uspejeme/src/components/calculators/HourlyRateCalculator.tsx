import React, { useState } from 'react';
import { 
  Clock, 
  ShieldAlert, 
  TrendingUp, 
  AlertCircle, 
  Zap, 
  BookOpen, 
  CheckCircle2, 
  Calendar,
  Wallet
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { InputGroup } from '../ui/InputGroup';
import { calculateHourlyRate } from '../../utils/calculations/hourly';
import type { HourlyInputs } from '../../utils/calculations/hourly';
import { formatCZK } from '../../utils/calculations/mathHelpers';
import { useBusinessData } from '../../hooks/useBusinessData';

const safeParse = (val: string | number, max: number = Infinity) => {
  const num = parseFloat(String(val));
  if (isNaN(num) || num < 0) return 0;
  return num > max ? max : num;
};

export const HourlyRateCalculator: React.FC = () => {
  const { data: globalData, updateData } = useBusinessData();
 
const [inputs, setInputs] = useState<HourlyInputs>({
  grossIncome: globalData.desiredNetIncome ?? 60000, 
  billableHours: globalData.billableHours ?? 100,
  vacationWeeks: globalData.vacationWeeks ?? 4,
  bufferDays: globalData.bufferDays ?? 10,
  nonBillableHours: globalData.nonBillableHours ?? 20,
  costs: {
    taxes: globalData.taxMode === 'pausal_dan' ? (globalData.pausalAmount ?? 9984) : 15000,
    overhead: globalData.monthlyExpenses ?? 30000,
    reserves: globalData.reserves ?? 0
  }
});

  const [results, setResults] = useState<ReturnType<typeof calculateHourlyRate> | null>(null);


const handleCalculate = () => {
  const res = calculateHourlyRate(inputs); 
  setResults(res);

  updateData({
    hourlyRate: res.rate,
    desiredNetIncome: inputs.grossIncome,
    billableHours: inputs.billableHours,
    vacationWeeks: inputs.vacationWeeks,
    bufferDays: inputs.bufferDays,
    monthlyExpenses: inputs.costs.overhead 
  });
};

  return (
    <div className="fade-in app-container">
  {/* --- STRATEGICKÝ ÚVOD --- */}
  <div>
    <h1>Kalkulačka férové hodinové sazby</h1>
    <h2>
      Mnoho freelancerů zapomíná, že hodinovka musí zaplatit i dny, kdy jsou nemocní, mají dovolenou nebo jen dělají administrativu. 
      Tato kalkulačka vám ukáže <strong>reálnou cenu vašeho času</strong>, aby vaše podnikání bylo dlouhodobě udržitelné.
    </h2>
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

        <div className="calculator-grid">
          <div className="inputs">
            <InputGroup
              label="Požadovaný čistý příjem"
              unit="Kč"
              value={inputs.grossIncome}
              onChange={(val) => setInputs({...inputs, grossIncome: safeParse(val)})}
              tooltip="Částka, kterou si chcete reálně vyplatit 'do kapsy' po zdanění a zaplacení všech nákladů."
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '15px', marginBottom: '15px' }}>
              <InputGroup
                label="Dovolená"
                unit="týdny"
                value={inputs.vacationWeeks}
                onChange={(val) => setInputs({...inputs, vacationWeeks: safeParse(val, 52)})}
                tooltip="Počet týdnů volna. Kalkulačka zvýší vaši hodinovku tak, aby vám zaplatila i tyto dny odpočinku."
              />
              <InputGroup
                label="Nemoc"
                unit="dny"
                value={inputs.bufferDays}
                onChange={(val) => setInputs({...inputs, bufferDays: safeParse(val, 365)})}
                tooltip="Dny v roce, kdy nebudete pracovat kvůli nemoci nebo úřadům. Počítejte raději alespoň s 10 dny."
              />
            </div>

            <InputGroup
              label="Fakturovatelné hodiny"
              unit="hod/měs"
              value={inputs.billableHours}
              onChange={(val) => setInputs({...inputs, billableHours: safeParse(val, 744)})}
              tooltip="Kolik hodin měsíčně reálně naúčtujete klientům. Průměr u OSVČ bývá kolem 100-120 hodin měsíčně."
            />

<div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '15px', marginBottom: '20px', border: '1px solid var(--border)' }}>
  <h4 style={{ margin: '0 0 15px 0', fontSize: '0.9rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>
    Měsíční náklady a daně
  </h4>
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '15px' }}>
    <InputGroup 
      label="Daně a odvody"
      unit="Kč"
      value={inputs.costs.taxes}
      onChange={(val) => setInputs({...inputs, costs: {...inputs.costs, taxes: safeParse(val)}})}
      tooltip="Sociální, zdravotní pojištění a daň z příjmu (např. částka vaší paušální daně)."
    />
    <InputGroup 
      label="Provozní režie"
      unit="Kč"
      value={inputs.costs.overhead}
      onChange={(val) => setInputs({...inputs, costs: {...inputs.costs, overhead: safeParse(val)}})}
      tooltip="Pravidelné náklady: SW, telefon, účetní, nájem kanceláře nebo marketing."
    />
    <InputGroup 
      label="Rezervy a pohotovost"
      unit="Kč"
      value={inputs.costs.reserves}
      onChange={(val) => setInputs({...inputs, costs: {...inputs.costs, reserves: safeParse(val)}})}
      tooltip="Rezervy na nečekané výdaje, materiál, opravy, nebo období s nižším příjmem."
    />
  </div>
</div>

<button className="btn" onClick={handleCalculate}>
  VYPOČÍTAT A PROPOJIT SYSTÉM
</button>
          </div>

          <div className="results" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {results ? (
              <div className="results-box fade-in" style={{ textAlign: 'center', padding: 'var(--card-padding)', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '30px', border: '1px solid rgba(59, 130, 246, 0.2)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, padding: '10px' }}>
                  <CheckCircle2 color="#10b981" size={24} />
                </div>
                <span style={{ color: 'var(--text-dim)', fontSize: '1rem', fontWeight: '500' }}>Vaše minimální udržitelná sazba:</span>
<div style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: '900', color: 'white', margin: '15px 0', textShadow: '0 0 30px rgba(59, 130, 246, 0.4)' }}>
  {formatCZK(results.rate)}
</div>
<p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', margin: '0' }}>
  Z toho ne-fakturovatelné hodiny: {inputs.nonBillableHours} hod/měs
</p>
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
        <GlassCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
            <BookOpen size={32} color="var(--primary)" />
            <h2 style={{ margin: 0 }}>Jak správně nacenit svou práci?</h2>
          </div>

          <div className="smart-grid">
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