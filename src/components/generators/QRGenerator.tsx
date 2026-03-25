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
    const savedAccount = localStorage.getItem('user_account_number');
    if (savedAccount) {
      setData(prev => ({ ...prev, account: savedAccount }));
    }
  }, []);

  useEffect(() => {
    const accountRegex = /^(\d{0,6}-)?\d{1,10}\/\d{4}$/;
    setIsValidAccount(accountRegex.test(data.account));
  }, [data.account]);
  
  useEffect(() => {
    if (data.account) {
      localStorage.setItem('user_account_number', data.account);
    }
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
  const qrValue = [
  'SPD*1.0',
  `ACC:${cleanAccount}`,
  `AM:${cleanAmount}`,
  'CUR:CZK',
  data.variableSymbol && `VS:${data.variableSymbol}`,
  data.message && `MSG:${data.message.replace(/\*/g, ' ')}` // Nahradí hvězdičky ve zprávě mezerou, aby nerozbily formát
].filter(Boolean).join('*');

  const handleCopy = () => {
    navigator.clipboard.writeText(qrValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fade-in app-container" style={{ padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: '900', marginBottom: '10px' }}>
          Smart <span style={{ color: 'var(--primary)' }}>QR Pay</span> (CZ)
        </h1>
        <p style={{ color: 'var(--text-dim)' }}>Bleskové platby bez překlepů. Standard 2026 pro moderní OSVČ.</p>
		  <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.5' }}>
    QR kód se generuje okamžitě v reálném čase, jakmile zadáte všechny platné údaje - stačí zadat číslo účtu a požadovanou částku. Poté ho stačí zkopírovat a rovnou poslat klientovi nebo kamarádovi. 
    Platí pro platby v ČR.
  </p>
      </div>

      <div className="layout-grid">
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

            <div className="smart-grid" style={{ marginTop: '10px' }}>
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
  className={`btn ${copied ? 'btn-success' : !isValidAccount ? 'btn-inactive' : ''}`}
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