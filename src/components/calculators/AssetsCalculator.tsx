import React, { useState } from 'react';
import { 
  Coins, 
  Info, 
  TrendingDown, 
  Anchor, 
  Briefcase, 
  Lock 
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { InputGroup } from '../ui/InputGroup';
import { RATES, convertFiatToAssets } from '../../utils/calculations/assets';

type AssetKey = 'gold' | 'silver' | 'btc' | 'chf';

interface Asset {
  label: string;
  price: number;
  unit: string;
  color: string;
  desc: string;
}

const assets: Record<AssetKey, Asset> = {
  gold:   { label: 'Zlato', price: RATES.GOLD_G, unit: 'g', color: '#eab308', desc: 'Tradiční uchovatel hodnoty v dobách nejistoty.' },
  silver: { label: 'Stříbro', price: RATES.SILVER_G, unit: 'g', color: '#94a3b8', desc: 'Industriální kov s vysokým potenciálem.' },
  btc:    { label: 'Bitcoin', price: RATES.BTC, unit: 'BTC', color: '#f97316', desc: 'Digitální zlato a ochrana proti inflaci.' },
  chf:    { label: 'Švýcarský Frank', price: RATES.CHF, unit: 'CHF', color: '#D52B1E', desc: 'Symbol stability a bezpečný přístav fiat měn.' }
};

export const AssetsCalculator: React.FC = () => {
  const [fiatAmount, setFiatAmount] = useState<number>(10000);
  const [selectedAsset, setSelectedAsset] = useState<AssetKey>('gold');
  const allAssetsResults = convertFiatToAssets(fiatAmount);
  const currentAmount = allAssetsResults[selectedAsset];
  const asset = assets[selectedAsset];

  return (
    <div className="fade-in app-container">
      
      {/* --- STRATEGICKÝ ÚVOD --- */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: 'white', fontWeight: '800', marginBottom: '10px' }}>
          Převodník na proti-inflační aktiva
        </h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
          Jako OSVČ nesete veškeré riziko na svých bedrech. Tato kalkulačka vám pomůže vizualizovat, kolik <strong>skutečné hodnoty</strong> si kupujete za své vydělané peníze v "bezpečných přístavech".
        </p>
      </div>

      <GlassCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
          <Coins size={28} color="#eab308" />
          <h2 style={{ margin: 0 }}>Fiat → Aktiva</h2>
        </div>

        {/* ZDE JE TA OPRAVA: 
          Třída calculator-grid zařídí 1.2fr 0.8fr na PC a 1fr na mobilu.
        */}
        <div className="calculator-grid">
          
          <div className="inputs-section">
            <InputGroup
              label="Částka k přepočtu"
              unit="Kč"
              value={fiatAmount}
              onChange={(val) => setFiatAmount(parseFloat(val) || 0)}
              tooltip="Zadejte částku v CZK (např. váš měsíční zisk), kterou chcete zajistit."
            />

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                Zvolte cílové aktivum:
              </label>
              {/* Používáme tvůj grid pro tlačítka, který se na mobilu naskládá */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                {Object.entries(assets).map(([key, a]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedAsset(key as AssetKey)}
                    className={`nav-item ${selectedAsset === key ? 'active' : ''}`}
                    style={{
                      justifyContent: 'center',
                      background: selectedAsset === key ? a.color : 'rgba(255,255,255,0.05)',
                      color: selectedAsset === key ? '#000' : '#fff',
                      border: '1px solid var(--border)',
                      opacity: selectedAsset === key ? 1 : 0.7
                    }}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
              {asset.desc}
            </p>
          </div>

          <div className="results-section">
            {/* ODSTRANĚN minHeight: 200px - to na mobilu tlačilo obsah ven. 
              Místo toho používáme flex-grow, aby to na PC vyplnilo výšku.
            */}
            <div style={{ 
              textAlign: 'center', 
              padding: '30px 20px', 
              background: 'rgba(0,0,0,0.2)', 
              borderRadius: '20px', 
              border: '1px solid var(--border)', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center',
              height: '100%',
              minHeight: '180px' 
            }}>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Aktuální protihodnota:</span>
              <div style={{ margin: '20px 0' }}>
                <div style={{ fontSize: 'clamp(2.2rem, 6vw, 2.8rem)', fontWeight: 'bold', color: asset.color }}>
                  {currentAmount}
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: '500', color: 'var(--text)' }}>
                  {asset.unit} {asset.label}
                </div>
              </div>
              <div style={{ marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                Kurz: 1 {asset.unit} = {asset.price.toLocaleString()} Kč
              </div>
            </div>
          </div>
        </div>

        {/* Varování */}
        <div style={{ 
          marginTop: '25px', 
          background: 'rgba(239, 68, 68, 0.05)', 
          padding: '12px', 
          borderRadius: '12px', 
          fontSize: '0.75rem', 
          display: 'flex', 
          gap: '12px',
          border: '1px solid rgba(239, 68, 68, 0.1)'
        }}>
          <Info size={16} color="var(--danger)" />
          <span style={{ color: 'var(--text-dim)' }}>Nejedná se o investiční poradenství. Referenční kurzy se mohou lišit. Za nákup aktiv se účtují poplatky.</span>
        </div>
      </GlassCard>

      {/* --- EDUKATIVNÍ SEKCE --- */}
      <div className="no-print">
        <GlassCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
            <Anchor size={32} color="var(--primary)" />
            <h2 style={{ margin: 0 }}>Proč budovat "Bezpečný přístav"?</h2>
          </div>

          {/* Tady používáme grid, který se na mobilu naskládá pod sebe */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px', border: '1px solid var(--glass-border)' }}>
              <h4 style={{ color: 'white', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Briefcase size={18} color="#fbbf24" /> Diverzifikace příjmů
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.6' }}>
                Podnikatelé mají často veškerý kapitál vázaný v podnikání. Převod části zisku do aktiv vytváří protiváhu k lokálním výkyvům.
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px', border: '1px solid var(--glass-border)' }}>
              <h4 style={{ color: 'white', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingDown size={18} color="#ef4444" /> Ochrana před devalvací
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.6' }}>
                Když koruna oslabuje, ceny vstupů rostou. Aktiva v cizích měnách nebo kovech fungují jako <strong>finanční pojištění</strong>.
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px', border: '1px solid var(--glass-border)' }}>
              <h4 style={{ color: 'white', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} color="#10b981" /> Psychologický klid
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.6' }}>
                Vědomí rezerv nezávislých na bankovním systému vám dává svobodu dělat v podnikání <strong>odvážnější rozhodnutí</strong>.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};