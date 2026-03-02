import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  ShieldCheck, 
  Info, 
  TrendingUp, 
  AlertCircle, 
  Trophy, 
  Target, 
  Zap, 
  FileText,
  MousePointer2 
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { InputGroup } from '../ui/InputGroup';
import { calculateStability } from '../../utils/calculations/stability';

const STAGE_DATA = {
  reserves: [
    { threshold: 0, label: "Kritické", color: "#ef4444", text: "Žijete z ruky do huby. Každý výpadek znamená dluh." },
    { threshold: 3, label: "Slabé", color: "#f59e0b", text: "Základní klid, ale nesmí přijít nic velkého." },
    { threshold: 6, label: "Standard", color: "#84cc16", text: "Zlatý standard stability. Můžete v klidu měnit strategii." },
    { threshold: 9, label: "Bezpečí", color: "#10b981", text: "Silná vyjednávací pozice. Můžete říkat 'ne' špatným nabídkám." },
    { threshold: 12, label: "Neprůstřelnost", color: "#10b981", text: "Jste imunní vůči krátkodobým krizím na trhu." }
  ],
  sustainability: [
    { threshold: 0, label: "Hazard", color: "#ef4444", text: "Jeden dominantní zdroj. Když vypadne, končíte." },
    { threshold: 40, label: "Dobré", color: "#f59e0b", text: "Máte portfolio, ale musíte neustále aktivně shánět nové věci." },
    { threshold: 70, label: "Stabilní", color: "#84cc16", text: "Většina příjmů se opakuje, máte předvídatelný cashflow." },
    { threshold: 90, label: "Robustní", color: "#10b981", text: "Vybudovaná značka, která generuje i bez reklamy." },
    { threshold: 100, label: "Garantované", color: "#10b981", text: "Příjem je smluvně zajištěn na roky dopředu." }
  ],
  workload: [
    { threshold: 0, label: "Podvýživa", color: "#f59e0b", text: "Systém rezne, nevyužíváte svůj potenciál." },
    { threshold: 40, label: "Pohoda", color: "#10b981", text: "Pracujete na půl plynu, hodně volného času." },
    { threshold: 75, label: "Ideální zóna", color: "#84cc16", text: "Ideální tempo. Práce, rodina i spánek v rovnováze." },
    { threshold: 100, label: "Na hraně", color: "#f59e0b", text: "Jedete nadoraz. Riziko chyby, nemoci nebo vyhoření." },
    { threshold: 125, label: "Kritické", color: "#ef4444", text: "Noci i víkendy. Systém se brzy fyzicky zhroutí." }
  ],
  roi: [
    { threshold: 0, label: "Charita", color: "#ef4444", text: "Hodně práce za směšné peníze. Náklady drtí zisk." },
    { threshold: 40, label: "Průměr", color: "#f59e0b", text: "Vyděláváte, ale hodinová sazba je vzhledem k úsilí nízká." },
    { threshold: 60, label: "Dobré", color: "#84cc16", text: "Nastavené procesy. Slušný poměr výkonu a odměny." },
    { threshold: 80, label: "Vysoká", color: "#10b981", text: "Každá vložená hodina vám vrací vysoký násobek." },
    { threshold: 100, label: "Skalární", color: "#10b981", text: "Vyděláváte víc, aniž byste víc pracovali." }
  ]
};

