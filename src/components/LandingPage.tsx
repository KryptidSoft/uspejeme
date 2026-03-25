import React, { useState } from 'react';
import { Zap, Quote, Lightbulb, Calendar, FileText, Activity, ChevronRight } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { DeadlineWidget } from './DeadlineWidget';
import { articles } from '../data/articles';
import { useNavigate } from "react-router-dom";
import { useBusinessData } from '../hooks/useBusinessData';
import { formatCZK } from '../utils/calculations/mathHelpers';
import type { BusinessType } from '../types/index';

interface LandingPageProps {
  onNavigate: (view: string, param?: string) => void;
}

const MAIN_STATS = [
  { label: 'Podnikatelská komunita', value: '2.16 mil.', sub: 'OSVČ a malé firmy', change: +1.2, color: '#3b82f6' },
  { label: 'Podíl na rozpočtu', value: '38.3 %', sub: 'klíčový pilíř ekonomiky', change: -0.2, color: '#10b981' },
  { label: 'Roční přínos státu', value: '148 mld.', sub: 'odvedeno na daních a pojistném', change: +4.5, color: '#f59e0b' }
];

export const testimonials = [
  {
    name: "Petr Šeda",
    role: "Full-stack Developer",
    text: "Díky kalkulačce hodinové sazby jsem zjistil, že jsem roky pracoval pod cenou. Tohle by měl mít každý freelancer."
  },
  {
    name: "Jana Nováková",
    role: "Copywriterka",
    text: "Konečně nástroj, který počítá s inflací. Pomohlo mi to rozhodnout se, jestli investovat do nového vybavení."
  }
];

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { data: globalData } = useBusinessData();
  const [userType, setUserType] = useState<BusinessType>('all');
  const navigate = useNavigate();

  return (
    <div className="fade-in app-container" style={{ overflowX: 'hidden' }}>
      
      {/* 1. HERO SEKCE */}
      <section style={{ textAlign: 'center', padding: '60px 0 40px' }}>
        <div style={{ 
          display: 'inline-flex', alignItems: 'center', gap: '8px', 
          background: 'rgba(59, 130, 246, 0.1)', padding: '8px 16px', 
          borderRadius: '20px', color: 'var(--primary)', fontSize: '0.8rem',
          fontWeight: 'bold', marginBottom: '24px', border: '1px solid rgba(59, 130, 246, 0.2)'
        }}>
          <Zap size={14} /> VAŠE DATA, VAŠE SVOBODA
        </div>
        
        <h1 style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', fontWeight: '800', marginBottom: '20px', lineHeight: '1.2' }}>
          Podnikejte s klidnou hlavou.<br />
          <span style={{ color: 'var(--primary)' }}>Zbytek spočítáme my.</span>
        </h1>
        
        <p style={{ fontSize: '1.1rem', color: 'var(--text-dim)', maxWidth: '650px', margin: '0 auto', lineHeight: '1.6' }}>
          Uspejeme.cz je váš osobní kompas ve světě financí. 
          Zjistěte svou skutečnou hodnotu a nenechte se zaskočit výpadky příjmů.
        </p>
      </section>

{/* 2. STATISTIKY */}
<section style={{ maxWidth: '1100px', margin: '0 auto 60px', padding: '0 20px' }}>
  <div className="smart-grid">
    {MAIN_STATS.map((stat, i) => (
      <GlassCard key={i} style={{ padding: '30px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: stat.color }} />
        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>{stat.label}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff' }}>{stat.value}</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.85rem', fontWeight: 'bold', color: stat.change >= 0 ? '#10b981' : '#ef4444', whiteSpace: 'nowrap' }}>
            {stat.change >= 0 ? '↑' : '↓'} {Math.abs(stat.change).toFixed(1)} %
          </div>
        </div>
        <div style={{ fontSize: '0.85rem', color: stat.color, fontWeight: '600' }}>{stat.sub}</div>
      </GlassCard>
    ))}
  </div>
</section>

{/* 3. ROZCESTNÍK / PROFIL */}
<section style={{ maxWidth: '1100px', margin: '0 auto 80px', padding: '0 20px' }}>
  <GlassCard style={{ 
    padding: '40px', 
    background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(16,185,129,0.05) 100%)',
    display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '30px'
  }}>
    <div style={{ flex: '1 1 500px' }}>
      {globalData.hourlyRate > 0 ? (
        <>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '12px' }}>Váš finanční panel je připraven</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
            Aktuálně pracujete se sazbou <strong>{formatCZK(globalData.hourlyRate)}/h</strong>. 
            Podívejte se na celkový přehled vašeho podnikání a stabilitu v reálném čase. Výsledky můžete průběžně spravovat v sekci Můj panel nebo ostatních kalkulačkách.
          </p>
        </>
      ) : (
        <>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '12px' }}>Váš finanční přehled 2026</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
            Zatím nemáte vyplněna žádná data. Začněte Plánovačem prosperity, abychom mohli 
            vypočítat vaši ideální hodinovou sazbu a stabilitu podnikání.
          </p>
        </>
      )}
    </div>
    <button 
      /* TADY JE TA ZMĚNA: Pokud má data, jde na dashboard, jinak na prosperitu */
      onClick={() => onNavigate(globalData.hourlyRate > 0 ? 'dashboard' : 'prosperita')}
      style={{ 
        padding: '14px 28px', borderRadius: '12px', border: 'none', 
        background: 'var(--primary)', color: '#fff', fontWeight: 'bold', 
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px'
      }}
    >
      {globalData.hourlyRate > 0 ? 'Zobrazit panel' : 'Nastavit profil'} <ChevronRight size={18} />
    </button>
  </GlassCard>
