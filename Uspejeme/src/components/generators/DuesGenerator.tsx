import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { InputGroup } from '../ui/InputGroup';
import { Copy, Download, Clock, ShieldAlert, BellRing, CheckCircle2 } from 'lucide-react';

type Tone = 'friendly' | 'formal' | 'urgent';

export const DuesGenerator: React.FC = () => {
const [invoice, setInvoice] = useState(() => {
  // Zkusíme načíst uložené jméno z paměti
  const savedName = localStorage.getItem('dues_your_name');
  
  return {
    date: new Date().toISOString().split('T')[0],
    dueDays: 14,
    client: '',
    amount: '',
    id: '',
    yourName: savedName || '', // Načte se uložené jméno
  };
});
  const [tone, setTone] = useState<Tone>('friendly');
  const today = new Date().toLocaleDateString('cs-CZ');
  const [copied, setCopied] = useState(false);
React.useEffect(() => {
    localStorage.setItem('dues_your_name', invoice.yourName);
  }, [invoice.yourName]);
  const dueDate = new Date(invoice.date);
  dueDate.setDate(dueDate.getDate() + Number(invoice.dueDays));

  const getReminderText = () => {
    const dateStr = dueDate.toLocaleDateString('cs-CZ');
    const amountStr = invoice.amount || '___';
    const idStr = invoice.id || '___';
    const clientStr = invoice.client || '...';
    
    // Záhlaví s dnešním datem a podpis
    const header = `${today} | `;
    const signature = invoice.yourName ? `\n\nS pozdravem,\n${invoice.yourName}` : '';
    
    switch (tone) {
      case 'friendly':
        return `${header}Ahoj, v systému mi svítí, že faktura č. ${idStr} pro ${clientStr} (${amountStr} Kč) měla splatnost ${dateStr}. Možná jen zapadla v mailu? Prosím o úhradu obratem. Díky!${signature}`;
      case 'formal':
        return `${header}Upomínka k úhradě faktury č. ${idStr}. Vážený kliente (${clientStr}), evidujeme neuhrazenou platbu ve výši ${amountStr} Kč se splatností dne ${dateStr}. Prosíme o sjednání nápravy obratem.${signature}`;
      case 'urgent':
        return `${header}DŮRAZNÁ VÝZVA. Žádáme o okamžitou úhradu faktury č. ${idStr} (${amountStr} Kč). Upozorňujeme, že dle nařízení vlády č. 351/2013 Sb. nám u této obchodní transakce v prodlení vznikl nárok na paušální náhradu nákladů spojených s uplatněním pohledávky ve výši 1 200 Kč za každou fakturu. Pokud nebude částka připsána do 3 pracovních dnů, budeme nuceni tuto náhradu společně s úroky z prodlení začít vymáhat právní cestou.${signature}`;
      default: return '';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getReminderText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadIcs = () => {
    const icsDate = dueDate.toISOString().replace(/-|:|\.\d+/g, '').split('T')[0];
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART;VALUE=DATE:${icsDate}`,
      `SUMMARY:Splatnost faktury ${invoice.id}`,
      `DESCRIPTION:Zkontrolovat platbu od ${invoice.client} - ${invoice.amount} Kč`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `splatnost-${invoice.id || 'faktura'}.ics`;
    link.click();
  };

  return (
    <div className="fade-in app-container">
  <div>
    <h1>Hlídač <span style={{ color: 'var(--primary)' }}>Plateb</span></h1>
    <h2>
      Profesionální správa splatnosti a upomínek. Zadejte údaje o faktuře a vyberte tón upomínky. 
      Text můžete okamžitě zkopírovat a poslat klientovi nebo použít jako připomenutí ve své evidenci.
    </h2>
  </div>

      <div className="layout-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <GlassCard className="p-6">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Clock size={20} color="var(--primary)" /> Parametry faktury
            </h3>
            
            <InputGroup 
              label="Datum vystavení" 
              type="date" 
              value={invoice.date} 
              onChange={(val) => setInvoice({...invoice, date: val})} 
            />
            
            <div style={{ marginBottom: '20px' }}>
              <InputGroup 
                label="Splatnost (dny)" 
                type="number" 
                value={invoice.dueDays} 
                onChange={(val) => setInvoice({...invoice, dueDays: Number(val)})} 
              />
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                {[7, 14, 30].map(days => (
                  <button 
                    key={days}
                    onClick={() => setInvoice({...invoice, dueDays: days})}
                    style={{ 
                      fontSize: '0.7rem', padding: '4px 10px', borderRadius: '4px', 
                      background: invoice.dueDays === days ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                      border: '1px solid #555', color: 'white', cursor: 'pointer' 
                    }}
                  >
                    {days} dní
                  </button>
                ))}
              </div>
            </div>

            <div className="layout-grid" style={{ gap: '30px' }}>
              {/* OPRAVA 1: type="text" */}
              <InputGroup label="Částka (Kč)" type="text" value={invoice.amount} onChange={(val) => setInvoice({...invoice, amount: val})} />
              {/* OPRAVA 2: type="text" */}
              <InputGroup label="Faktura / VS" type="text" value={invoice.id} onChange={(val) => setInvoice({...invoice, id: val})} />
            </div>

            {/* OPRAVA 3: type="text" */}
            <InputGroup label="Klient / Firma" type="text" value={invoice.client} onChange={(val) => setInvoice({...invoice, client: val})} />
            
            {/* OPRAVA 4: type="text" */}
            <InputGroup 
              label="Vaše jméno / Firma (podpis)" 
              type="text"
              value={invoice.yourName} 
              onChange={(val) => setInvoice({...invoice, yourName: val})} 
              placeholder="např. Jan Novák - Design"
            />
            
            <button 
  onClick={downloadIcs} 
  className="btn" 
  style={{ width: '100%', marginTop: '10px' }}
>
  <Download size={20} /> 
  <span>Uložit termín do kalendáře</span>
</button>
          </GlassCard>

          <div style={{ padding: '25px', background: 'linear-gradient(135deg, #3b82f622, #1d4ed822)', borderRadius: '15px', border: '1px solid #3b82f644', textAlign: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '1px' }}>Datum splatnosti</span>
            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'white', marginTop: '5px' }}>
              {dueDate.toLocaleDateString('cs-CZ')}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <GlassCard className="p-6">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <BellRing size={20} color="#fbbf24" /> Generátor upomínky
            </h3>
            
<div style={{ 
  display: 'flex', 
  gap: '5px',        // Zmenšeno z 10px na 5px, aby bylo víc místa pro text
  marginBottom: '20px',
  width: '100%'      // Pojistka, aby kontejner nebyl širší než karta
}}>
  {(['friendly', 'formal', 'urgent'] as Tone[]).map((t) => (
    <button 
      key={t}
      onClick={() => setTone(t)}
      style={{
        flex: 1,           // Každé tlačítko dostane přesně 1/3 místa
        padding: '10px 2px', // Minimální boční padding, aby text mohl ke kraji
        borderRadius: '8px', 
        border: 'none', 
        cursor: 'pointer', 
        fontSize: '0.65rem', // Zmenšeno z 0.75rem na 0.65rem (klíčové pro mobil)
        fontWeight: '800',
        background: tone === t ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
        color: tone === t ? 'white' : '#999',
        transition: 'all 0.2s',
        overflow: 'hidden',   // Jistota, že nic nevyleze
        whiteSpace: 'nowrap'  // Text zůstane v jedné lince
      }}
    >
                  {t === 'friendly' ? 'PŘÁTELSKÁ' : t === 'formal' ? 'FORMÁLNÍ' : 'DŮRAZNÁ'}
                </button>
              ))}
            </div>

            <textarea 
              value={getReminderText()}
              readOnly
              style={{ width: '100%', height: '200px', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid var(--border)', borderRadius: '10px', padding: '15px', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '15px', resize: 'none' }}
            />

<button 
  className="btn btn-glass" 
  onClick={handleCopy} 
  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
>
  {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
  {copied ? 'Zkopírováno do schránky' : 'Kopírovat text upomínky'}
</button>
          </GlassCard>

          <GlassCard className="p-5" style={{ borderLeft: '4px solid #ef4444', background: 'rgba(239, 68, 68, 0.05)' }}>
            <div style={{ display: 'flex', gap: '15px' }}>
              <ShieldAlert color="#ef4444" size={28} />
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#fca5a5' }}>Právní minimum</h4>
                <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: '1.4' }}>
                  Standardní splatnost je 30 dní. U upomínek "obratem" vyjadřujete jasný zájem o vyrovnání závazku bez zbytečných průtahů.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};