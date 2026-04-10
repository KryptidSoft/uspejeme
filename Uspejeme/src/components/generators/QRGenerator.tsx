import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { GlassCard } from '../ui/GlassCard';
import { InputGroup } from '../ui/InputGroup';
import { QrCode, Copy, CheckCircle2, AlertCircle, Wallet } from 'lucide-react';

export const QRGenerator: React.FC = () => {
  // 1. STAV: Načtení z localStorage uděláme přímo při startu (lazy inicializace)
  const [data, setData] = useState(() => {
    const savedAccount = localStorage.getItem('user_account_number');
    return {
      account: savedAccount || '',
      amount: '',
      variableSymbol: '',
      message: '',
    };
  });

  const originalAmount = useRef('');
  const [copied, setCopied] = useState(false);

  // 2. LOGIKA: Validaci účtu nepotřebujeme v useEffectu, spočítáme ji "on the fly"
  const accountRegex = /^(\d{0,6}-)?\d{1,10}\/\d{4}$/;
  const isValidAccount = accountRegex.test(data.account);

  // ... zbytek returnu zůstává, jen u InputGroup pro účet změň onChange

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
    <div className="fade-in app-container">
      
  {/* --- STRATEGICKÝ ÚVOD (MAXIMÁLNÍ ČISTOTA) --- */}
  <div>
    <h1>Smart <span style={{ color: 'var(--primary)' }}>QR Pay</span> (CZ)</h1>
    <h2>
      Bleskové platby bez překlepů. Standard 2026 pro moderní OSVČ. 
      QR kód se generuje okamžitě v reálném čase – stačí zadat údaje, 
      zkopírovat a poslat. Platí pro platby v ČR.
    </h2>
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
  onChange={(val) => {
    setData(prev => ({ ...prev, account: val }));
    if (val) localStorage.setItem('user_account_number', val);
  }}
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
            // Změna: používáme 'prev' místo 'data'
            onChange={(val) => setData(prev => ({ ...prev, variableSymbol: val }))}
            type="text"
          />
        </div>

        <InputGroup 
          label="Zpráva pro příjemce (text max. 60 znaků)" 
          value={data.message}
          onChange={(val) => {
            // Změna: kontrola délky a funkcionální update
            if (val.length <= 60) {
              setData(prev => ({ ...prev, message: val }));
            }
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