</section>

{/* 4. ČLÁNKY A TERMÍNY - KOMPAKTNÍ DASHBOARD VZHLED */}
<section style={{ marginBottom: '60px' }}>
  <div className="calculator-grid">
    
{/* LEVÝ PANEL: STRATEGIE (Vizuálně sjednoceno s pravým panelem) */}
<GlassCard style={{ padding: '24px', display: 'flex', flexDirection: 'column', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
    <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '8px' }}>
      <Lightbulb size={20} color="#fff" />
    </div>
    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>Nejnovější strategie</h3>
  </div>

  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
    {articles?.slice(0, 3).map((article) => (
      <div 
        key={article.id}
        onClick={() => navigate(`/articles/${article.id}`)}
        style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '12px 16px', 
          borderRadius: '14px', 
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)', 
          cursor: 'pointer',
          borderLeft: '4px solid var(--primary)' // Sjednocení s designem kalendáře
        }}
      >
        {/* IKONA STRATEGIE */}
        <div style={{ 
          minWidth: '40px', height: '40px', borderRadius: '10px', 
          background: 'rgba(59, 130, 246, 0.1)', display: 'flex', 
          alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' 
        }}>
          <FileText size={18} />
        </div>

        {/* TEXTY */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase' }}>
              {article.category}
            </span>
            <ChevronRight size={14} color="var(--text-dim)" />
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {article.title}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {article.excerpt}
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* TLAČÍTKO POD ČLÁNKY (stejné jako u kalendáře) */}
  <button 
    onClick={() => navigate('/articles')}
    style={{ 
      width: '100%', marginTop: '20px', padding: '14px', borderRadius: '12px',
      background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.1)',
      color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem'
    }}
  >
    Zobrazit všechna know-how
  </button>
</GlassCard>

