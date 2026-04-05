import React, { useState } from 'react';
import { Zap, Quote, Activity, ChevronRight } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { StrategyWidget } from './StrategyWidget';
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

const testimonials = [
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
{/* 2. STATISTIKY - OPRAVENO */}
<section style={{ marginBottom: '60px' }}>
  <div className="smart-grid">
    {MAIN_STATS.map((stat, i) => (
      <GlassCard key={i} style={{ padding: '24px 16px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: stat.color }} />
        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>{stat.label}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: '900', color: '#fff', lineHeight: 1 }}>{stat.value}</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: stat.change >= 0 ? '#10b981' : '#ef4444', whiteSpace: 'nowrap' }}>
            {stat.change >= 0 ? '↑' : '↓'} {Math.abs(stat.change).toFixed(1)} %
          </div>
        </div>
        <div style={{ fontSize: '0.8rem', color: stat.color, fontWeight: '600' }}>{stat.sub}</div>
      </GlassCard>
    ))}
  </div>
</section>

{/* 3. ROZCESTNÍK / PROFIL */}
{/* 3. ROZCESTNÍK / PROFIL - OPRAVENO */}
<section style={{ marginBottom: '80px' }}>
  <GlassCard style={{ 
    padding: 'clamp(12px, 5vw, 40px)', 
    background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(16,185,129,0.05) 100%)',
    display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '24px'
  }}>
    <div style={{ flex: '1 1 320px', minWidth: '0' }}>
      {globalData.hourlyRate > 0 ? (
        <>
          <h2 style={{ marginBottom: '12px' }}>Váš finanční panel je připraven</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>
            Aktuálně pracujete se sazbou <strong>{formatCZK(globalData.hourlyRate)}/h</strong>. 
            Podívejte se na celkový přehled vašeho podnikání a stabilitu v reálném čase.
          </p>
        </>
      ) : (
        <>
          <h2 style={{ marginBottom: '12px' }}>Váš finanční přehled 2026</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>
            Zatím nemáte vyplněna žádná data. Začněte Plánovačem prosperity, abychom mohli 
            vypočítat vaši ideální hodinovou sazbu a stabilitu podnikání.
          </p>
        </>
      )}
    </div>
    <button 
      className="btn"
      onClick={() => onNavigate(globalData.hourlyRate > 0 ? 'dashboard' : 'prosperita')}
      style={{ width: 'auto', minWidth: '200px' }}
    >
      {globalData.hourlyRate > 0 ? 'Zobrazit panel' : 'Nastavit profil'} <ChevronRight size={18} />
    </button>
  </GlassCard>
</section>

{/* 4. ČLÁNKY A TERMÍNY - KOMPAKTNÍ DASHBOARD VZHLED */}
<section style={{ marginBottom: '60px' }}>
  <div className="info-grid">
    
    {/* LEVÝ PANEL: NEJNOVĚJŠÍ STRATEGIE */}
    <StrategyWidget 
      articles={articles} 
      onNavigate={(id) => navigate(`/clanky/${id}`)}
      onViewAll={() => navigate('/clanky')}
    />

    {/* PRAVÝ PANEL: TERMÍNY S FILTREM */}
    <DeadlineWidget 
      userType={userType} 
      setUserType={setUserType}
      onNavigate={() => onNavigate('kalendar')}
    />

  </div>
</section>

