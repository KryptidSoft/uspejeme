import React, { useState, useEffect } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { InputGroup } from '../ui/InputGroup';
import { QRCodeSVG } from 'qrcode.react';
import { exportToPDF } from "../../utils/exportHelper";
import { 
  Plus, Trash2, Printer, Settings2, ShieldCheck, Info
} from 'lucide-react';
const handlePdfExport = () => {
  const filename = `Faktura_${invoice.number}`;
  const title = isVatPayer ? (isForeign ? 'TAX INVOICE' : 'FAKTURA - DAŇOVÝ DOKLAD') : (isForeign ? 'INVOICE' : 'FAKTURA');
  
  // Definujeme hlavičky podle jazyka
  const tableHead = isForeign 
    ? ["Description", "Qty", "Unit", "Price/Unit", "Total"]
    : ["Popis položky", "Mn.", "Jedn.", "Cena/j.", "Celkem"];

  // Převedeme položky faktury na řádky tabulky
  const tableRows = invoice.items.map(item => [
    item.description,
    item.quantity.toString(),
    item.unit,
    `${item.pricePerUnit.toLocaleString()} ${currency}`,
    `${(item.quantity * item.pricePerUnit).toLocaleString()} ${currency}`
  ]);

  // Přidáme patičku se součtem přímo do tabulky (volitelné)
  tableRows.push([
    "", "", "", 
    isForeign ? "TOTAL:" : "CELKEM:", 
    `${total.toLocaleString()} ${currency}`
  ]);

  // VOLÁME TVŮJ STROJ!
  exportToPDF(filename, `${title} #${invoice.number}`, tableRows, tableHead);
};
interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
}

