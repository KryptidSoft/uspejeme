import React from "react";
import { GlassCard } from "./ui/GlassCard"; // Opraveno podle stromu
import { HeartPulse, Shield, Settings2, Info, Activity } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
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
        backgroundColor: "rgba(0,0,0,0.7)", // Trochu tmavší pro lepší soustředění
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1100, // Vyšší než zbytek webu
        padding: "20px",
        backdropFilter: "blur(5px)", // Rozmaže pozadí dashboardu
		overflowY: "auto", // 🔹 umožní scrollovat overlay, pokud se nevejde
      }}
    >
      <GlassCard
        className="fade-in"
        style={{ maxWidth: "700px", width: "100%", margin: "auto", padding: '30px', maxHeight: "90vh", overflowY: "auto", }}
        onClick={() => {}}
      >
        <h2 style={{ color: '#fbbf24', marginTop: 0 }}>OSVČ Navigátor – Jak to funguje?</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
          
          <section style={{ display: 'flex', gap: '15px' }}>
            <div style={{ color: '#fbbf24' }}><HeartPulse size={24} /></div>
            <div>
              <h4 style={{ margin: '0 0 5px 0' }}>Health Score</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>
                Váš digitální puls. Sleduje stabilitu, časové vytížení a hodnotu vaší práce. 
                Pokud svítí zelená (nad 80 %), vaše podnikání je v bezpečné a udržitelné zóně.
              </p>
            </div>
          </section>

          <section style={{ display: 'flex', gap: '15px' }}>
            <div style={{ color: '#22c55e' }}><Shield size={24} /></div>
            <div>
              <h4 style={{ margin: '0 0 5px 0' }}>Finanční rezerva (Runway)</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>
                Ukazuje, kolik měsíců přežijete bez jediné faktury při zachování všech standardů 
                a plateb státu. Cílem je mít rezervu alespoň na 3 až 6 měsíců.
              </p>
            </div>
          </section>
		  
          <section style={{ display: 'flex', gap: '15px' }}>
            <div style={{ color: '#fbbf24' }}><Activity size={24} /></div>
            <div>
              <h4 style={{ margin: '0 0 5px 0' }}>Pracovní vytížení</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>
                Poměr mezi nutnými hodinami pro váš cíl a udržitelnou kapacitou. 
                Nad 100 % už jedete na dluh vlastního času a zdraví.
              </p>
            </div>
          </section>

          <section style={{ display: 'flex', gap: '15px' }}>
            <div style={{ color: '#3b82f6' }}><Settings2 size={24} /></div>
            <div>
              <h4 style={{ margin: '0 0 5px 0' }}>Simulátor parametrů</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>
                Dole na stránce můžete v reálném čase měnit své cíle. Zkuste si, co s vaším zdravím 
                udělá zvýšení sazby o 200 Kč nebo snížení pracovních hodin o 10 % měsíčně.
              </p>
            </div>
          </section>

{/* --- oddělovač --- */}
<div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '10px 0' }} />

{/* --- NOVÁ SEKCE: Jak číst čísla --- */}
<div style={{ marginTop: '10px' }}>
  <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#fbbf24' }}>
    Jak číst čísla v tabulkách?
  </h3>

  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
    
    <div>
      <h4 style={{ margin: '0 0 5px 0' }}>Ekonomické cíle</h4>
      <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.8 }}>
        <strong>Celkový příjem (Brutto):</strong> Kolik celkem vyfakturujete za měsíc. Je to číslo před odečtením daní a nákladů. <br />
        <strong>Daňová povinnost:</strong> Kolik z příjmu odevzdáte státu na daních a odvodech. Tarif se mění automaticky. <br />
        <strong>Měsíční náklady:</strong> Kolik vás stojí podnikání a život (nájem, software, služby, pojištění). <br />
        <strong>Čistý měsíční přebytek (Netto):</strong> Váš čistý zisk po zaplacení všeho. Peníze ihned k dispozici.
      </p>
    </div>

    <div>
      <h4 style={{ margin: '0 0 5px 0' }}>Udržitelnost</h4>
      <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.8 }}>
        <strong>Efektivní hodinová sazba:</strong> Kolik reálně vyděláte za hodinu po odečtení všech nákladů a daní. <br />
        <strong>Bod přežití:</strong> Minimální počet hodin, které musíte odpracovat k pokrytí všech nákladů. <br />
        <strong>Riziko hl. klienta:</strong> Kolik procent vašeho měsíčního příjmu pochází od jednoho klienta. Čím více, tím hůře.<br />
        <strong>Bezpečná měs. investice:</strong> Kolik si můžete měsíčně dovolit investovat bez ohrožení své stability.
      </p>
    </div>

  </div>
</div>

{/* --- PŮVODNÍ TIP (přesunutý dolů) --- */}
<div style={{ 
  background: 'rgba(251,191,36,0.1)', 
  padding: '15px', 
  borderRadius: '12px', 
  border: '1px solid rgba(251,191,36,0.2)',
  display: 'flex',
  gap: '10px',
  alignItems: 'center'
}}>
  <Info size={20} color="#fbbf24" />
  <p style={{ margin: 0, fontSize: '0.85rem' }}>
    <strong>Tip:</strong> Celý panel je propojený. Každý pohyb sliderem okamžitě 
    přepočítává vaše daně, čistý zisk i efektivní hodinovou sazbu.
  </p>
</div>
        </div>

        <div style={{ textAlign: "right", marginTop: "30px" }}>
          <button 
            onClick={onClose}
            style={{
              padding: '10px 25px',
              borderRadius: '10px',
              background: '#fbbf24',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Rozumím, jdeme na to
          </button>
        </div>
      </GlassCard>
    </div>
  );
};