{/* 5. FAQ SEKCE - PŘIZPŮSOBENO PODLE INDEX.CSS */}
<section style={{ maxWidth: '800px', margin: '0 auto 80px' }}>
  <div style={{ textAlign: 'center', marginBottom: '40px' }}>
    <h2 style={{ fontWeight: '800' }}>Časté dotazy</h2>
	<div style={{ width: '60px', height: '4px', background: 'var(--primary)', margin: '15px auto 15px', borderRadius: '2px' }} />
    <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Vše, co potřebujete vědět pro začátek</p>
  </div>

  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    {[
      { 
        q: "K čemu mi tento web vlastně pomůže?", 
        a: "Je to váš digitální finanční asistent. Pomůže vám spočítat, kolik si máte říkat za hodinu práce, pohlídá za vás termíny daní v roce 2026, vygeneruje fakturu s QR kódem nebo vám ukáže, jestli je vaše finanční rezerva dostatečně silná. Vše na jednom místě a bez složitých tabulek." 
      },
      { 
        q: "Kolik to stojí a musím se registrovat?", 
        a: "Všechny nástroje jsou zdarma a bez registrace. Nechceme po vás e-mail ani heslo. Prostě přijdete, spočítáte si, co potřebujete, a zase odejdete. Web funguje okamžitě a pro každého." 
      },
      { 
        q: "Jsou moje zadaná čísla v bezpečí?", 
        a: "Ano, na 100 %. Vaše data se neposílají na žádný server ani do žádné databáze. Vše, co vyplníte, zůstává uloženo pouze ve vašem prohlížeči. Jakmile data smažete nebo vyčistíte paměť prohlížeče, nenávratně zmizí – my k nim nemáme přístup." 
      }
    ].map((item, idx) => (
      <details key={idx} className="faq-item" style={{ 
        background: 'rgba(255,255,255,0.02)', 
        borderRadius: '16px', 
        border: '1px solid var(--glass-border)', 
        overflow: 'hidden' 
      }}>
        <summary style={{ padding: '20px', fontWeight: 'bold', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: '0.3s' }}>
          {item.q}
          <ChevronRight size={18} className="faq-chevron" style={{ color: 'var(--primary)', transition: '0.3s' }} />
        </summary>
        <div style={{ padding: '20px 20px 20px', color: 'var(--text-dim)', fontSize: '0.95rem', lineHeight: '1.7' }}>
  {item.a}
</div>
      </details>
    ))}
  </div>

  <style>{`
    .faq-item[open] .faq-chevron { transform: rotate(90deg); }
    .faq-item summary:hover { background: rgba(255,255,255,0.03); }
  `}</style>
</section>

{/* 5. REFERENCE & INFO - PŘIZPŮSOBENO PODLE INDEX.CSS */}
<section style={{ margin: '0 auto 40px' }}>
  <div style={{ textAlign: 'center', marginBottom: '50px' }}>
    <h2 style={{ fontWeight: '800', marginBottom: '10px' }}>Zkušenosti kolegů</h2>
    <div style={{ width: '60px', height: '4px', background: 'var(--primary)', margin: '0 auto', borderRadius: '2px' }} />
  </div>

  <div className="smart-grid">
    {testimonials.map((t, i) => (
      <GlassCard 
        key={i} 
        style={{ 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <Quote size={32} color="var(--primary)" style={{ opacity: 0.2 }} />
          <div style={{ display: 'flex', gap: '2px' }}>
            {[...Array(5)].map((_, i) => (
              <span key={i} style={{ color: 'var(--warning)', fontSize: '1rem' }}>★</span>
            ))}
          </div>
        </div>

        <p style={{ 
          fontStyle: 'italic', 
          lineHeight: '1.7', 
          fontSize: '0.95rem', 
          color: 'var(--text-main)',
          marginBottom: '24px' 
        }}>
          "{t.text}"
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
          <div style={{ 
            width: '45px', height: '45px', borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--success) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold', color: '#fff', fontSize: '0.9rem'
          }}>
            {t.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-main)' }}>{t.name}</strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600' }}>{t.role}</span>
          </div>
        </div>
      </GlassCard>
    ))}
  </div>

  {/* Bezpečnostní info box - upraveny barvy podle index.css */}
  <div style={{ 
    textAlign: 'center', 
    marginTop: '80px', 
    padding: '30px',
    borderRadius: '24px',
    background: 'rgba(59, 130, 246, 0.03)',
    border: '1px solid var(--glass-border)'
  }}>
    <Activity size={24} color="var(--primary)" style={{ marginBottom: '12px' }} />
    <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', margin: 0 }}>
      <strong style={{ color: 'var(--text-main)' }}>Bezpečí především:</strong> Vaše finanční výpočty a zadané hodnoty neopouštějí tento prohlížeč.
    </p>
  </div>
</section>

    </div>
  );
};