// ZAČÁTEK KOMPONENTY
export const EliteInvoice = () => {
  // --- CHYBĚJÍCÍ STAVY, KTERÉ KÓD POUŽÍVÁ ---
  const [isVatPayer, setIsVatPayer] = useState(false);
  const [isForeign, setIsForeign] = useState(false);
  const [vatRate, setVatRate] = useState(21);
  const [currency, setCurrency] = useState('Kč');
  const [dueDays, setDueDays] = useState(14);

const [invoice, setInvoice] = useState(() => {
    // 1. Pokus o načtení uloženého dodavatele
    const savedSupplier = localStorage.getItem('elite_invoice_supplier');
    // 2. Pokus o načtení čísla účtu ze Smart QR Pay
    const sharedAccount = localStorage.getItem('user_account_number');

    const defaultSupplier = savedSupplier ? JSON.parse(savedSupplier) : {
      name: '', 
      street: '', 
      city: '', 
      zip: '', 
      ico: '', 
      dic: '', 
      account: sharedAccount || '', // Předvyplní účet, pokud ho zná z QR generátoru
      iban: '', 
      swift: '', 
      registration: 'Fyzická osoba zapsaná v živnostenském rejstříku',
      email: '', 
      phone: ''
    };

    return {
      number: '20260001',
      variableSymbol: '20260001',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      duzp: new Date().toISOString().split('T')[0],
      supplier: defaultSupplier,
      client: { name: '', street: '', city: '', zip: '', ico: '', dic: '' },
      items: [
        { id: '1', description: 'Konzultace / Služby', quantity: 1, unit: 'hod', pricePerUnit: 0 }
      ] as InvoiceItem[]
    };
  });
 
 useEffect(() => {
    // Uloží údaje dodavatele do prohlížeče
    localStorage.setItem('elite_invoice_supplier', JSON.stringify(invoice.supplier));
    
    // Synchronizuje číslo účtu pro Smart QR Pay
    if (invoice.supplier.account) {
      localStorage.setItem('user_account_number', invoice.supplier.account);
    }
  }, [invoice.supplier]);

  // Automatické nastavení VS podle čísla faktury
  useEffect(() => {
    setInvoice(prev => ({ ...prev, variableSymbol: prev.number.replace(/\D/g, '') }));
  }, [invoice.number]);
  
  useEffect(() => {
    const issue = new Date(invoice.issueDate);
    issue.setDate(issue.getDate() + dueDays);
    setInvoice(prev => ({ ...prev, dueDate: issue.toISOString().split('T')[0] }));
  }, [invoice.issueDate, dueDays]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat(isForeign ? 'en-US' : 'cs-CZ', {
      day: 'numeric', month: isForeign ? 'long' : 'numeric', year: 'numeric'
    }).format(date);
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setInvoice({
      ...invoice,
      items: invoice.items.map(i => i.id === id ? { ...i, [field]: (field === 'quantity' || field === 'pricePerUnit' ? Math.max(0, value) : value) } : i)
    });
  };
  
  const round = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

const subtotal = round(invoice.items.reduce((sum, item) => sum + (item.quantity * item.pricePerUnit), 0));
  const vatAmount = isVatPayer ? round((subtotal * vatRate) / 100) : 0;
  const total = round(subtotal + vatAmount);

// --- VÝPOČET QR KÓDU ---
  const cleanAcc = invoice.supplier.account.replace(/\s/g, '').replace('/', '');
  const qrAmount = total.toFixed(2);
  const qrVS = invoice.variableSymbol.replace(/\D/g, '');
  const qrValue = `SPD*1.0*ACC:${cleanAcc}*AM:${qrAmount}*CUR:CZK*VS:${qrVS}`;
  
  // Ukážeme QR jen když je měna Kč a účet má lomítko
  const showQR = currency === 'Kč' && invoice.supplier.account.includes('/') && total > 0;
  
  const removeItem = (id: string) => {
  if (invoice.items.length > 1) { // Zabrání smazání úplně poslední položky
    setInvoice({
      ...invoice,
      items: invoice.items.filter(item => item.id !== id)
    });
  }
};

  return (
    <div className="fade-in" style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      
      {/* OVLÁDACÍ LIŠTA */}
      <GlassCard className="p-4 mb-6" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
          <input type="checkbox" checked={isVatPayer} onChange={e => setIsVatPayer(e.target.checked)} />
          <label>Jsem plátce DPH</label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
          <input type="checkbox" checked={isForeign} onChange={e => setIsForeign(e.target.checked)} />
          <label>Anglická verze (EN)</label>
        </div>
        {isVatPayer && (
          <select value={vatRate} onChange={e => setVatRate(Number(e.target.value))} style={{ background: '#333', color: 'white', border: '1px solid #555' }}>
            <option value={21}>21%</option>
            <option value={12}>12%</option>
          </select>
        )}
        <select value={currency} onChange={e => setCurrency(e.target.value)} style={{ background: '#333', color: 'white', border: '1px solid #555' }}>
          <option value="Kč">CZK (Kč)</option><option value="€">EUR (€)</option><option value="$">USD ($)</option>
        </select>
        <button onClick={handlePdfExport} className="calculate-btn" style={{ padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Printer size={18} /> Tisk / PDF
        </button>
      </GlassCard>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px' }} className="invoice-layout">
        
        {/* PAPÍR FAKTURY */}
        <div className="invoice-paper" style={{ background: 'white', color: '#1a1a1a', padding: '50px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', minHeight: '1100px', position: 'relative' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #eee', paddingBottom: '20px', marginBottom: '30px' }}>
            <div>
              <h1 style={{ fontSize: '24px', margin: 0, fontWeight: 700, color: '#2563eb' }}>
                {isVatPayer ? (isForeign ? 'TAX INVOICE' : 'FAKTURA - DAŇOVÝ DOKLAD') : (isForeign ? 'INVOICE' : 'FAKTURA')}
              </h1>
              <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>#{invoice.number}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontWeight: 700 }}>{isForeign ? 'Variable Symbol' : 'Variabilní symbol'}</p>
              <p style={{ margin: 0, fontSize: '18px' }}>{invoice.variableSymbol}</p>
            </div>
          </div>

          {/* Adresy */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
            <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#2563eb', textTransform: 'uppercase' }}>{isForeign ? 'Supplier' : 'Dodavatel'}</h4>
              <p style={{ fontWeight: 800, margin: '0 0 5px 0' }}>{invoice.supplier.name || '—'}</p>
              <p style={{ fontSize: '13px', margin: 0 }}>{invoice.supplier.street}</p>
              <p style={{ fontSize: '13px', margin: '0 0 10px 0' }}>{invoice.supplier.zip} {invoice.supplier.city}</p>
              <p style={{ fontSize: '13px', margin: 0 }}>{isForeign ? 'Reg. No. (IČO):' : 'IČO:'} {invoice.supplier.ico || '—'}</p>
              {isVatPayer && <p style={{ fontSize: '13px', margin: 0 }}>{isForeign ? 'VAT ID (DIČ):' : 'DIČ:'} {invoice.supplier.dic}</p>}
			  {(invoice.supplier.email || invoice.supplier.phone) && (
  <div style={{ fontSize: '12px', marginTop: '10px', color: '#444', borderTop: '1px solid #eee', paddingTop: '5px' }}>
    {invoice.supplier.email && <p style={{ margin: 0 }}>{invoice.supplier.email}</p>}
    {invoice.supplier.phone && <p style={{ margin: 0 }}>{invoice.supplier.phone}</p>}
  </div>
)}
            </div>
            <div>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#999', textTransform: 'uppercase' }}>{isForeign ? 'Client' : 'Odběratel'}</h4>
              <p style={{ fontWeight: 800, margin: '0 0 5px 0' }}>{invoice.client.name || '—'}</p>
              <p style={{ fontSize: '13px', margin: 0 }}>{invoice.client.street}</p>
              <p style={{ fontSize: '13px', margin: '0 0 10px 0' }}>{invoice.client.zip} {invoice.client.city}</p>
              <p style={{ fontSize: '13px', margin: 0 }}>{isForeign ? 'Reg. No. (IČO):' : 'IČO:'} {invoice.client.ico || '—'}</p>
              <p style={{ fontSize: '13px', margin: 0 }}>{isForeign ? 'VAT ID (DIČ):' : 'DIČ:'} {invoice.client.dic || '—'}</p>
            </div>
          </div>

          {/* Platební údaje */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px', marginBottom: '40px', fontSize: '13px' }}>
            <div style={{ borderTop: '1px solid #eee', paddingTop: '15px' }}>
              <p><strong>{isForeign ? 'Bank Account' : 'Bankovní účet'}:</strong> {invoice.supplier.account || '—'}</p>
              <p><strong>IBAN:</strong> {invoice.supplier.iban || '—'}</p>
              <p><strong>SWIFT/BIC:</strong> {invoice.supplier.swift || '—'}</p>
            </div>
            <div style={{ borderTop: '1px solid #eee', paddingTop: '15px' }}>
              <p style={{ display: 'flex', justifyContent: 'space-between' }}><span>{isForeign ? 'Issue Date' : 'Datum vystavení'}:</span> <strong>{formatDate(invoice.issueDate)}</strong></p>
              {isVatPayer && <p style={{ display: 'flex', justifyContent: 'space-between' }}><span>DUZP:</span> <strong>{formatDate(invoice.duzp)}</strong></p>}
              <p style={{ display: 'flex', justifyContent: 'space-between', color: '#2563eb' }}><span><strong>{isForeign ? 'Due Date' : 'Splatnost'}:</strong></span> <strong>{formatDate(invoice.dueDate)}</strong></p>
            </div>
          </div>

          {/* Tabulka */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #333', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase' }}>
                <th>{isForeign ? 'Description' : 'Popis položky'}</th>
                <th style={{ textAlign: 'right' }}>{isForeign ? 'Qty' : 'Mn.'}</th>
                <th style={{ textAlign: 'right' }}>{isForeign ? 'Unit' : 'Jedn.'}</th>
                <th style={{ textAlign: 'right' }}>{isForeign ? 'Price/Unit' : 'Cena/j.'}</th>
                <th style={{ textAlign: 'right' }}>{isForeign ? 'Total' : 'Celkem'}</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #eee', fontSize: '14px' }}>
                  <td style={{ padding: '12px 0' }}>{item.description}</td>
                  <td style={{ textAlign: 'right' }}>{item.quantity}</td>
                  <td style={{ textAlign: 'right' }}>{item.unit}</td>
                  <td style={{ textAlign: 'right' }}>{item.pricePerUnit.toLocaleString('cs-CZ')} {currency}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>{(item.quantity * item.pricePerUnit).toLocaleString()} {currency}</td>
                </tr>
              ))}
            </tbody>
          </table>
		  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '30px' }}>
  
  {/* LEVÁ STRANA: Samotný QR kód */}
  <div style={{ textAlign: 'left' }}>
    {showQR ? (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
        <div style={{ padding: '8px', background: 'white', border: '1px solid #eee', borderRadius: '4px' }}>
          <QRCodeSVG value={qrValue} size={115} level="M" />
        </div>
        <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#666' }}>QR PLATBA</span>
      </div>
    ) : (
      <div style={{ width: '130px' }}></div> /* Rezerva, aby se pravá strana neposunula */
    )}
  </div>

  {/* PRAVÁ STRANA: Součty (Zůstávají stejné, jen jsou vpravo) */}
  <div style={{ width: '280px', textAlign: 'right' }}>
    <p style={{ margin: '5px 0', fontSize: '14px' }}>
      {isForeign ? 'Subtotal' : 'Základ daně'}: {subtotal.toLocaleString('cs-CZ')} {currency}
    </p>
    {isVatPayer && (
      <p style={{ margin: '5px 0', fontSize: '14px' }}>
        {isForeign ? `VAT (${vatRate}%)` : `DPH (${vatRate}%)`}: {vatAmount.toLocaleString('cs-CZ')} {currency}
      </p>
    )}
    <div style={{ borderTop: '2px solid #2563eb', marginTop: '10px', paddingTop: '10px' }}>
      <h2 style={{ margin: 0, color: '#2563eb', fontSize: '22px' }}>
        {isForeign ? 'TOTAL' : 'CELKEM'}: {total.toLocaleString('cs-CZ')} {currency}
      </h2>
    </div>
  </div>
</div>

          {/* ZÁKONNÁ VĚTA (BOD 3 a 6) */}
{/* ZÁKONNÁ SEKCE */}
<div style={{ marginTop: '60px', fontSize: '11px', color: '#666', fontStyle: 'italic', borderTop: '1px solid #eee', paddingTop: '20px' }}>
  
  {/* Tady se zobrazí ta věta z Editoru (např. "Fyzická osoba zapsaná...") */}
  <p style={{ marginBottom: '5px' }}>{invoice.supplier.registration}</p>

  {!isVatPayer ? (
    <p><strong>{isForeign ? 'The supplier is not a VAT registered person.' : 'Dodavatel není plátcem DPH.'}</strong></p>
  ) : (
    isForeign && (
      <p style={{ fontWeight: 'bold' }}>
        VAT reverse charge: Relevant VAT obligation is shifted to the customer (according to Art. 196 of Council Directive 2006/112/EC).
      </p>
    )
  )}
</div>
</div>

        {/* EDITOR PANEL */}
        <div className="no-print">
          <GlassCard className="p-6">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: 'white' }}>
              <Settings2 size={20} color="#3b82f6" /> Editor
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
<details open>
  <summary style={{ color: '#3b82f6', cursor: 'pointer', fontWeight: 700, marginBottom: '10px' }}>
    Základní info & Banka
  </summary>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
	<InputGroup 
	  label="Číslo faktury" 
	  type="text" 
	  value={invoice.number} 
	  onChange={val => setInvoice({...invoice, number: val})} 
	/>

    {/* První pole je vždy Datum vystavení */}
    <InputGroup 
      label="Datum vystavení" 
      type="date" 
      value={invoice.issueDate} 
      onChange={val => setInvoice({...invoice, issueDate: val})} 
    />

    {/* Pokud je plátce, dej vedle něj DUZP. Pokud NEJENÍ plátce, dej vedle něj Splatnost */}
    {isVatPayer ? (
      <InputGroup 
        label="DUZP" 
        type="date" 
        value={invoice.duzp} 
        onChange={val => setInvoice({...invoice, duzp: val})} 
      />
    ) : (
      <InputGroup 
        label="Splatnost (dny)" 
        type="number" 
        value={dueDays} 
        onChange={val => setDueDays(Number(val))} 
      />
    )}
  </div>

  {/* Pokud je uživatel plátce, Splatnost se odsunula z prvního řádku, tak ji dáme sem přes celou šířku */}
  {isVatPayer && (
    <div style={{ marginBottom: '10px' }}>
      <InputGroup 
        label="Splatnost (dny)" 
        type="number" 
        value={dueDays} 
        onChange={val => setDueDays(Number(val))} 
      />
    </div>
  )}

  <InputGroup 
    label="Bankovní účet (1234567890/0100)" 
    type="text" 
    value={invoice.supplier.account} 
    onChange={val => setInvoice({...invoice, supplier: {...invoice.supplier, account: val}})} 
  />

  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
    <InputGroup 
      label="IBAN" 
      type="text" 
      value={invoice.supplier.iban} 
      onChange={val => setInvoice({...invoice, supplier: {...invoice.supplier, iban: val}})} 
    />
    <InputGroup 
      label="SWIFT/BIC" 
      type="text" 
      value={invoice.supplier.swift} 
      onChange={val => setInvoice({...invoice, supplier: {...invoice.supplier, swift: val}})} 
    />
  </div>
</details>

              <details>
                <summary style={{ color: '#3b82f6', cursor: 'pointer', fontWeight: 700 }}>Dodavatel (Já)</summary>
                <InputGroup label="Jméno / Firma" type="text" value={invoice.supplier.name} onChange={val => setInvoice({...invoice, supplier: {...invoice.supplier, name: val}})} />
				<InputGroup label="Registrace (Doplňte kde, např. v Brně)" type="text" value={invoice.supplier.registration} onChange={val => setInvoice({...invoice, supplier: {...invoice.supplier, registration: val}})} />
				<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', marginTop: '10px' }}>
  <InputGroup 
    label="E-mail" 
    type="email" 
    value={invoice.supplier.email} 
    onChange={val => setInvoice({...invoice, supplier: {...invoice.supplier, email: val}})} 
  />
  <InputGroup 
    label="Telefon" 
    type="text" 
    value={invoice.supplier.phone} 
    onChange={val => setInvoice({...invoice, supplier: {...invoice.supplier, phone: val}})} 
  />
</div>
                <InputGroup label="Ulice" type="text" value={invoice.supplier.street} onChange={val => setInvoice({...invoice, supplier: {...invoice.supplier, street: val}})} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '5px' }}>
                  <InputGroup label="PSČ" type="text" value={invoice.supplier.zip} onChange={val => setInvoice({...invoice, supplier: {...invoice.supplier, zip: val}})} />
                  <InputGroup label="Město" type="text" value={invoice.supplier.city} onChange={val => setInvoice({...invoice, supplier: {...invoice.supplier, city: val}})} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                  <InputGroup label="IČO" type="text" value={invoice.supplier.ico} onChange={val => setInvoice({...invoice, supplier: {...invoice.supplier, ico: val}})} />
                  {isVatPayer && <InputGroup label="DIČ" type="text" value={invoice.supplier.dic} onChange={val => setInvoice({...invoice, supplier: {...invoice.supplier, dic: val}})} />}
                </div>
              </details>

              <details>
                <summary style={{ color: '#3b82f6', cursor: 'pointer', fontWeight: 700 }}>Odběratel (Klient)</summary>
                <InputGroup label="Jméno klienta" type="text" value={invoice.client.name} onChange={val => setInvoice({...invoice, client: {...invoice.client, name: val}})} />
                <InputGroup label="Ulice" type="text" value={invoice.client.street} onChange={val => setInvoice({...invoice, client: {...invoice.client, street: val}})} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '5px' }}>
                  <InputGroup label="PSČ" type="text" value={invoice.client.zip} onChange={val => setInvoice({...invoice, client: {...invoice.client, zip: val}})} />
                  <InputGroup label="Město" type="text" value={invoice.client.city} onChange={val => setInvoice({...invoice, client: {...invoice.client, city: val}})} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                  <InputGroup label="IČO" type="text" value={invoice.client.ico} onChange={val => setInvoice({...invoice, client: {...invoice.client, ico: val}})} />
                  <InputGroup label="DIČ" type="text" value={invoice.client.dic} onChange={val => setInvoice({...invoice, client: {...invoice.client, dic: val}})} />
                </div>
              </details>

              <div style={{ borderTop: '1px solid #444', paddingTop: '15px' }}>
                <h4 style={{ color: 'white', marginBottom: '10px' }}>Položky</h4>
                {invoice.items.map((item) => (
                  <div key={item.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px', marginBottom: '10px', position: 'relative' }}>
				  <button 
  onClick={() => removeItem(item.id)}
  style={{ 
    position: 'absolute', 
    top: '5px', 
    right: '5px', 
    background: 'rgba(239, 68, 68, 0.15)', 
    border: 'none', 
    color: '#ef4444', 
    cursor: 'pointer', 
    padding: '4px',
    borderRadius: '4px',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}
  title="Smazat položku"
>
  <Trash2 size={14} />
</button>
                    <InputGroup label="Popis" type="text" value={item.description} onChange={val => updateItem(item.id, 'description', val)} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '5px', marginTop: '5px' }}>
                      <InputGroup label="Mn." type="number" value={item.quantity} onChange={val => updateItem(item.id, 'quantity', Number(val))} />
                      <InputGroup label="Jedn." type="text" value={item.unit} onChange={val => updateItem(item.id, 'unit', val)} />
                      <InputGroup label="Cena/j." type="number" value={item.pricePerUnit} onChange={val => updateItem(item.id, 'pricePerUnit', Number(val))} />
                    </div>
                  </div>
                ))}
                <button onClick={() => setInvoice({...invoice, items: [...invoice.items, { id: Math.random().toString(), description: '', quantity: 1, unit: 'hod', pricePerUnit: 0 }]})} style={{ width: '100%', padding: '10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', marginTop: '10px' }}>
                  + Přidat položku
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};