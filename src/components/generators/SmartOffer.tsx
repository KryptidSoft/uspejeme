import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { InputGroup } from '../ui/InputGroup';
// OPRAVA CESTY A JMÉNA (zkontroluj, zda máš v názvu souboru jedno nebo dvě 's')
import { useBusinessData } from '../../hooks/useBusinessData';
import { calculateOfferTotals } from '../../utils/calculations/smartOffer';
import type { OfferItem } from '../../types';
// Očištěné ikony (odebrány Copy a CheckCircle2)
import { Plus, Trash2, Download } from 'lucide-react';

export const SmartOffer: React.FC = () => {
  const { data: businessData, updateData } = useBusinessData();
  const [lang] = useState<'cs' | 'en'>(navigator.language.startsWith('cs') ? 'cs' : 'en');
  const isLocal = lang === 'cs';
  
const [currency, setCurrency] = useState<'CZK' | 'EUR' | 'USD'>(() => {
  const locale = navigator.language.toLowerCase();
  if (locale.startsWith('cs')) return 'CZK';
  if (locale.includes('us')) return 'USD';
  return 'EUR';
});

  // --- PŘEKLADOVÝ SLOVNÍK ---
  const t = {
    title: isLocal ? 'Chytrá cenová nabídka' : 'Smart Price Proposal',
    sub: isLocal 
      ? 'Vytvořte profesionální PDF nabídku pro své klienty během několika sekund. Všechna data zůstávají v bezpečí vašeho prohlížeče.'
      : 'Create a professional PDF proposal for your clients in seconds. All data stays safe in your browser.',
    vendor: isLocal ? 'Dodavatel' : 'Supplier',
    project: isLocal ? 'Jméno projektu' : 'Project Name',
    client: isLocal ? 'Odběratel' : 'Client',
    desc: isLocal ? 'Popis' : 'Description',
    qty: isLocal ? 'Mn.' : 'Qty',
    price: isLocal ? 'Cena' : 'Price',
    vat: isLocal ? 'DPH%' : 'VAT%',
    add: isLocal ? 'Přidat položku' : 'Add Item',
    base: isLocal ? 'Základ:' : 'Subtotal:',
    total: isLocal ? 'CELKEM:' : 'TOTAL:',
    download: isLocal ? 'Stáhnout PDF' : 'Download PDF',
    generating: isLocal ? 'Generuji...' : 'Generating...',
	validity: isLocal ? 'Platnost (dní)' : 'Validity (days)',
    days: isLocal ? 'dní' : 'days',
  };

  const [projectName, setProjectName] = useState('');
  const [client, setClient] = useState('');
  const [validDays, setValidDays] = useState('14');
  const [exportLang, setExportLang] = useState<'cs' | 'en'>(navigator.language.startsWith('cs') ? 'cs' : 'en');
  const [items, setItems] = useState<OfferItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0, taxRate: isLocal ? 21 : 0 }
  ]);
  const [isExporting, setIsExporting] = useState(false);

  const totals = calculateOfferTotals(items);

  const handlePdfExport = async () => {
    if (isExporting) return;
    setIsExporting(true);

    try {
const helper = await import("../../utils/offerExportHelper");

const isExportEn = exportLang === 'en';
const filename = isExportEn ? `Proposal_${projectName || client || 'export'}` : `Nabidka_${projectName || client || 'export'}`;
const title = isExportEn ? 'PRICE PROPOSAL' : 'CENOVÁ NABÍDKA';

const exportData = {
  number: `CN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
  isForeign: isExportEn,
  projectName: projectName,
  supplier: { name: businessData.companyName || '' },
  client: { name: client },
  issueDate: new Date(),
  validDays: parseInt(validDays) || 14
};

const tableHead = isExportEn 
  ? ["Description", "Qty", "Unit Price", "Tax", "Total"]
  : ["Popis", "Mn.", "Cena/j.", "DPH", "Celkem"];

      const tableRows = items.map(item => [
        item.description,
        item.quantity.toString(),
        `${item.unitPrice.toLocaleString()} ${currency}`,
        `${item.taxRate}%`,
        `${(item.quantity * item.unitPrice).toLocaleString()} ${currency}`
      ]);

tableRows.push([
        "", "", "", 
        isExportEn ? "TOTAL:" : "CELKEM:", 
        `${totals.total.toLocaleString()} ${currency}`
      ]);

      await helper.exportOfferToPDF(filename, title, tableRows, tableHead, exportData);
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0, taxRate: isLocal ? 21 : 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (index: number, field: keyof OfferItem, val: string) => {
    const newItems = [...items];
    const item = { ...newItems[index] };
    if (field === 'description') {
      item.description = val;
    } else if (field === 'quantity' || field === 'unitPrice' || field === 'taxRate') {
      // Tady TypeScriptu jasně řekneme, že field je jedno z číselných polí
      const numValue = val === '' ? 0 : parseFloat(val);
      item[field] = isNaN(numValue) ? 0 : numValue;
    }
    newItems[index] = item;
    setItems(newItems);
  };

return (
    <div className="app-container fade-in" style={{ paddingTop: '1rem' }}>
      {/* NADPISY */}
      <div style={{ marginBottom: '40px' }}>
        <h1>{t.title}</h1>
        <h2>{t.sub}</h2>
      </div>

      <div className="layout-grid">
        {/* LEVÝ SLOUPEC: FORMULÁŘ A POLOŽKY */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <GlassCard className="p-6">
<div style={{ 
  display: 'grid', 
  /* Na mobilu (do 768px) 2 sloupce, na monitoru 4 sloupce */
  gridTemplateColumns: window.innerWidth < 768 ? '1fr 1fr' : 'repeat(4, 1fr)', 
  gap: '1rem' 
}}>
  <InputGroup label={t.project} type="text" value={projectName} onChange={(val) => setProjectName(val)} />
  <InputGroup label={t.validity} type="number" value={validDays} onChange={(val) => setValidDays(val)} />
  <InputGroup label={t.vendor} type="text" value={businessData.companyName || ''} onChange={(val) => updateData({ companyName: val })} />
  <InputGroup label={t.client} type="text" value={client} onChange={(val) => setClient(val)} />
</div>
          </GlassCard>

          <GlassCard className="p-6">
            {items.map((item, index) => (
              <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '4fr 1.5fr 2fr 1.5fr auto', gap: '0.75rem', marginBottom: '1rem' }}>
                <InputGroup label={index === 0 ? t.desc : ""} type="text" value={item.description} onChange={(val) => updateItem(index, 'description', val)} />
                <InputGroup label={index === 0 ? t.qty : ""} type="number" value={item.quantity} onChange={(val) => updateItem(index, 'quantity', val)} />
                <InputGroup label={index === 0 ? t.price : ""} type="number" value={item.unitPrice} onChange={(val) => updateItem(index, 'unitPrice', val)} />
                <InputGroup label={index === 0 ? t.vat : ""} type="number" value={item.taxRate} onChange={(val) => updateItem(index, 'taxRate', val)} />
                <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', alignSelf: 'center' }}><Trash2 size={20}/></button>
              </div>
            ))}
            <button onClick={addItem} className="btn"><Plus size={16}/> {t.add}</button>
          </GlassCard>
        </div>

        {/* PRAVÝ SLOUPEC: NASTAVENÍ MĚNY A REKAPITULACE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <GlassCard className="p-6">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

 {/* VÝBĚR JAZYKA PDF */}
<div style={{ 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', 
  paddingBottom: '12px', 
  borderBottom: '1px solid var(--glass-border)',
  marginBottom: '12px' 
}}>
  <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Jazyk PDF / PDF Lang</span>
  <select 
    value={exportLang} 
    onChange={(e) => setExportLang(e.target.value as 'cs' | 'en')}
    style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)', padding: '4px 8px', borderRadius: '8px', fontSize: '0.85rem', cursor: 'pointer' }}
  >
    <option value="cs" style={{ background: '#1e293b' }}>🇨🇿 CZ</option>
    <option value="en" style={{ background: '#1e293b' }}>🇬🇧 EN</option>
  </select>
</div>
 
              {/* VÝBĚR MĚNY - INTEGROVANÝ */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                paddingBottom: '12px', 
                borderBottom: '1px solid var(--glass-border)',
                marginBottom: '5px' 
              }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                  {isLocal ? 'Měna nabídky' : 'Currency'}
                </span>
                <select 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value as 'CZK' | 'EUR' | 'USD')}
                  style={{ 
                    background: 'rgba(255,255,255,0.05)', 
                    color: 'white', 
                    border: '1px solid var(--glass-border)', 
                    padding: '4px 8px', 
                    borderRadius: '8px', 
                    cursor: 'pointer', 
                    outline: 'none',
                    fontSize: '0.85rem'
                  }}
                >
                  <option value="CZK" style={{ background: '#1e293b' }}>CZK (Kč)</option>
                  <option value="EUR" style={{ background: '#1e293b' }}>EUR (€)</option>
                  <option value="USD" style={{ background: '#1e293b' }}>USD ($)</option>
                </select>
              </div>

              {/* REKAPITULACE CENY */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-dim)' }}>{t.base}</span>
                  <span>{totals.subtotal.toLocaleString()} {currency}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary)' }}>
                  <span>{t.total}</span>
                  <span>{totals.total.toLocaleString()} {currency}</span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* AKČNÍ TLAČÍTKO - JEN PDF EXPORT */}
          <button 
            onClick={handlePdfExport} 
            className="btn" 
            style={{ 
              background: '#2563eb', 
              color: 'white', 
              height: '50px', 
              fontSize: '1.1rem', 
              fontWeight: 'bold' 
            }} 
            disabled={isExporting}
          >
             <Download size={20} /> {isExporting ? t.generating : t.download}
          </button>
        </div>
      </div>
    </div>
  );
};