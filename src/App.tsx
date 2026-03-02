import './index.css';
import React, { useState } from 'react';
import { 
  Home, FileText, TrendingUp, Zap, Activity, 
  Coins, Target, Briefcase, PiggyBank, ShieldAlert 
} from 'lucide-react';

import { Header } from './components/Header';
import { Footer } from './components/Footer';

// Kalkulačky
import { ProsperityPlanner } from './components/calculators/ProsperityPlanner';
import { ROICalculator } from './components/calculators/ROICalculator';
import { EnergyCalculator } from './components/calculators/EnergyCalculator';
import { AssetsCalculator } from './components/calculators/AssetsCalculator';
import { StabilityCalculator } from './components/calculators/StabilityCalculator';
import { ProjectProfitCalculator } from './components/calculators/ProjectProfitCalculator';
import { ReservesCalculator } from './components/calculators/ReservesCalculator';
import { RiskAssessment } from './components/calculators/RiskAssessment'; // NOVÉ

// Landing Page (Tvůj nový rozcestník)
import { LandingPage } from './components/LandingPage'; // NOVÉ

// Modal
import { DisclaimerModal } from './components/DisclaimerModal';

// Nová komponenta pro články
import { ArticleSection } from './components/ArticleSection';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

  // Funkce pro renderování obsahu
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        // Místo původních karet vracíme nápaditou LandingPage
        return <LandingPage onNavigate={(view) => {
          // Mapování názvů z LandingPage na tvé tab-ID
          if (view === 'prosperita') setActiveTab('planner');
          else if (view === 'rezerva') setActiveTab('reserves');
          else if (view === 'rizika') setActiveTab('rizika');
          else setActiveTab(view);
        }} />;

      case 'planner': return <ProsperityPlanner />;
      case 'reserves': return <ReservesCalculator />;
      case 'roi': return <ROICalculator />;
      case 'energy': return <EnergyCalculator />;
      case 'gold': return <AssetsCalculator />;
      case 'stability': return <StabilityCalculator />;
      case 'projects': return <ProjectProfitCalculator />;
      case 'articles': return <ArticleSection />;
      case 'rizika': return <RiskAssessment />; // NOVÉ

      default: return null;
    }
  };

  return (
    <div className="app-container">
      <Header onLogoClick={() => setActiveTab('home')} />

      <nav className="main-nav">
        <button className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
          <Home size={20} />
        </button>
        <button className={`nav-item ${activeTab === 'planner' ? 'active' : ''}`} onClick={() => setActiveTab('planner')}>
          <Target size={18} /> Plánovač
        </button>
        <button className={`nav-item ${activeTab === 'reserves' ? 'active' : ''}`} onClick={() => setActiveTab('reserves')}>
          <PiggyBank size={18} /> Rezerva
        </button>
        <button className={`nav-item ${activeTab === 'stability' ? 'active' : ''}`} onClick={() => setActiveTab('stability')}>
          <Activity size={18} /> Stabilita
        </button>
        <button className={`nav-item ${activeTab === 'rizika' ? 'active' : ''}`} onClick={() => setActiveTab('rizika')}>
          <ShieldAlert size={18} /> Rizika
        </button>
        <button className={`nav-item ${activeTab === 'gold' ? 'active' : ''}`} onClick={() => setActiveTab('gold')}>
          <Coins size={18} /> Aktiva
        </button>
        
        <div className="nav-separator" />
        
        <button className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>
          <Briefcase size={18} /> Zakázky
        </button>
        <button className={`nav-item ${activeTab === 'roi' ? 'active' : ''}`} onClick={() => setActiveTab('roi')}>
          <TrendingUp size={18} /> ROI
        </button>
        <button className={`nav-item ${activeTab === 'energy' ? 'active' : ''}`} onClick={() => setActiveTab('energy')}>
          <Zap size={18} /> Energie
        </button>
        <button className={`nav-item ${activeTab === 'articles' ? 'active' : ''}`} onClick={() => setActiveTab('articles')}>
          <FileText size={18} /> Články
        </button>
      </nav>

      <main style={{ marginTop: '40px' }}>
        {renderContent()}
      </main>

      <Footer onShowDisclaimer={() => setIsDisclaimerOpen(true)} />

      <DisclaimerModal isOpen={isDisclaimerOpen} onClose={() => setIsDisclaimerOpen(false)} />
    </div>
  );
}

export default App;