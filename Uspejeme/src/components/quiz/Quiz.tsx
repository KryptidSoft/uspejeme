import React, { useMemo } from "react";
import { quizQuestions, quizResults } from "./quizData";
import { usePersistentState } from "../../hooks/usePersistentState";
import { Link } from "react-router-dom";

// --- Sub-components ---

const RadarChart: React.FC<{ scores: Record<string, number> }> = ({ scores }) => {
  const keys = useMemo(() => Object.keys(scores), [scores]);

  const size = 320;
  const center = size / 2;
  const radius = size * 0.35;
  const angleStep = useMemo(() => (Math.PI * 2) / (keys.length || 1), [keys]);

  const points = useMemo(() => {
    if (keys.length === 0) return "";
    return keys.map((key, i) => {
      const val = Math.min((scores[key] || 0) / 15, 1); 
      const r = radius * (0.2 + val * 0.8);
      const x = center + r * Math.cos(i * angleStep - Math.PI / 2);
      const y = center + r * Math.sin(i * angleStep - Math.PI / 2);
      return `${x},${y}`;
    }).join(" ");
  }, [scores, keys, radius, center, angleStep]);

  // Return musí být až pod useMemo
  if (keys.length === 0) return null;
  
  return (
    <div className="radar-container" aria-hidden="true">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="radar-svg">
        <defs>
          <radialGradient id="radarGrad">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.1" />
          </radialGradient>
        </defs>
        {/* Background Grid */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((m) => (
          <circle key={m} cx={center} cy={center} r={radius * m} fill="none" stroke="var(--glass-border)" strokeWidth="1" strokeDasharray="4 4" />
        ))}
        {/* Axis Lines */}
        {keys.map((_, i) => {
          const x = center + radius * Math.cos(i * angleStep - Math.PI / 2);
          const y = center + radius * Math.sin(i * angleStep - Math.PI / 2);
          return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="var(--glass-border)" />;
        })}
        {/* Data Shape */}
        <polygon points={points} fill="url(#radarGrad)" stroke="var(--primary)" strokeWidth="3" className="radar-polygon" />
        {/* Labels */}
        {keys.map((key, i) => {
          const x = center + (radius + 35) * Math.cos(i * angleStep - Math.PI / 2);
          const y = center + (radius + 25) * Math.sin(i * angleStep - Math.PI / 2);
          return (
            <text key={key} x={x} y={y} className="radar-label" textAnchor="middle">
              {quizResults[key]?.type.split(' ')[0] || key}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

// --- Main Component ---

const Quiz: React.FC = () => {
  const [current, setCurrent] = usePersistentState<number>("quiz_step", 0);
  const [scores, setScores] = usePersistentState<Record<string, number>>("quiz_scores", {});
  const [finished, setFinished] = usePersistentState<boolean>("quiz_finished", false);

  const handleAnswer = (weights: Record<string, number>) => {
    const nextScores = { ...scores };
    Object.entries(weights).forEach(([type, val]) => {
      nextScores[type] = (nextScores[type] || 0) + val;
    });
    
    setScores(nextScores);
    
    if (current + 1 < quizQuestions.length) {
      setCurrent(current + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // UX: Scroll to top on next question
    } else {
      setFinished(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const reset = () => {
    if (window.confirm("Opravdu chcete začít znovu? Váš pokrok bude ztracen.")) {
      setCurrent(0);
      setScores({});
      setFinished(false);
    }
  };

  const getWinnerKey = () => {
    const entries = Object.entries(scores);
    if (entries.length === 0) return "chaotic"; 
    return entries.sort((a, b) => b[1] - a[1])[0][0];
  };

  const handleShare = async (isFeedbackShare = false) => {
    const res = quizResults[getWinnerKey()];
    const text = isFeedbackShare 
      ? `Vyšel mi podnikatelský typ: ${res.type}. Sedí to na mě?` 
      : `Můj podnikatelský typ je: ${res.type}! Zjisti ten svůj:`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: "Podnikatelský Kvíz", text, url: window.location.href });
      } catch (err) {
        console.log("Share failed", err);
      }
    } else {
      navigator.clipboard.writeText(`${text} ${window.location.href}`);
      alert("Odkaz zkopírován do schránky!");
    }
  };

  // 1. Result View
  if (finished) {
    const res = quizResults[getWinnerKey()] || quizResults["chaotic"];
    
    return (
      <div className="quiz-result-card glass-card fade-in">
        <header className="result-header">
          <span className="result-badge">Tvůj hlavní archetyp</span>
          <h2 className="result-title">{res.type}</h2>
        </header>
        
        <RadarChart scores={scores} />

        <p className="result-desc">{res.description}</p>
        
        <section className="action-plan-box" aria-labelledby="plan-title">
          <h4 id="plan-title">🚀 Akční plán pro tento týden:</h4>
          <div className="plan-item"><strong>Dnes:</strong> <span>{res.actionPlan.today}</span></div>
          <div className="plan-item"><strong>Zítra:</strong> <span>{res.actionPlan.tomorrow}</span></div>
          <div className="plan-item"><strong>Tento týden:</strong> <span>{res.actionPlan.week}</span></div>
        </section>

        <footer className="result-footer">
  {/* Hlavní akce vedle sebe */}
  <div className="button-group-row">
    <button className="btn btn-primary btn-share" onClick={() => handleShare(false)}>
      <span>🔗</span> Sdílet výsledek
    </button>
    <button className="btn btn-secondary btn-pdf" onClick={() => window.print()}>
      <span>📄</span> Uložit PDF
    </button>
  </div>
  
  {/* Sekundární feedback - odkaz pro kolegy */}
  <button className="feedback-link-wrapper" onClick={() => handleShare(true)}>
    <p>Pasuje to na tebe? <strong>Zeptej se kolegů, jak tě vidí oni...</strong></p>
  </button>
  
  <div className="divider" />

  {/* CTA sekce */}
  <div className="cta-section">
    <span className="cta-label">Doporučený nástroj pro vás:</span>
    <Link to={res.cta.link} className="btn btn-cta">
      {res.cta.label}
    </Link>
  </div>

  <button className="reset-quiz-btn" onClick={reset}>Restartovat kvíz</button>
</footer>
      </div>
    );
  }

  // 2. Question View
  const progress = (current / quizQuestions.length) * 100;
  const currentQuestion = quizQuestions[current];

  return (
    <div className="quiz-container glass-card fade-in">
      <div className="quiz-header">
        <div className="progress-info" role="status">
          <span>Otázka {current + 1} z {quizQuestions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progress}%` }} 
            aria-valuenow={Math.round(progress)} 
            aria-valuemin={0} 
            aria-valuemax={100}
          />
        </div>
      </div>

      <h3 className="quiz-question">{currentQuestion.question}</h3>
      
      <div className="answers-list">
        {currentQuestion.answers.map((opt, i) => (
          <button 
            key={i} 
            className="answer-option" 
            onClick={() => handleAnswer(opt.weights)}
          >
            <span className="answer-index" aria-hidden="true">{String.fromCharCode(65 + i)}</span>
            <span className="answer-text">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Quiz;