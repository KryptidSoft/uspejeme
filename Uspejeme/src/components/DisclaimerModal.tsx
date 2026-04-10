import React, { useState, useEffect } from "react";
import { GlassCard } from "./ui/GlassCard";
import { Scale } from 'lucide-react'; // Přidal jsem tematickou ikonku vah spravedlnosti

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  // Přidáme detekci mobilu, aby se to na telefonu chovalo stejně hezky jako GuideModal
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.7)", // Ztmaveno pro lepší čitelnost
        display: "flex",
        alignItems: isMobile ? "flex-start" : "center",
        justifyContent: "center",
        zIndex: 1100, // Sjednoceno s GuideModal
        padding: "20px",
        backdropFilter: "blur(5px)", // ZDE JE TO ROZMAZÁNÍ POZADÍ!
        overflowY: "auto",
      }}
    >
      <GlassCard
        className="fade-in"
        style={{ 
          maxWidth: "600px", 
          width: "100%", 
          margin: isMobile ? "0 auto" : "auto",
          padding: isMobile ? '16px' : '30px',
          maxHeight: isMobile ? "none" : "90vh",
          overflowY: "auto",
        }}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()} // Opraveno proklikávání
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
          <Scale size={28} color="#94a3b8" />
          <h2 style={{ color: '#ffffff', margin: 0 }}>Právní upozornění</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#e2e8f0' }}>
          <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>
            Tento web poskytuje kalkulačky, nástroje a informace primárně pro
            osoby samostatně výdělečně činné (OSVČ). Výsledky mají pouze
            <strong> orientační a informativní charakter</strong>.
          </p>

          <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>
            Výpočty jsou založeny na zjednodušených modelech a údajích zadaných
            uživatelem. Skutečné výsledky se mohou lišit v závislosti na individuálních
            podmínkách.
          </p>

          <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>
            Tento obsah není náhradou za odborné daňové, účetní nebo investiční
            poradenství. Pro konkrétní rozhodnutí doporučujeme konzultaci s
            kvalifikovaným odborníkem.
          </p>

          <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>
            Uživatel nese plnou odpovědnost za použití těchto nástrojů. Provozovatel
            nenese odpovědnost za případné škody vzniklé z použití výpočtů nebo
            informací.
          </p>

          <p style={{ fontSize: "0.8rem", opacity: 0.6, marginTop: '5px' }}>
            Daňové a účetní předpisy se mohou měnit. Aktuální legislativní stav
            je vždy rozhodující.
          </p>
        </div>

        <div style={{ textAlign: "right", marginTop: "30px" }}>
          <button 
            onClick={onClose}
            style={{
              padding: '12px 25px',
              borderRadius: '10px',
              background: '#475569', // Seriózní břidlicová barva tlačítka
              color: '#ffffff',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: isMobile ? '100%' : 'auto',
              fontSize: isMobile ? '1rem' : '0.9rem',
              transition: 'background 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#334155')}
            onMouseOut={(e) => (e.currentTarget.style.background = '#475569')}
          >
            Rozumím a chci pokračovat
          </button>
        </div>
      </GlassCard>
    </div>
  );
};