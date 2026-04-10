import React, { useState, useMemo } from "react";
import { TrendingDown, CheckSquare, Square, Info } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { InputGroup } from "../ui/InputGroup";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend
} from "recharts";
import { calculateInflationValue, generateComparisonSeries } from "../../utils/calculations/inflation";

export const InflationCalculator: React.FC = () => {
  const [amount, setAmount] = useState(500000);
  const [inflation, setInflation] = useState(3.5);
  const [years, setYears] = useState(10);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);


  // Dynamická konfigurace aktiv na základě aktuální inflace
  const assetConfigs = useMemo(() => [
    { 
      id: "gold", 
      label: "Zlato", 
      color: "#eab308", 
      growth: inflation + 1.5,
      desc: "Kopíruje inflaci + prémie za vzácnost."
    },
    { 
      id: "chf", 
      label: "Švýcarský Frank", 
      color: "#D52B1E", 
      growth: Math.max(0, inflation - 2),
      desc: "Zohledňuje nižší inflaci ve Švýcarsku."
    },
    { 
      id: "btc", 
      label: "Bitcoin", 
      color: "#f97316", 
      growth: inflation + 12,
      desc: "Digitální vzácnost s vysokým růstovým potenciálem."
    },
    { 
      id: "silver", 
      label: "Stříbro", 
      color: "#94a3b8", 
      growth: inflation + 0.5,
      desc: "Průmyslový kov držící krok s inflací."
    }
  ], [inflation]);

// VLOŽIT TOTO (místo smazaného useEffect):
const activeConfigs = assetConfigs.filter(a => selectedAssets.includes(a.id));
const series = generateComparisonSeries(amount, inflation, years, activeConfigs);
const realValue = Math.round(calculateInflationValue(amount, inflation, years));

  const toggleAsset = (id: string) => {
    setSelectedAssets(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  return (
    <div className="fade-in app-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <GlassCard>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <TrendingDown color="#ef4444" size={28} />
          <h2 style={{ margin: 0 }}>Kalkulačka znehodnocení úspor</h2>
        </div>

        <div className="calculator-grid">
          {/* --- Inputy --- */}
          <div>
            <InputGroup label="Úspory" unit="Kč" value={amount} onChange={(v) => setAmount(parseFloat(v) || 0)} 
			tooltip="Celková částka, kterou máte dnes k dispozici k investování či uložení. Zahrnuje hotovost, úspory a volné prostředky."
			/>
            <InputGroup label="Inflace" unit="%" value={inflation} onChange={(v) => setInflation(parseFloat(v) || 0)} 
			tooltip="Odhad roční inflace. Zohledňuje nárůst cen zboží a služeb, který snižuje kupní sílu vašich peněz."
			/>
            <InputGroup label="Horizont" unit="let" value={years} onChange={(v) => setYears(parseFloat(v) || 0)} 
			tooltip="Počet let, po které sledujete reálnou hodnotu vašich úspor. Delší horizont = přesnější odhad."
			/>
            
            <div style={{ marginTop: "20px" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-dim)", display: "block", marginBottom: "10px" }}>
                Srovnat s ochranou aktiv:
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
{assetConfigs.map(asset => (
  <button
    key={asset.id}
    onClick={() => toggleAsset(asset.id)}
    style={{
      display: "flex", alignItems: "center", gap: "6px",
      padding: "6px 12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)",
      background: selectedAssets.includes(asset.id) ? "rgba(255,255,255,0.1)" : "transparent",
      color: selectedAssets.includes(asset.id) ? asset.color : "#aaa",
      cursor: "pointer", fontSize: "0.85rem", transition: "0.2s"
    }}
  >
    <span className="custom-tooltip">
      {selectedAssets.includes(asset.id) ? <CheckSquare size={14} /> : <Square size={14} />}
      <span className="tooltip-text">{asset.desc}</span>
    </span>
    {asset.label}
  </button>
))}
              </div>
            </div>
          </div>

          {/* --- Výsledek --- */}
          <div style={{ textAlign: "center", padding: "var(--card-padding)", background: "rgba(0,0,0,0.2)", borderRadius: "16px", display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '200px' }}>
  <div style={{ fontSize: "0.9rem", color: "var(--text-dim)" }}>Reálná hodnota za {years} let</div>
  <div style={{ fontSize: "clamp(1.8rem, 5vw, 2.6rem)", fontWeight: "bold", color: "#ef4444", marginTop: "10px" }}>
              {realValue.toLocaleString()} Kč
            </div>
            <div style={{ marginTop: "12px", fontSize: "0.95rem", color: "#f87171" }}>
              🔥 Inflace vám vezme {(amount - realValue).toLocaleString()} Kč
            </div>
          </div>
        </div>

        {/* --- GRAF --- */}
        <div style={{ marginTop: "40px", height: "350px", width: "100%", overflowX: 'auto', overflowY: 'hidden' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="year" stroke="#aaa" />
              <YAxis stroke="#aaa" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip 
                contentStyle={{ background: "#111", border: "1px solid #333", borderRadius: "8px" }}
                formatter={(v: number | string | readonly (number | string)[] | undefined) =>
  v !== undefined
    ? `${Number(Array.isArray(v) ? v[0] : v).toLocaleString()} Kč`
    : ''
} 
              />
              <Legend verticalAlign="top" height={36}/>
              <Line name="Hotovost (CZK)" type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={3} dot={false} />
              {assetConfigs.map(asset => selectedAssets.includes(asset.id) && (
                <Line
                  key={asset.id}
                  name={asset.label}
                  type="monotone"
                  dataKey={asset.id}
                  stroke={asset.color}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* --- INFORMAČNÍ SEKCE POD ČAROU --- */}
      <GlassCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
          <Info size={20} color="var(--primary)" />
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Metodika predikce a vztah k inflaci</h3>
        </div>
        <div className="smart-grid" style={{ fontSize: '0.85rem' }}>
          <div>
            <strong style={{ color: '#eab308' }}>Zlato a Stříbro:</strong> Vycházíme z teze, že drahé kovy jsou reálná aktiva. Jejich cena dlouhodobě koriguje inflaci (náklady na těžbu rostou s cenou energií), čímž si udržují konstantní kupní sílu.
          </div>
          <div>
            <strong style={{ color: '#D52B1E' }}>Švýcarský Frank:</strong> Predikce využívá tzv. inflační diferenciál. Frank historicky posiluje vůči koruně o rozdíl mezi českou a švýcarskou inflací, což z něj dělá bezpečný měnový přístav.
          </div>
          <div>
            <strong style={{ color: '#f97316' }}>Bitcoin:</strong> Jako digitální aktivum s fixním konečným množstvím (21 mil. BTC) reaguje na znehodnocování fiat měn agresivněji. Predikce zahrnuje prémii za technologické přijetí nad rámec inflace.
          </div>
        </div>
        <p style={{ marginTop: '20px', fontSize: '0.75rem', fontStyle: 'italic', opacity: 0.7, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
          Poznámka: Výpočty v grafu jsou simulací dlouhodobých ekonomických trendů, nikoliv zaručeným budoucím výnosem. Nástroj slouží pouze pro vzdělávací účely a simulaci historických trendů.
		  <strong> Nejedná se o investiční poradenství</strong>. Před jakýmkoliv investičním rozhodnutím se poraďte s licencovaným odborníkem.
        </p>
      </GlassCard>
    </div>
  );
};