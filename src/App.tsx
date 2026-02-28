import './index.css';
import React, { useState } from 'react';
// Přidali jsme Target do seznamu níže
import { Home, FileText, TrendingUp, Clock, PiggyBank, Zap, Activity, Coins, ArrowRight, Target } from 'lucide-react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { GlassCard } from './components/ui/GlassCard';

// Importy kalkulaček - ujistěte se, že názvy souborů sedí
import { ProsperityPlanner } from './components/calculators/ProsperityPlanner';
import { ROICalculator } from './components/calculators/ROICalculator';
import { EnergyCalculator } from './components/calculators/EnergyCalculator';
import { AssetsCalculator } from './components/calculators/AssetsCalculator';
import { StabilityCalculator } from './components/calculators/StabilityCalculator';

// Import modalu Disclaimer
import { DisclaimerModal } from './components/DisclaimerModal';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false); // stav pro modal

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="fade-in">
            <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Dobrý den, kormidelníku.</h1>
            <p style={{ color: 'var(--text-dim)', marginBottom: '40px' }}>Vítejte ve vašem finančním centru Rozhodni.cz.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <GlassCard className="hover-card" onClick={() => setActiveTab('planner')} style={{ cursor: 'pointer', borderLeft: '4px solid var(--primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Target color="var(--primary)" size={32} />
                  <ArrowRight size={20} color="var(--text-dim)" />
                </div>
                <h3>Plánovač prosperity</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>Nastavte si hodinovou sazbu a cíle, které vás udrží v klidu.</p>
              </GlassCard>

              <GlassCard className="hover-card" onClick={() => setActiveTab('stability')} style={{ cursor: 'pointer', borderLeft: '4px solid #22c55e' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Activity color="#22c55e" size={32} />
                  <ArrowRight size={20} color="var(--text-dim)" />
                </div>
                <h3>Stav stability</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>Celkové zdraví vašeho podnikání na základě aktuálních dat.</p>
              </GlassCard>

              <GlassCard className="hover-card" onClick={() => setActiveTab('gold')} style={{ cursor: 'pointer', borderLeft: '4px solid #eab308' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Coins color="#eab308" size={32} />
                  <ArrowRight size={20} color="var(--text-dim)" />
                </div>
                <h3>Kalkulačka aktiv</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>Kolik gramů zlata nebo satoshi právě držíte ve svých korunách?</p>
              </GlassCard>
            </div>
          </div>
        );

      case 'planner': return <ProsperityPlanner />;
      case 'roi': return <ROICalculator />;
      case 'energy': return <EnergyCalculator />;
      case 'gold': return <AssetsCalculator />;
      case 'stability': return <StabilityCalculator />;
      case 'articles': return <GlassCard><h2>Články</h2><p>Vzdělávání pro moderní freelancery.</p></GlassCard>;

      // case 'legal' už není potřeba, modal ho nahrazuje
      default: return null;
    }
  };

  return (
    <div className="app-container">
      <Header onLogoClick={() => setActiveTab('home')} />
      
      <nav className="main-nav">
        <button className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}><Home size={20} /></button>
        <button className={`nav-item ${activeTab === 'planner' ? 'active' : ''}`} onClick={() => setActiveTab('planner')}><Target size={18} /> Plánovač</button>
        <button className={`nav-item ${activeTab === 'stability' ? 'active' : ''}`} onClick={() => setActiveTab('stability')}><Activity size={18} /> Stabilita</button>
        <button className={`nav-item ${activeTab === 'gold' ? 'active' : ''}`} onClick={() => setActiveTab('gold')}><Coins size={18} /> Aktiva</button>
        <div className="nav-separator" />
        <button className={`nav-item ${activeTab === 'roi' ? 'active' : ''}`} onClick={() => setActiveTab('roi')}><TrendingUp size={18} /> ROI</button>
        <button className={`nav-item ${activeTab === 'energy' ? 'active' : ''}`} onClick={() => setActiveTab('energy')}><Zap size={18} /> Energie</button>
      </nav>

      <main style={{ marginTop: '40px' }}>{renderContent()}</main>

      {/* Footer nyní otevírá modal */}
      <Footer onShowDisclaimer={() => setIsDisclaimerOpen(true)} />

      {/* Disclaimer modal */}
      <DisclaimerModal isOpen={isDisclaimerOpen} onClose={() => setIsDisclaimerOpen(false)} />
    </div>
  );
}

export default App;