import React, { useEffect } from "react";
import Quiz from "./quiz/Quiz";

const QuizPage: React.FC = () => {
  // SEO Optimalizace: Dynamický titulek stránky
  useEffect(() => {
    document.title = "Kvíz: Jaký jsi typ podnikatele? | Uspejeme.cz";
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="app-container fade-in" style={{ paddingBottom: '80px' }}>
      {/* HEADER SEKCE - SEO H1 a podtitul */}
      <header style={{ textAlign: 'center', marginBottom: '40px', marginTop: '40px' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)', marginBottom: '15px', color: 'var(--text-main)' }}>
          Kvíz: Jaký jsi typ podnikatele?
        </h1>
        <p style={{ color: 'var(--text-dim)', maxWidth: '650px', margin: '0 auto', fontSize: '1.1rem', lineHeight: '1.6' }}>
          Odhalte své silné stránky i skryté brzdy. Tento kvíz analyzuje vaše návyky 
          a doporučí konkrétní kroky pro zvýšení vaší <strong>efektivity a zisku</strong>.
        </p>
      </header>

      {/* HLAVNÍ KOMPONENTA KVÍZU */}
      <div style={{ maxWidth: '750px', margin: '0 auto', position: 'relative' }}>
        <Quiz />
      </div>

      {/* EDUKATIVNÍ SEKCE POD KVÍZEM (Zlepšuje SEO a UX) */}
      <section style={{ marginTop: '80px' }}>
        <div className="smart-grid">
          <div className="glass-card" style={{ padding: '25px' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '12px', fontSize: '1.2rem' }}>💡 Proč znát svůj styl?</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>
              Každý OSVČ má unikátní přístup k času a penězům. Zatímco <em>Strategický hráč</em> exceluje v plánování, 
              <em> Noční makáč</em> zase v krizovém sprintu. Poznání svého typu je první krok k optimalizaci příjmů.
            </p>
          </div>
          
          <div className="glass-card" style={{ padding: '25px' }}>
            <h3 style={{ color: 'var(--success)', marginBottom: '12px', fontSize: '1.2rem' }}>🚀 Co získáte?</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>
              Nejde jen o nálepku. Získáte 2–3 konkrétní rady, jak pracovat méně a vydělávat více, 
              včetně doporučení na konkrétní kalkulačky z našeho portálu.
            </p>
          </div>
        </div>
      </section>

      {/* DISCLAIMER / FOOTER STRÁNKY */}
      <footer style={{ marginTop: '60px', textAlign: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '30px' }}>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', maxWidth: '500px', margin: '0 auto' }}>
          Tento test je navržen pro <strong>OSVČ a malé podnikatele v ČR</strong>. 
          Výsledky jsou generovány na základě vašich odpovědí a slouží jako podklad pro váš osobní a profesní rozvoj.
        </p>
      </footer>
    </main>
  );
};

export default QuizPage;