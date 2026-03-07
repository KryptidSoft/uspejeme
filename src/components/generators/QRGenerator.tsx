import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { GlassCard } from '../ui/GlassCard';
import { InputGroup } from '../ui/InputGroup';
import { QrCode, Copy, CheckCircle2, AlertCircle, Wallet } from 'lucide-react';

export const QRGenerator: React.FC = () => {
  const [data, setData] = useState({
    account: '',
    amount: '',
    variableSymbol: '',
    message: '',
  });
  
  // useRef je nejefektivnější cesta: drží si původní hodnotu pro výpočet DPH
  // aniž by způsoboval zbytečné překreslování (re-rendery) jako useState.
  const originalAmount = useRef('');
  const [copied, setCopied] = useState(false);
  const [isValidAccount, setIsValidAccount] = useState(false);

  useEffect(() => {
    const accountRegex = /^(\d{0,6}-)?\d{1,10}\/\d{4}$/;
    setIsValidAccount(accountRegex.test(data.account));
  }, [data.account]);

  const addTax = (percentage: number) => {
    // Pokud originalAmount ještě není nastaven, vezmeme aktuální hodnotu
    const base = originalAmount.current || data.amount;
    const rawValue = base.replace(/\s/g, '').replace(',', '.');
    const currentAmount = parseFloat(rawValue);
    
    if (!isNaN(currentAmount)) {
      // Uložíme si základ, aby další kliknutí na DPH počítalo ze stejného čísla
      if (!originalAmount.current) originalAmount.current = data.amount;
      
      const withTax = currentAmount * (1 + percentage / 100);
      setData({ ...data, amount: Math.round(withTax).toString() });
    }
  };

  const handleAmountChange = (val: string) => {
    setData({ ...data, amount: val });
    originalAmount.current = ''; // Resetujeme základ, když uživatel začne psát nové číslo
  };

  const cleanAmount = data.amount.replace(',', '.').replace(/\s/g, '');
  const cleanAccount = data.account.replace(/\s/g, '');
  const qrValue = `SPD*1.0*ACC:${cleanAccount}*AM:${cleanAmount}*CUR:CZK*VS:${data.variableSymbol}*MSG:${data.message.substring(0, 60)}`.replace(/\*+$/, "");

  const handleCopy = () => {
    navigator.clipboard.writeText(qrValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fade-in" style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: '900', marginBottom: '10px' }}>
          Smart <span style={{ color: 'var(--primary)' }}>QR Pay</span>
        </h1>
        <p style={{ color: 'var(--text-dim)' }}>Bleskové platby bez překlepů. Standard 2026 pro moderní OSVČ.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '25px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <GlassCard className="p-6">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Wallet size={20} color="var(--primary)" /> Platební údaje
            </h3>
            
            <div style={{ position: 'relative' }}>
              <InputGroup 
                label="Číslo účtu / včetně kódu banky (vzor 1234567890/1234)" 
                placeholder="např. 123456789/0100"
                value={data.account}
                onChange={(val) => setData({...data, account: val})}
                type="text" 
              />
              {data.account.length > 5 && (
                <div style={{ position: 'absolute', right: '12px', top: '38px' }}>
                  {isValidAccount ? <CheckCircle2 size={18} color="#10b981" /> : <AlertCircle size={18} color="#ef4444" />}
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '15px', marginTop: '10px' }}>
              <div>
                <InputGroup 
                  label="Částka (CZK)" 
                  value={data.amount}
                  onChange={handleAmountChange}
                  type="text" 
                />
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <button onClick={() => addTax(12)} style={{ fontSize: '0.7rem', padding: '6px 10px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', border: '1px solid #555', color: '#ccc', cursor: 'pointer' }}>+12% DPH</button>
                  <button onClick={() => addTax(21)} style={{ fontSize: '0.7rem', padding: '6px 10px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', border: '1px solid #555', color: '#ccc', cursor: 'pointer' }}>+21% DPH</button>
                </div>
              </div>
              <InputGroup 
                label="Var. symbol" 
                value={data.variableSymbol}
                onChange={(val) => setData({...data, variableSymbol: val})}
                type="text"
              />
            </div>

            <InputGroup 
              label="Zpráva pro příjemce (text max. 60 znaků)" 
              value={data.message}
              onChange={(val) => {
                if (val.length <= 60) setData({...data, message: val});
              }}
              type="text" 
            />
          </GlassCard>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <GlassCard className="p-6" style={{ textAlign: 'center', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
            {isValidAccount && cleanAmount && parseFloat(cleanAmount) > 0 ? (
              <>
                <div style={{ padding: '10px', background: 'white', borderRadius: '10px' }}>
                  <QRCodeSVG value={qrValue} size={220} level="H" includeMargin={true} />
                </div>
                <p style={{ color: '#333', fontSize: '1rem', marginTop: '10px', fontWeight: 'bold' }}>
                  {data.amount} CZK
                </p>
              </>
            ) : (
              <div style={{ color: '#666', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <QrCode size={60} opacity={0.2} />
                <span style={{ fontSize: '0.85rem' }}>Doplňte účet a částku</span>
              </div>
            )}
          </GlassCard>

          <button 
            onClick={handleCopy} 
            className="calculate-btn" 
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: isValidAccount ? 'var(--primary)' : '#444' }}
            disabled={!isValidAccount}
          >
            {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
            {copied ? 'Zkopírováno' : 'Kopírovat kód'}
          </button>
        </div>
      </div>
    </div>
  );
};