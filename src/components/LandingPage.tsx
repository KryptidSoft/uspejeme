import React from 'react';
import { Target, ShieldAlert, PiggyBank, ArrowRight, Zap, LineChart, HelpCircle, Quote, Lightbulb } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';

interface LandingPageProps {
  onNavigate: (view: string) => void;
}

// Exportujeme i testimonials, pokud byste je chtěli použít jinde
export const testimonials = [
  {
    name: "Petr Šedý",
    role: "Full-stack Developer",
    text: "Díky kalkulačce hodinové sazby jsem zjistil, že jsem roky pracoval pod cenou. Tohle by měl mít každý freelancer v záložkách."
  },
  {
    name: "Jana Nováková",
    role: "Copywriterka",
    text: "Konečně nástroj, který počítá s inflací a diskontem. NPV mi pomohlo rozhodnout se, jestli investovat do nového vybavení."
  }
];

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="fade-in">
      {/* HERO SEKCE */}
      <section style={{ textAlign: 'center', padding: '60px 20px 40px' }}>
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '8px', 
          background: 'rgba(59, 130, 246, 0.1)', 
          padding: '8px 16px', 
          borderRadius: '20px', 
          color: 'var(--primary)',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          marginBottom: '20px',
          border: '1px solid rgba(59, 130, 246, 0.2)'
        }}>
          <Zap size={14} /> VAŠE DATA, VAŠE SVOBODA
        </div>
        
        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '20px', lineHeight: '1.2' }}>
          Podnikejte s klidnou hlavou. <br />
          <span style={{ color: 'var(--primary)' }}>Zbytek spočítáme my.</span>
        </h1>
        
        <p style={{ fontSize: '1.1rem', color: 'var(--text-dim)', maxWidth: '650px', margin: '0 auto 40px', lineHeight: '1.6' }}>
          Rozhodni.cz není jen soubor kalkulaček. Je to váš osobní kompas ve světě financí na volné noze. 
          Zjistěte, kolik si říct za práci a jak se nenechat zaskočit výpadky.
        </p>
      </section>

      {/* HLAVNÍ ROZCESTNÍK - Tři pilíře */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '25px', 
        padding: '20px' 
      }}>
        
        <GlassCard 
          className="hover-card" 
          style={{ cursor: 'pointer', padding: '35px', transition: 'transform 0.3s ease' }}
          onClick={() => onNavigate('prosperita')}
        >
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <Target size={30} color="var(--primary)" />
          </div>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Plánovač prosperity</h3>
          <p style={{ color: 'var(--text-dim)', marginBottom: '25px', fontSize: '0.9rem', lineHeight: '1.5' }}>
            Máte správně nastavenou hodinovku? Spočítáme sazbu, která pokryje vaše náklady, daně i sny.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.9rem' }}>
            Chci vydělávat víc <ArrowRight size={16} />
          </div>
        </GlassCard>

        <GlassCard 
          className="hover-card" 
          style={{ cursor: 'pointer', padding: '35px', transition: 'transform 0.3s ease' }}
          onClick={() => onNavigate('rezerva')}
        >
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <PiggyBank size={30} color="#10b981" />
          </div>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Finanční polštář</h3>
          <p style={{ color: 'var(--text-dim)', marginBottom: '25px', fontSize: '0.9rem', lineHeight: '1.5' }}>
            Jak dlouho přežijete bez jediného příjmu? Zjistěte, jak velkou rezervu potřebujete pro klidný spánek.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 'bold', fontSize: '0.9rem' }}>
            Chci mít klid <ArrowRight size={16} />
          </div>
        </GlassCard>

        <GlassCard 
          className="hover-card" 
          style={{ cursor: 'pointer', padding: '35px', transition: 'transform 0.3s ease' }}
          onClick={() => onNavigate('rizika')}
        >
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <ShieldAlert size={30} color="#ef4444" />
          </div>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Analýza rizik</h3>
          <p style={{ color: 'var(--text-dim)', marginBottom: '25px', fontSize: '0.9rem', lineHeight: '1.5' }}>
            Kde jsou slabá místa vašeho podnikání? Prověřte svou závislost na klientech a stabilitu procesů.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontWeight: 'bold', fontSize: '0.9rem' }}>
            Prověřit stabilitu <ArrowRight size={16} />
          </div>
        </GlassCard>
      </div>

      {/* FAQ SEKCE - Vysvětlení projektu */}
      <section style={{ padding: '80px 20px 40px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Často se ptáte</h2>
          <p style={{ color: 'var(--text-dim)' }}>Vše, co potřebujete vědět o Rozhodni.cz</p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <GlassCard style={{ padding: '20px' }}>
            <h4 style={{ marginBottom: '8px', color: 'var(--primary)' }}>K čemu tato platforma slouží?</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.5' }}>
              Pomáháme OSVČ dělat konkrétní finanční rozhodnutí. Nejsme blog, jsme nástroj pro strategii ve světě, kde technologie a AI mění pravidla hry.
            </p>
          </GlassCard>

          <GlassCard style={{ padding: '20px' }}>
            <h4 style={{ marginBottom: '8px', color: 'var(--primary)' }}>Jsou moje data v bezpečí?</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.5' }}>
              Ano. Aplikace funguje plně offline a veškeré výpočty probíhají výhradně ve vašem prohlížeči. Nikam nic neposíláme, nikoho nesledujeme.
            </p>
          </GlassCard>

          <GlassCard style={{ padding: '20px' }}>
            <h4 style={{ marginBottom: '8px', color: 'var(--primary)' }}>Proč řešit rezervu a hodinovou sazbu?</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.5' }}>
              OSVČ často podhodnocují svou práci. Nízká cena je strategie přežití, ne růstu. Rezerva musí být součástí vaší sazby, ne volitelný bonus.
            </p>
          </GlassCard>

          <GlassCard style={{ padding: '20px' }}>
            <h4 style={{ marginBottom: '8px', color: 'var(--primary)' }}>Jak platformu nejlépe využít?</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.5' }}>
              Projděte si všechny tři hlavní kalkulačky. Zjistíte svou ideální sazbu, velikost bezpečného polštáře a slabá místa ve své stabilitě.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* REFERENCE */}
      <section style={{ padding: '40px 20px 60px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '1.8rem' }}>Zkušenosti kolegů</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {testimonials.map((t, i) => (
            <GlassCard key={i} style={{ padding: '25px' }}>
              <Quote size={24} color="var(--primary)" style={{ marginBottom: '15px', opacity: 0.5 }} />
              <p style={{ fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.6' }}>"{t.text}"</p>
              <div>
                <strong style={{ display: 'block' }}>{t.name}</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{t.role}</span>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* FOOTER POZNÁMKA */}
      <div style={{ textAlign: 'center', marginTop: '60px', opacity: 0.5, fontSize: '0.8rem', paddingBottom: '40px' }}>
        <LineChart size={20} style={{ marginBottom: '10px' }} />
        <p>Všechna data zůstávají ve vašem prohlížeči. Rozhodni.cz nikoho nesleduje.</p>
      </div>
    </div>
  );
};