export const StabilityCalculator: React.FC = () => {
  const [inputs, setInputs] = useState({
    reservesMonths: 3,
    incomeSustainability: 50,
    workload: 80,
    roiEfficiency: 60,
    expenseStability: 90
  });

  const results = useMemo(() => calculateStability(inputs), [inputs]);

  const getInfo = (val: number, key: keyof typeof STAGE_DATA) => {
    const stages = STAGE_DATA[key];
    return [...stages].reverse().find(s => val >= s.threshold) || stages[0];
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return '#10b981'; 
    if (score >= 65) return '#84cc16'; 
    if (score >= 40) return '#f59e0b'; 
    return '#ef4444'; 
  };

  const verdict = useMemo(() => {
    const score = results.score;
    if (score >= 85) return { 
        title: "Pevnost", icon: <Trophy color="#fbbf24" size={42} />, 
        comparison: "Gratulujeme! Jste v horních 5 % ČR.",
        action: "Váš systém je neprůstřelný. Ideální čas na odvážné kroky.",
        nextStep: "Diverzifikujte do aktiv (BTC, zlato)."
    };
    if (score >= 65) return { 
        title: "Stabilní dříč", icon: <ShieldCheck color="#10b981" size={42} />, 
        comparison: "Skvělý výsledek. Jste stabilnější než 75 % OSVČ.",
        action: "Máte pevné základy. Začněte škálovat své procesy.",
        nextStep: "Delegujte jednu rutinní činnost."
    };
    if (score >= 40) return { 
        title: "Křehká stabilita", icon: <TrendingUp color="#f59e0b" size={42} />, 
        comparison: "Odpovídá průměru českého trhu.",
        action: "Stačí jeden výpadek a systém se otřese. Potřebujete větší polštář.",
        nextStep: "Zvyšte sazbu o 15 % pro tvorbu rezervy."
    };
    return { 
        title: "V ohrožení", icon: <AlertCircle color="#ef4444" size={42} />, 
        comparison: "Pozor. Jste v rizikovější skupině (spodních 20 % ČR).",
        action: "Hrozí vyhoření nebo finanční kolaps. Systém je neudržitelný.",
        nextStep: "STOP! Okamžitě omezte výdaje."
    };
  }, [results.score]);

  return (
    <GlassCard className="fade-in" style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Activity size={32} color="#84cc16" strokeWidth={2.5} />
            <h2 style={{ margin: 0, fontSize: '1.8rem' }}>Diagnostika stability 2026</h2>
          </div>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: '1.4', maxWidth: '650px' }}>
            <MousePointer2 size={14} style={{ display: 'inline', marginRight: '5px' }} /> 
            Nastavte všechny čtyři parametry vlevo posouváním zprava doleva. Vpravo se okamžitě přepočítá váš <strong>Index stability</strong>.
          </p>
        </div>
        <button onClick={() => window.print()} className="no-print" style={{ 
          background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', cursor: 'pointer', padding: '10px 20px', color: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' 
        }}>
          <FileText size={18} /> EXPORT PDF
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '20px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'grid', gap: '25px' }}>
            {Object.keys(STAGE_DATA).map((key) => {
                const k = key as keyof typeof STAGE_DATA;
                const stateKey = key === 'reserves' ? 'reservesMonths' : 
                                 key === 'sustainability' ? 'incomeSustainability' :
                                 key === 'roi' ? 'roiEfficiency' : 'workload';
                const currentVal = (inputs as any)[stateKey];
                const info = getInfo(currentVal, k);

                return (
                    <div key={key}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: '800', opacity: 0.8, textTransform: 'uppercase', color: info.color }}>
                              {key === 'reserves' ? '📅 Rezerva' : key === 'sustainability' ? '🔗 Udržitelnost' : key === 'roi' ? '💰 ROI' : '⏳ Zátěž'}
                            </span>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'white', marginRight: '8px' }}>{currentVal}</span>
                              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: info.color }}>({info.label})</span>
                            </div>
                        </div>
                        <InputGroup
                            unit={key === 'reserves' ? "m." : "%"} 
                            type="range" 
                            min={0} 
                            max={key === 'reserves' ? 12 : (key === 'workload' ? 150 : 100)} 
                            step={key === 'reserves' ? 1 : 10}
                            value={currentVal}
                            onChange={(v) => setInputs({...inputs, [stateKey]: parseFloat(v)})}
                            style={{ accentColor: info.color }}
                        />
                        <div style={{ marginTop: '10px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', display: 'flex', gap: '10px', lineHeight: '1.4' }}>
                            <Info size={16} style={{ flexShrink: 0, color: info.color }} />
                            {info.text}
                        </div>
                    </div>
                );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '40px 30px', borderRadius: '24px', border: '1px solid var(--border)', textAlign: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at center, ${getScoreColor(results.score)}15 0%, transparent 70%)`, pointerEvents: 'none' }} />
            <div style={{ fontSize: '0.8rem', opacity: 0.5, fontWeight: 'bold', letterSpacing: '3px' }}>INDEX STABILITY</div>
            <div style={{ fontSize: '5.5rem', fontWeight: '900', color: 'white', lineHeight: 1, margin: '10px 0', textShadow: `0 0 30px ${getScoreColor(results.score)}44` }}>
                {results.score}<span style={{ fontSize: '1.5rem', opacity: 0.3 }}>%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                {verdict.icon}
                <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: '800' }}>{verdict.title}</h3>
            </div>
            <p style={{ color: getScoreColor(results.score), fontWeight: 'bold', marginTop: '10px' }}>{verdict.comparison}</p>
          </div>

          <GlassCard style={{ padding: '25px', background: 'rgba(255,255,255,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <Target size={24} color="#84cc16" />
                <h4 style={{ margin: 0 }}>Doporučení pro růst</h4>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-dim)', marginBottom: '15px' }}>{verdict.action}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px dotted var(--border)' }}>
                <Zap size={24} color="#fbbf24" />
                <p style={{ fontSize: '0.9rem', fontWeight: 'bold', margin: 0 }}>{verdict.nextStep}</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </GlassCard>
  );
};