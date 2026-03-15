import React, { useState, useEffect } from 'react';
import { 
  Coins, 
  Info, 
  ShieldCheck, 
  TrendingDown, 
  Anchor, 
  Briefcase, 
  Lock 
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { InputGroup } from '../ui/InputGroup';
import { RATES } from '../../utils/calculations/assets';

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
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    if (fiatAmount <= 0) return;
    const asset = assets[selectedAsset];
    const amount = fiatAmount / asset.price;

    setResults({
      amount: selectedAsset === 'btc' ? amount.toFixed(8) :
              selectedAsset === 'chf' ? amount.toFixed(2) : amount.toFixed(3),
      unit: asset.unit,
      assetName: asset.label
    });
  }, [fiatAmount, selectedAsset]);

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '25px', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* --- STRATEGICKÝ ÚVOD --- */}
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <h1 style={{ color: 'white', fontSize: '2.2rem', marginBottom: '10px', fontWeight: '800' }}>Převodník na proti-inflační aktiva</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
          Jako OSVČ nesete veškeré riziko na svých bedrech. Tato kalkulačka vám pomůže vizualizovat, kolik <strong>skutečné hodnoty</strong> si kupujete za své vydělané peníze v "bezpečných přístavech".
        </p>
      </div>

      <GlassCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
          <Coins size={28} color="#eab308" />
          <h2 style={{ margin: 0 }}>Fiat → Aktiva</h2>
        </div>

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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {Object.entries(assets).map(([key, asset]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedAsset(key as AssetKey)}
                    className="nav-item"
                    style={{
                      justifyContent: 'center',
                      background: selectedAsset === key ? asset.color : 'rgba(255,255,255,0.05)',
                      color: selectedAsset === key ? '#000' : '#fff',
                      border: '1px solid var(--border)',
                      opacity: selectedAsset === key ? 1 : 0.7
                    }}
                  >
                    {asset.label}
                  </button>
                ))}
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
              {assets[selectedAsset].desc}
            </p>
          </div>

          <div className="results-section">
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 20px', 
              background: 'rgba(0,0,0,0.2)', 
              borderRadius: '20px',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%'
            }}>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Aktuální protihodnota:</span>
              {results && (
                <div style={{ margin: '20px 0' }}>
                  <div style={{ fontSize: '2.8rem', fontWeight: 'bold', color: assets[selectedAsset].color }}>
                    {results.amount}
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '500', color: 'var(--text)' }}>
                    {results.unit} {results.assetName}
                  </div>
                </div>
              )}
              <div style={{ marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                Kurz: 1 {assets[selectedAsset].unit} = {assets[selectedAsset].price.toLocaleString()} Kč
              </div>
            </div>
          </div>
        </div>

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
          <span style={{ color: 'var(--text-dim)' }}>Nejedná se o investiční poradenství. Referenční kurzy jsou aktualizovány manuálně a jsou pouze orientační.</span>
        </div>
      </GlassCard>

      {/* --- EDUKATIVNÍ SEKCE PRO PODNIKATELE --- */}
      <div className="no-print">
        <GlassCard style={{ padding: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
            <Anchor size={32} color="var(--primary)" />
            <h2 style={{ margin: 0 }}>Proč budovat "Bezpečný přístav"?</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px' }}>
              <h4 style={{ color: 'white', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Briefcase size={18} color="#fbbf24" /> Diverzifikace příjmů
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.6' }}>
                Podnikatelé mají často veškerý kapitál vázaný v podnikání. Převod části zisku do aktiv jako <strong>zlato</strong> nebo <strong>CHF</strong> vytváří protiváhu k lokálním ekonomickým výkyvům.
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px' }}>
              <h4 style={{ color: 'white', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingDown size={18} color="#ef4444" /> Ochrana před devalvací
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.6' }}>
                Když česká koruna oslabuje, ceny energií a techniky pro vaše podnikání rostou. Aktiva v cizích stabilních měnách nebo drahých kovech fungují jako <strong>finanční pojištění</strong>.
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px' }}>
              <h4 style={{ color: 'white', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} color="#10b981" /> Psychologický klid
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.6' }}>
                Vědomí, že část vašich rezerv leží v aktivech nezávislých na bankovním systému, vám dává svobodu dělat v podnikání <strong>odvážnější strategická rozhodnutí</strong>.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};