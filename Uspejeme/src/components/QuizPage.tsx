import React, { useEffect, useState } from "react";
import Quiz from "./quiz/Quiz";

const QuizPage: React.FC = () => {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    document.title = "Kvíz: Jaký jsi typ podnikatele? | Uspejeme.cz";
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [started]);

  const startQuiz = () => {
    setStarted(true);
  };

  return (
    <main className="app-container fade-in quiz-scope" style={{ paddingBottom: '80px', minHeight: '100vh' }}>
      <style>{`
        /* IZOLOVANÉ STYLY PRO KVÍZ */
        .quiz-scope .quiz-container { max-width: 700px; margin: 40px auto; position: relative; }
        .quiz-scope .quiz-result-card { max-width: 800px; margin: 40px auto; text-align: center; }
        .quiz-scope .quiz-header { margin-bottom: 30px; }
        
        /* Progress Bar */
        .quiz-scope .progress-info { display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-dim); margin-bottom: 10px; }
        .quiz-scope .progress-bar-bg { height: 6px; background: rgba(255, 255, 255, 0.05); border-radius: 10px; overflow: hidden; }
        .quiz-scope .progress-bar-fill { height: 100%; background: linear-gradient(90deg, var(--primary), var(--accent-orange)); transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1); }

        /* Otázky a Odpovědi */
        .quiz-scope .quiz-question { margin-bottom: 30px; line-height: 1.3; text-align: left; }
        .quiz-scope .answers-list { display: flex; flex-direction: column; gap: 12px; }
        .quiz-scope .answer-option { 
          display: flex; align-items: center; gap: 15px; padding: 16px 20px; 
          background: rgba(255, 255, 255, 0.03); border: 1px solid var(--glass-border); 
          border-radius: 16px; color: var(--text-main); cursor: pointer; text-align: left; 
          transition: all 0.2s ease; font-family: inherit; font-size: 1rem; width: 100%;
        }
        .quiz-scope .answer-option:hover { background: rgba(59, 130, 246, 0.1); border-color: var(--primary); transform: translateX(5px); }
        .quiz-scope .answer-index { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: rgba(255, 255, 255, 0.05); border-radius: 8px; font-weight: bold; color: var(--accent-orange); font-size: 0.9rem; }

        /* Úvodní stránka (Intro) */
        .quiz-scope .quiz-intro { max-width: 600px; margin: 2rem auto; padding: 3rem 1rem; text-align: center; }
        .quiz-scope .intro-badge { display: inline-block; padding: 0.5rem 1rem; background: var(--glass-border); border-radius: 20px; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; margin-bottom: 1.5rem; color: var(--primary); }
        .quiz-scope .intro-title { font-size: 2.5rem; line-height: 1.1; margin-bottom: 1.5rem; font-weight: 900; color: #fff; }
        .quiz-scope .intro-title span { color: var(--primary); background: linear-gradient(120deg, var(--primary), #88d3ce); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .quiz-scope .intro-lead { font-size: 1.1rem; color: var(--text-dim); line-height: 1.6; margin-bottom: 2.5rem; }

        /* Grid funkcí */
        .quiz-scope .features-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; text-align: left; margin-bottom: 3rem; }
        .quiz-scope .feature-item { display: flex; align-items: flex-start; gap: 1rem; }
        .quiz-scope .feature-icon { font-size: 1.5rem; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 12px; }
        .quiz-scope .feature-text h4 { margin: 0; font-size: 1rem; color: #fff; font-weight: 600; }
        .quiz-scope .feature-text p { margin: 0; font-size: 0.9rem; opacity: 0.7; color: var(--text-dim); }

        /* Radar Chart & Výsledky */
        .quiz-scope .radar-container { display: flex; justify-content: center; margin: 20px 0; }
        .quiz-scope .result-badge { display: inline-block; padding: 6px 14px; background: rgba(249, 115, 22, 0.1); color: var(--accent-orange); border-radius: 20px; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; margin-bottom: 10px; }
        .quiz-scope .result-title { color: white; margin-bottom: 20px; font-size: 2rem; font-weight: 800; }
        .quiz-scope .result-desc { color: var(--text-dim); max-width: 600px; margin: 0 auto 30px; font-size: 1.1rem; }
        
        /* Akční plán */
        .quiz-scope .action-plan-box { background: rgba(0, 0, 0, 0.2); border-radius: 20px; padding: 25px; text-align: left; margin-bottom: 30px; border: 1px solid var(--glass-border); }
        .quiz-scope .action-plan-box h4 { margin-bottom: 15px; color: var(--accent-orange); font-weight: 700; }
        .quiz-scope .plan-item { margin-bottom: 10px; display: flex; gap: 10px; }
        .quiz-scope .plan-item strong { color: var(--text-main); min-width: 100px; }

        /* Tlačítka */
        /* Tlačítka a patička výsledků */
.quiz-scope .btn-block { width: 100%; display: flex; justify-content: center; align-items: center; padding: 1.2rem; font-size: 1.2rem; cursor: pointer; border-radius: 16px; font-weight: 700; }

.quiz-scope .result-footer { display: flex; flex-direction: column; gap: 20px; margin-top: 30px; padding-top: 25px; border-top: 1px solid var(--glass-border); }
.quiz-scope .button-group-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.quiz-scope .btn-share, .quiz-scope .btn-pdf { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px; font-size: 0.95rem; border-radius: 12px; cursor: pointer; font-weight: 600; }

.quiz-scope .feedback-link-wrapper { background: rgba(255, 255, 255, 0.03); border: 1px dashed var(--glass-border); padding: 15px; border-radius: 12px; cursor: pointer; transition: all 0.2s ease; color: var(--text-dim); width: 100%; font-family: inherit; }
.quiz-scope .feedback-link-wrapper:hover { background: rgba(59, 130, 246, 0.05); border-color: var(--primary); color: #fff; }
.quiz-scope .feedback-link-wrapper p { margin: 0; font-size: 0.9rem; pointer-events: none; }

.quiz-scope .cta-section { background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%); padding: 25px; border-radius: 20px; text-align: center; border: 1px solid rgba(255,255,255,0.05); }
.quiz-scope .cta-label { display: block; font-size: 0.8rem; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px; color: var(--text-dim); }
.quiz-scope .btn-cta { background: var(--primary); color: white; padding: 14px 28px; border-radius: 12px; font-weight: 800; text-decoration: none; display: inline-block; transition: transform 0.2s ease; }
.quiz-scope .btn-cta:hover { transform: scale(1.03); }

.quiz-scope .reset-quiz-btn { background: transparent; border: none; color: var(--text-dim); text-decoration: underline; cursor: pointer; font-size: 0.85rem; opacity: 0.5; margin-top: 10px; }
.quiz-scope .reset-quiz-btn:hover { opacity: 1; }

        @media (max-width: 600px) {
  .quiz-scope .plan-item { flex-direction: column; gap: 4px; margin-bottom: 15px; }
  .quiz-scope .intro-title { font-size: 2rem; }
  .quiz-scope .feature-item { align-items: center; }
  /* Přidané opravy pro mobilní odpovědi */
  .quiz-scope .answer-option { padding: 12px 15px; font-size: 0.95rem; }
  .quiz-scope .answer-index { min-width: 28px; height: 28px; font-size: 0.8rem; }
  .quiz-scope .button-group-row { grid-template-columns: 1fr; }
  .quiz-scope .cta-section { padding: 20px 15px; }
}
      `}</style>

      {!started ? (
        <section className="quiz-intro fade-in" style={{ marginTop: '60px' }}>
          <div className="intro-badge">Diagnostika OSVČ</div>
          <h1 className="intro-title">Jaký jsi <span>typ podnikatele?</span></h1>
          <p className="intro-lead">
            Většina podnikatelů naráží na stejné bariéry, protože se snaží kopírovat cizí styl práce. 
            Zjistěte, jak funguje váš "vnitřní motor" a jak ho nastavit na maximální výkon.
          </p>

          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-icon">⏱️</span>
              <div className="feature-text">
                <h4>60 sekund času</h4>
                <p>5 rychlých otázek zaměřených na vaši praxi.</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📈</span>
              <div className="feature-text">
                <h4>Personalizovaná analýza</h4>
                <p>Radarový graf vašich dovedností a návyků.</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🛠️</span>
              <div className="feature-text">
                <h4>Akční kroky</h4>
                <p>Doporučení nástrojů přímo pro váš profil.</p>
              </div>
            </div>
          </div>

          <button onClick={startQuiz} className="btn btn-primary btn-block">
            Spustit test zdarma
          </button>
          <p className="intro-note" style={{ marginTop: '1rem', fontSize: '0.8rem', opacity: 0.5, textAlign: 'center' }}>
            Není vyžadována žádná registrace.
          </p>
        </section>
      ) : (
        <div className="fade-in" style={{ marginTop: '40px' }}>
          <header style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.5rem', opacity: 0.8, color: 'var(--text-dim)', fontWeight: '400' }}>Diagnostický test</h2>
          </header>
          
          <section style={{ maxWidth: '800px', margin: '0 auto', padding: '0 15px' }}>
            <div className="quiz-wrapper" style={{
              background: 'var(--glass-bg)',
              borderRadius: '24px',
              border: '1px solid var(--glass-border)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              <Quiz />
            </div>
          </section>
        </div>
      )}

      {/* EDUKATIVNÍ SEKCE */}
      <section style={{ marginTop: '100px' }}>
        <div className="smart-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: '25px',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          <article className="glass-card" style={{ padding: '30px', borderRadius: '20px' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '15px', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>💡</span> Proč znát svůj styl?
            </h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '1rem', lineHeight: '1.6' }}>
              Každý OSVČ má unikátní přístup k času a penězům. Poznání svého typu je první krok k optimalizaci příjmů.
            </p>
          </article>
          
          <article className="glass-card" style={{ padding: '30px', borderRadius: '20px' }}>
            <h3 style={{ color: 'var(--success)', marginBottom: '15px', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>🚀</span> Co získáte?
            </h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '1rem', lineHeight: '1.6' }}>
              Získáte konkrétní rady, jak pracovat méně a vydělávat více, včetně doporučení na naše nástroje.
            </p>
          </article>
        </div>
      </section>

      <footer style={{ marginTop: '80px', textAlign: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '40px' }}>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', opacity: 0.6 }}>
          © {new Date().getFullYear()} Uspejeme.cz
        </p>
      </footer>
    </main>
  );
};

export default QuizPage;