{/* PRAVÝ PANEL: TERMÍNY S FILTREM A VELKÝM DATEM */}
<GlassCard style={{ padding: '24px', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', flexDirection: 'column' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ background: '#10b981', padding: '8px', borderRadius: '8px' }}>
        <Calendar size={20} color="#fff" />
      </div>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>Hlídač termínů 2026</h3>
    </div>
  </div>

{/* PŘEPÍNAČ TYPU (FILTR) PŘÍMO VE WIDGETU */}
<div style={{ 
  display: 'flex', 
  background: 'rgba(0,0,0,0.3)', 
  borderRadius: '10px', 
  padding: '3px', 
  marginBottom: '20px', 
  border: '1px solid rgba(255,255,255,0.05)' 
}}>
  {[
    { id: 'all', label: 'Vše' },
    { id: 'osvc_pausal', label: 'Paušál' },
    { id: 'osvc_hlavni', label: 'OSVČ' },
    { id: 'sro', label: 'Firmy' }
  ].map(f => (
    <button 
      key={f.id} 
      onClick={() => setUserType(f.id as BusinessType)} // TADY byla chyba, nyní voláme setUserType
      style={{ 
        flex: 1, 
        padding: '6px 0', 
        borderRadius: '7px', 
        border: 'none', 
        background: userType === f.id ? 'rgba(16, 185, 129, 0.2)' : 'transparent', 
        color: userType === f.id ? '#10b981' : '#666', 
        fontSize: '0.75rem', 
        fontWeight: 'bold', 
        cursor: 'pointer', 
        transition: '0.2s'
      }}
    >
      {f.label}
    </button>
  ))}
</div>

  {/* SEZNAM TERMÍNŮ S VELKÝM DATEM */}
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
    {/* TADY DOPORUČUJI: Upravte váš DeadlineWidget, aby přijímal 'limit={4}' 
       nebo zde renderujte přímo mapu z ALL_DEADLINES pro větší kontrolu 
    */}
    <div style={{ background: 'rgba(0,0,0,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
      <DeadlineWidget userType={userType} limit={4} /> 
    </div>
  </div>

  <button 
    onClick={() => onNavigate('kalendar')}
    style={{ 
      width: '100%', marginTop: '20px', padding: '14px', borderRadius: '12px',
      background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)',
      color: '#10b981', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem'
    }}
  >
    Zobrazit kompletní rok 2026
  </button>
</GlassCard>
  </div>
</section>

{/* 5. FAQ SEKCE - JASNÉ ODPOVĚDI PRO KAŽDÉHO */}
<section style={{ maxWidth: '800px', margin: '0 auto 80px', padding: '0 20px' }}>
  <div style={{ textAlign: 'center', marginBottom: '40px' }}>
    <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Časté dotazy</h2>
    <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Vše, co potřebujete vědět pro začátek</p>
  </div>

  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    {/* OTÁZKA 1 */}
    <details className="faq-item" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
      <summary style={{ padding: '20px', fontWeight: 'bold', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: '0.3s' }}>
        K čemu mi tento web vlastně pomůže? 
        <ChevronRight size={18} className="faq-chevron" style={{ color: 'var(--primary)' }} />
      </summary>
      <div style={{ padding: '0 20px 20px', color: 'var(--text-dim)', fontSize: '0.95rem', lineHeight: '1.7' }}>
        Je to váš digitální finanční asistent. Pomůže vám spočítat, kolik si máte říkat za hodinu práce, pohlídá za vás termíny daní v roce 2026, vygeneruje fakturu s QR kódem nebo vám ukáže, jestli je vaše finanční rezerva dostatečně silná. Vše na jednom místě a bez složitých tabulek.
      </div>
    </details>

    {/* OTÁZKA 2 */}
    <details className="faq-item" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
      <summary style={{ padding: '20px', fontWeight: 'bold', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Kolik to stojí a musím se registrovat? 
        <ChevronRight size={18} className="faq-chevron" style={{ color: 'var(--primary)' }} />
      </summary>
      <div style={{ padding: '0 20px 20px', color: 'var(--text-dim)', fontSize: '0.95rem', lineHeight: '1.7' }}>
        Všechny nástroje jsou zdarma a bez registrace. Nechceme po vás e-mail ani heslo. Prostě přijdete, spočítáte si, co potřebujete, a zase odejdete. Web funguje okamžitě a pro každého.
      </div>
    </details>

    {/* OTÁZKA 3 */}
    <details className="faq-item" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
      <summary style={{ padding: '20px', fontWeight: 'bold', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Jsou moje zadaná čísla v bezpečí? 
        <ChevronRight size={18} className="faq-chevron" style={{ color: 'var(--primary)' }} />
      </summary>
      <div style={{ padding: '0 20px 20px', color: 'var(--text-dim)', fontSize: '0.95rem', lineHeight: '1.7' }}>
        Ano, na 100 %. Vaše data se neposílají na žádný server ani do žádné databáze. Vše, co vyplníte, zůstává uloženo pouze ve vašem prohlížeči. Jakmile data smažete nebo vyčistíte paměť prohlížeče, nenávratně zmizí – my k nim nemáme přístup.
      </div>
    </details>
  </div>

  {/* CSS trik pro animaci šipky (můžete přidat do globálního CSS nebo nechat takto) */}
  <style>{`
    .faq-item[open] .faq-chevron {
      transform: rotate(90deg);
    }
    .faq-item summary:hover {
      background: rgba(255,255,255,0.03);
    }
  `}</style>
</section>

{/* 5. REFERENCE & INFO - Živější a modernější vzhled */}
<section style={{ padding: '80px 20px', maxWidth: '1100px', margin: '0 auto' }}>
  <div style={{ textAlign: 'center', marginBottom: '50px' }}>
    <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '10px' }}>Zkušenosti kolegů</h2>
    <div style={{ width: '60px', height: '4px', background: 'var(--primary)', margin: '0 auto', borderRadius: '2px' }} />
  </div>

  <div className="smart-grid">
    {testimonials.map((t, i) => (
      <GlassCard 
        key={i} 
        style={{ 
          padding: '30px', 
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        {/* Horní část: Uvozovky a Hvězdičky */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <Quote size={32} color="var(--primary)" style={{ opacity: 0.2 }} />
          <div style={{ display: 'flex', gap: '2px' }}>
            {[...Array(5)].map((_, i) => (
              <span key={i} style={{ color: '#f59e0b', fontSize: '1rem' }}>★</span>
            ))}
          </div>
        </div>

        {/* Text reference */}
        <p style={{ 
          fontStyle: 'italic', 
          lineHeight: '1.7', 
          fontSize: '1rem', 
          color: '#eee',
          marginBottom: '24px' 
        }}>
          "{t.text}"
        </p>

        {/* Autor: Avatar a info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
          <div style={{ 
            width: '45px', 
            height: '45px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--primary) 0%, #10b981 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            color: '#fff',
            fontSize: '0.9rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}>
            {t.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: '0.95rem', color: '#fff' }}>{t.name}</strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600' }}>{t.role}</span>
          </div>
        </div>
      </GlassCard>
    ))}
  </div>

  {/* Footer sekce s ikonou grafu */}
  <div style={{ 
    textAlign: 'center', 
    marginTop: '80px', 
    padding: '30px',
    borderRadius: '20px',
    background: 'rgba(59, 130, 246, 0.03)',
    border: '1px solid rgba(59, 130, 246, 0.1)'
  }}>
    <Activity size={24} color="var(--primary)" style={{ marginBottom: '12px' }} />
    <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', margin: 0 }}>
      <strong>Bezpečí především:</strong> Vaše finanční výpočty a zadané hodnoty neopouštějí tento prohlížeč.
    </p>
  </div>
</section>

    </div>
  );
};