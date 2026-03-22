import React from "react";
import { GlassCard } from "./ui/GlassCard";

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({
  isOpen,
  onClose,
}) => {
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
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <GlassCard
        className="fade-in"
        style={{ maxWidth: "600px", width: "100%", margin: "auto" }}
        onClick={() => {}}
      >
        <h2>Právní upozornění a omezení odpovědnosti</h2>

        <p>
          Tento web poskytuje kalkulačky, nástroje a informace primárně pro
          osoby samostatně výdělečně činné (OSVČ). Výsledky mají pouze
          orientační a informativní charakter.
        </p>

        <p>
          Výpočty jsou založeny na zjednodušených modelech a údajích zadaných
          uživatelem. Skutečné výsledky se mohou lišit v závislosti na individuálních
          podmínkách.
        </p>

        <p>
          Tento obsah není náhradou za odborné daňové, účetní nebo investiční
          poradenství. Pro konkrétní rozhodnutí doporučujeme konzultaci s
          kvalifikovaným odborníkem.
        </p>

        <p>
          Uživatel nese plnou odpovědnost za použití těchto nástrojů. Provozovatel
          nenese odpovědnost za případné škody vzniklé z použití výpočtů nebo
          informací.
        </p>

        <p style={{ fontSize: "0.8rem", opacity: 0.6 }}>
          Daňové a účetní předpisy se mohou měnit. Aktuální legislativní stav
          je vždy rozhodující.
        </p>

        <div style={{ textAlign: "right", marginTop: "20px" }}>
          <button onClick={onClose}>Rozumím a chci pokračovat.</button>
        </div>
      </GlassCard>
    </div>
  );
};