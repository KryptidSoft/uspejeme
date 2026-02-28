import React, { useState } from 'react';
import { Coins, Calculator, Info } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { InputGroup } from '../ui/InputGroup';

export const AssetsCalculator: React.FC = () => {
  const [fiatAmount, setFiatAmount] = useState<number>(10000);
  const [selectedAsset, setSelectedAsset] = useState<'gold' | 'silver' | 'btc'>('gold');
  const [results, setResults] = useState<any>(null);

  // Referenční ceny (dle vašeho zadání)
  const prices = {
    gold: 3471,   // Kč/g
    silver: 55,   // Kč/g
    btc: 1385000  // Kč/BTC
  };

  const handleCalculate = () => {
    if (fiatAmount <= 0) return;
    
    const price = prices[selectedAsset];
    const amount = fiatAmount / price;
    
    setResults({
      amount: selectedAsset === 'btc' ? amount.toFixed(8) : amount.toFixed(3),
      unit: selectedAsset === 'btc' ? 'BTC' : 'g',
      assetName: selectedAsset === 'gold' ? 'Zlata' : selectedAsset === 'silver' ? 'Stříbra' : 'Bitcoinu'
    });
  };

  return (
    <GlassCard className="fade-in">
      <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <Coins size={28} color="#eab308" />
        <h2 style={{ margin: 0 }}>Fiat → Aktiva</h2>
      </div>

      <div className="calculator-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        <div className="inputs">
          <InputGroup
            label="Částka v CZK"
            unit="Kč"
            value={fiatAmount}
            onChange={(val) => setFiatAmount(parseFloat(val) || 0)}
            tooltip="Zadejte částku v CZK, kterou chcete přepočítat."
          />
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-dim)' }}>Zvolte aktivum:</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => setSelectedAsset('gold')}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: selectedAsset === 'gold' ? '#eab308' : 'transparent', color: selectedAsset === 'gold' ? '#000' : '#fff', cursor: 'pointer' }}
              >Zlato</button>
              <button 
                onClick={() => setSelectedAsset('silver')}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: selectedAsset === 'silver' ? '#94a3b8' : 'transparent', color: selectedAsset === 'silver' ? '#000' : '#fff', cursor: 'pointer' }}
              >Stříbro</button>
              <button 
                onClick={() => setSelectedAsset('btc')}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: selectedAsset === 'btc' ? '#f97316' : 'transparent', color: selectedAsset === 'btc' ? '#000' : '#fff', cursor: 'pointer' }}
              >BTC</button>
            </div>
          </div>

          <button className="calculate-btn" onClick={handleCalculate}>PŘEPOČÍTAT</button>
        </div>

        <div className="results">
          {results ? (
            <div className="results-box fade-in" style={{ textAlign: 'center', padding: '30px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px' }}>
              <span style={{ color: 'var(--text-dim)' }}>Za vaše peníze byste koupili:</span>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '15px 0' }}>
                {results.amount} <span style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>{results.unit}</span>
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>{results.assetName}</div>
            </div>
          ) : (
            <div className="results-placeholder">Zjistěte reálnou hodnotu svých peněz</div>
          )}
        </div>
      </div>
      
      <div className="disclaimer-box" style={{ marginTop: '20px', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px', fontSize: '0.75rem', display: 'flex', gap: '10px' }}>
        <Info size={16} color="var(--danger)" />
        <span>Nejedná se o investiční poradenství. Referenční kurzy jsou orientační.</span>
      </div>
    </GlassCard>
  );
};