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
  // Pokud modal není otevřený, nic se nezobrazí
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose} // klik mimo card zavře modal
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
        onClick={(e) => e.stopPropagation()} // zabrání zavření při kliknutí uvnitř
      >
        <h2>Právní upozornění</h2>

        <p>
          Informace a výpočty na webu Rozhodni.cz mají pouze orientační a
          informativní charakter.
        </p>

        <p>
          Výsledky vycházejí ze zjednodušených matematických modelů a
          uživatelských vstupů. Nejedná se o daňové, účetní ani investiční
          poradenství.
        </p>

        <p>
          Daňové zákony se mohou měnit a individuální podmínky mohou výsledky
          ovlivnit.
        </p>

        <p>
          Pro konkrétní rozhodnutí doporučujeme konzultaci s kvalifikovaným
          odborníkem (např. účetním nebo daňovým poradcem).
        </p>

        <p>
          Provozovatel nenese odpovědnost za případné škody vzniklé použitím
          těchto nástrojů.
        </p>

        <div style={{ textAlign: "right", marginTop: "20px" }}>
          <button onClick={onClose}>Zavřít</button>
        </div>
      </GlassCard>
    </div>
  );
};