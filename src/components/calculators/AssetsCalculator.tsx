import React, { useState, useEffect } from 'react';
import { Coins, Info } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { InputGroup } from '../ui/InputGroup';

type AssetKey = 'gold' | 'silver' | 'btc' | 'eur';

interface Asset {
  label: string;
  price: number;
  unit: string;
  color: string;
}

const assets: Record<AssetKey, Asset> = {
  gold:   { label: 'Zlato',   price: 3562,    unit: 'g',  color: '#eab308' },
  silver: { label: 'Stříbro', price: 62,      unit: 'g',  color: '#94a3b8' },
  btc:    { label: 'Bitcoin', price: 1452408, unit: 'BTC', color: '#f97316' },
  eur:    { label: 'Euro',    price: 24.37,    unit: '€',  color: '#10b981' }
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
              selectedAsset === 'eur' ? amount.toFixed(2) : amount.toFixed(3),
      unit: asset.unit,
      assetName: asset.label
    });
  }, [fiatAmount, selectedAsset]);

  return (
    <GlassCard className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
        <Coins size={28} color="#eab308" />
        <h2 style={{ margin: 0 }}>Fiat → Aktiva</h2>
      </div>

      <div className="calculator-grid">
        {/* LEVÁ STRANA: VSTUPY */}
        <div className="inputs-section">
          <InputGroup
            label="Částka k přepočtu"
            unit="Kč"
            value={fiatAmount}
            onChange={(val) => setFiatAmount(parseFloat(val) || 0)}
            tooltip="Zadejte částku v CZK, kterou chcete vizualizovat v aktivech."
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
        </div>

        {/* PRAVÁ STRANA: VÝSLEDEK */}
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
  );
};