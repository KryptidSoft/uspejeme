import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { GlassCard } from '../ui/GlassCard';
import { InputGroup } from '../ui/InputGroup';
import { QrCode, Copy, CheckCircle2, AlertCircle, Wallet, Globe, Landmark } from 'lucide-react';

export const QRGenerator: React.FC = () => {
  // PŘIDÁNO: Režim přepínání mezi CZ standardem a SEPA (EUR)
  const [mode, setMode] = useState<'CZ' | 'EU'>('CZ');

  // 1. STAV: Rozšířeno o IBAN a BIC pro cizince, zachována tvoje lazy inicializace
  const [data, setData] = useState(() => {
    return {
      account: localStorage.getItem('user_account_number') || '',
      iban: localStorage.getItem('user_iban') || '',
      bic: localStorage.getItem('user_bic') || '',
      amount: '',
      variableSymbol: '',
      message: '',
    };
  });

  const originalAmount = useRef('');
  const [copied, setCopied] = useState(false);
  
  React.useEffect(() => {
  // Pokud uživatel nemá nastavenou češtinu, přepneme na SEPA/EU režim automaticky
  const isNotCzech = !navigator.language.startsWith('cs');
  const hasNoSavedAccount = !localStorage.getItem('user_account_number');
  
  if (isNotCzech && hasNoSavedAccount) {
    setMode('EU');
  }
}, []);

  // 2. LOGIKA: Validace účtu pro CZ i IBAN pro EU
  const accountRegex = /^(\d{0,6}-)?\d{1,10}\/\d{4}$/;
  const isValid = mode === 'CZ' 
    ? accountRegex.test(data.account) 
    : data.iban.replace(/\s/g, '').length >= 15;

  // TVOJE FUNKCE: addTax (zůstává beze změny, je skvělá)
  const addTax = (percentage: number) => {
    const base = originalAmount.current || data.amount;
    const rawValue = base.replace(/\s/g, '').replace(',', '.');
    const currentAmount = parseFloat(rawValue);
    
    if (!isNaN(currentAmount)) {
      if (!originalAmount.current) originalAmount.current = data.amount;
      const withTax = currentAmount * (1 + percentage / 100);
      setData(prev => ({ ...prev, amount: Math.round(withTax).toString() }));
    }
  };

  const handleAmountChange = (val: string) => {
    setData(prev => ({ ...prev, amount: val }));
    originalAmount.current = ''; 
  };

  // LOGIKA GENEROVÁNÍ: Spojení tvého SPD standardu a nového EPC (SEPA) standardu
  const cleanAmount = data.amount.replace(',', '.').replace(/\s/g, '');
  
// Definujeme si pomocnou funkci pro "odháčkování" textu pro banky
const cleanForBank = (text: string) => 
  text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\*/g, ' ');

const qrValue = mode === 'CZ' 
    ? [
        'SPD*1.0',
        `ACC:${data.account.replace(/\s/g, '')}`,
        `AM:${cleanAmount}`,
        'CUR:CZK',
        data.variableSymbol && `VS:${data.variableSymbol}`,
        data.message && `MSG:${cleanForBank(data.message)}` // Vyčištěno pro české banky
      ].filter(Boolean).join('*')
    : [
        'BCD',
        '002',
        '1',
        'SCT',
        data.bic.replace(/\s/g, ''),
        'PLATBA / PAYMENT',
        data.iban.replace(/\s/g, ''),
        `EUR${parseFloat(cleanAmount || '0').toFixed(2)}`,
        '',
        '',
        // Tady je to nejdůležitější - očista pro Evropu:
        cleanForBank(data.message || data.variableSymbol || 'Invoice')
      ].join('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(qrValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
// Detekce, zda je uživatel Čech/Slovák
  const isLocal = navigator.language.startsWith('cs') || navigator.language.startsWith('sk');

const t = {
    title: 'Smart QR Pay',
    badge: mode === 'CZ' ? '(CZ)' : '(EUR)',
    subtitle: mode === 'CZ' 
      ? (isLocal 
          ? 'Bleskové platby bez překlepů. Standard 2026 pro moderní OSVČ. QR kód se generuje okamžitě v reálném čase – stačí zadat údaje, zkopírovat a poslat. Platí pro platby v ČR.' 
          : 'Lightning-fast payments without typos. The 2026 standard for modern freelancers. QR code generates in real-time – just enter data, copy, and send. Valid for CZ payments.')
      : (isLocal 
          ? 'Mezinárodní standard pro platby v EUR. Generuje univerzální EPC kód kompatibilní se všemi evropskými bankami. Ideální pro fakturaci do zahraničí bez poplatků za převod.' 
          : 'International standard for EUR payments. Generates a universal EPC code compatible with all European banks. Ideal for international invoicing without transfer fees.'),
    btnLocal: isLocal ? 'QR pro CZK' : 'QR Pay in CZK',
    btnEurope: isLocal ? 'QR pro EUR' : 'QR Pay in EUR',
    tagLocal: isLocal ? 'České banky (SPD standard)' : 'Czech banks (SPD standard)',
    tagEurope: isLocal ? 'Evropa (EPC kompatibilní)' : 'Europe (EPC compatible)',
    bankDetails: isLocal ? 'Bankovní údaje' : 'Bank Details',
    accountLabel: isLocal ? 'Číslo účtu' : 'Account Number',
    amountLabel: isLocal ? `Částka (${mode === 'CZ' ? 'CZK' : 'EUR'})` : `Amount (${mode === 'CZ' ? 'CZK' : 'EUR'})`,
    vsLabel: isLocal ? 'Variabilní symbol' : 'Variable Symbol / Ref',
    msgLabel: isLocal ? 'Zpráva pro příjemce' : 'Message for recipient',
    placeholder: isLocal ? 'Doplňte účet a částku' : 'Enter account and amount',
    copyBtn: isLocal ? 'Kopírovat kód' : 'Copy QR Code',
    copied: isLocal ? 'Zkopírováno' : 'Copied!',
    tax: isLocal ? 'DPH' : 'VAT'
  };

return (
  <div className="fade-in app-container">
    <div style={{ textAlign: 'center', marginBottom: '25px' }}>
      <h1>Smart <span style={{ color: 'var(--primary)' }}>QR Pay</span> {t.badge}</h1>
      <h2 style={{ opacity: 0.7, marginBottom: '20px' }}>{t.subtitle}</h2>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', justifyContent: 'center' }}>
        <button 
          onClick={() => setMode('CZ')}
          className="nav-link"
          style={{ 
            flex: 1, 
            maxWidth: '180px', 
            justifyContent: 'center',
            border: `1px solid ${mode === 'CZ' ? 'var(--primary)' : 'var(--glass-border)'}`,
            background: mode === 'CZ' ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
            color: mode === 'CZ' ? 'white' : 'var(--text-dim)'
          }}
        >
          <Landmark size={16} /> {t.btnLocal}
        </button>
        <button 
          onClick={() => setMode('EU')}
          className="nav-link"
          style={{ 
            flex: 1, 
            maxWidth: '180px', 
            justifyContent: 'center',
            border: `1px solid ${mode === 'EU' ? 'var(--primary)' : 'var(--glass-border)'}`,
            background: mode === 'EU' ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
            color: mode === 'EU' ? 'white' : 'var(--text-dim)'
          }}
        >
          <Globe size={16} /> {t.btnEurope}
        </button>
      </div>
    </div> {/* <-- TADY byl ten chybějící konec hlavičky */}

      <div className="layout-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <GlassCard className="p-6">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
  <Wallet size={20} color="var(--primary)" /> {t.bankDetails}
</h3>
            
            <div style={{ position: 'relative' }}>
              {mode === 'CZ' ? (
                <InputGroup 
                  label="Číslo účtu (vzor 123456789/0100)" 
                  placeholder="123456789/0100"
                  value={data.account}
                  onChange={(val) => {
                    setData(prev => ({ ...prev, account: val }));
                    localStorage.setItem('user_account_number', val);
                  }}
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <InputGroup 
                    label="IBAN (CZ61 0100...)" 
                    placeholder="CZ00 0000 0000 0000 0000 0000"
                    value={data.iban}
                    onChange={(val) => {
                      setData(prev => ({ ...prev, iban: val }));
                      localStorage.setItem('user_iban', val);
                    }}
                  />
                  <InputGroup 
                    label="BIC (SWIFT)" 
                    placeholder="KOMBCZPP"
                    value={data.bic}
                    onChange={(val) => {
                      setData(prev => ({ ...prev, bic: val }));
                      localStorage.setItem('user_bic', val);
                    }}
                  />
                </div>
              )}
              {/* Validace se zobrazuje jen pro CZ režim nebo IBAN */}
              {(mode === 'CZ' ? data.account.length > 5 : data.iban.length > 5) && (
                <div style={{ position: 'absolute', right: '12px', top: '38px' }}>
                  {isValid ? <CheckCircle2 size={18} color="#10b981" /> : <AlertCircle size={18} color="#ef4444" />}
                </div>
              )}
            </div>

            <div className="smart-grid" style={{ marginTop: '10px' }}>
              <div>
                <InputGroup 
  label={t.amountLabel} 
  value={data.amount}
  onChange={handleAmountChange}
/>
{mode === 'CZ' && (
  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
    <button onClick={() => addTax(12)} className="tax-btn">+12% {t.tax}</button>
    <button onClick={() => addTax(21)} className="tax-btn">+21% {t.tax}</button>
  </div>
)}
              </div>
              <InputGroup 
  label={t.vsLabel} 
  value={data.variableSymbol}
  onChange={(val) => setData(prev => ({ ...prev, variableSymbol: val }))}
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
          <GlassCard className="p-6" style={{ textAlign: 'center', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '345px' }}>
            {isValid && cleanAmount && parseFloat(cleanAmount) > 0 ? (
              <>
                <div style={{ padding: '10px', background: 'white', borderRadius: '10px' }}>
                  <QRCodeSVG value={qrValue} size={220} level="H" includeMargin={true} />
                </div>
                <p style={{ color: '#333', fontSize: '1rem', marginTop: '10px', fontWeight: 'bold' }}>
                  {data.amount} {mode === 'CZ' ? 'CZK' : 'EUR'}
                </p>
              </>
            ) : (
              <div style={{ color: '#666', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <QrCode size={60} opacity={0.2} />
                <span style={{ fontSize: '0.85rem' }}>{t.placeholder}</span>
              </div>
            )}
          </GlassCard>

          <button
            onClick={handleCopy}
            className={`btn ${copied ? 'btn-success' : !isValid ? 'btn-inactive' : ''}`}
            disabled={!isValid}
          >
            {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
            {copied ? t.copied : t.copyBtn}
          </button>
        </div>
      </div>

      <style>{`
        .tax-btn {
          font-size: 0.7rem; 
          padding: 6px 10px; 
          border-radius: 4px; 
          background: rgba(255,255,255,0.1); 
          border: 1px solid #555; 
          color: #ccc; 
          cursor: pointer;
          transition: 0.2s;
        }
        .tax-btn:hover { background: rgba(255,255,255,0.2); border-color: var(--primary); }
      `}</style>
    </div>
  );
};