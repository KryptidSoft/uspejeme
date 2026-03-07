import './index.css';
import React, { useState } from 'react';
import { 
  Home, FileText, TrendingUp, Zap, Activity, 
  Coins, Target, Briefcase, PiggyBank, ShieldAlert, Clock, Calendar,
  QrCode, FileWarning, Circle 
} from 'lucide-react';

import { BusinessProvider } from './hooks/useBusinessData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DisclaimerModal } from './components/DisclaimerModal';
import { LandingPage } from './components/LandingPage';
import { ArticleSection } from './components/ArticleSection';
import { CalendarPage } from './components/CalendarPage';

import { ProsperityPlanner } from './components/calculators/ProsperityPlanner';
import { ROICalculator } from './components/calculators/ROICalculator';
import { EnergyCalculator } from './components/calculators/EnergyCalculator';
import { AssetsCalculator } from './components/calculators/AssetsCalculator';
import { StabilityCalculator } from './components/calculators/StabilityCalculator';
import { ProjectProfitCalculator } from './components/calculators/ProjectProfitCalculator';
import { ReservesCalculator } from './components/calculators/ReservesCalculator';
import { RiskAssessment } from './components/calculators/RiskAssessment';
import { HourlyRateCalculator } from './components/calculators/HourlyRateCalculator';
import { QRGenerator } from './components/generators/QRGenerator';
import { DuesGenerator } from './components/generators/DuesGenerator';
import { EliteInvoice } from './components/generators/EliteInvoice';

// Pomocná komponenta pro karty v rozcestníku (pokud ji nemáš v samostatném souboru)
const MiniCard = ({ title, desc, icon: Icon, onClick }: any) => (
  <div onClick={onClick} className="nav-card" style={{
    padding: '20px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    cursor: 'pointer',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.2s'
  }}>
    <Icon size={24} style={{ marginBottom: '10px', color: '#60a5fa' }} />
    <h3 style={{ fontSize: '1rem', marginBottom: '5px' }}>{title}</h3>
    <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{desc}</p>
  </div>
);

// --- CENTRÁLNÍ REGISTR NÁSTROJŮ ---
const TOOLS_REGISTRY = [
  { id: 'planner', label: 'Plánovač prosperity', icon: Target },
  { id: 'faktury', label: 'Faktury & Platby', icon: FileText, subIds: ['qr', 'dues', 'invoice'] },
  { id: 'stability', label: 'Audit stability', icon: Activity, subIds: ['reserves', 'rizika', 'stability_calc'] },
  { id: 'roi', label: 'Investice & ROI', icon: TrendingUp, subIds: ['gold', 'projects', 'roi_calc'] },
  { id: 'energy', label: 'Hlídač energií', icon: Zap },
  { id: 'calendar', label: 'Kalendář 2026', icon: Calendar },
  { id: 'articles', label: 'Strategie & Články', icon: FileText },
  { id: 'slot8', label: 'Připravujeme...', icon: Circle, disabled: true },
  { id: 'slot9', label: 'Připravujeme...', icon: Circle, disabled: true },
];

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const handleNavigate = (view: string, articleId?: string) => {
    const routes: Record<string, string> = {
      prosperita: 'planner',
      rezerva: 'reserves',
      rizika: 'rizika',
      hodinovka: 'hourly',
      clanky: 'articles',
      kalendar: 'calendar',
      faktury: 'faktury'
    };
    
    const targetTab = routes[view] || view;
    setActiveTab(targetTab);
    setSelectedArticleId(articleId || null);
  };

  const renderContent = () => {
    const tabs: Record<string, React.ReactNode> = {
      home: <LandingPage onNavigate={handleNavigate} />,
      planner: <ProsperityPlanner />,
      
      // ROZCESTNÍK FAKTURY
      faktury: (
        <div className="fade-in" style={{ padding: '20px' }}>
          <h2 style={{ marginBottom: '20px' }}>Faktury & Platby</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <MiniCard title="Faktura" desc="Vytvořit novou" icon={FileText} onClick={() => setActiveTab('invoice')} />
            <MiniCard title="QR Platba" desc="Generátor kódu" icon={QrCode} onClick={() => setActiveTab('qr')} />
            <MiniCard title="Splatnost" desc="Hlídač termínů" icon={FileWarning} onClick={() => setActiveTab('dues')} />
          </div>
        </div>
      ),

      // ROZCESTNÍK STABILITA
      stability: (
        <div className="fade-in" style={{ padding: '20px' }}>
          <h2 style={{ marginBottom: '20px' }}>Audit stability</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <MiniCard title="Index stability" desc="Celková diagnostika" icon={Activity} onClick={() => setActiveTab('stability_calc')} />
            <MiniCard title="Rezerva" desc="Finanční polštář" icon={PiggyBank} onClick={() => setActiveTab('reserves')} />
            <MiniCard title="Rizika" desc="Analýza hrozeb" icon={ShieldAlert} onClick={() => setActiveTab('rizika')} />
          </div>
        </div>
      ),

      // ROZCESTNÍK ROI
      roi: (
        <div className="fade-in" style={{ padding: '20px' }}>
          <h2 style={{ marginBottom: '20px' }}>Investice & ROI</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <MiniCard title="Návratnost" desc="Kalkulačka ROI" icon={TrendingUp} onClick={() => setActiveTab('roi_calc')} />
            <MiniCard title="Aktiva" desc="Zlato a drahé kovy" icon={Coins} onClick={() => setActiveTab('gold')} />
            <MiniCard title="Zakázky" desc="Ziskovost projektů" icon={Briefcase} onClick={() => setActiveTab('projects')} />
          </div>
        </div>
      ),

      energy: <EnergyCalculator />,
      calendar: <CalendarPage userType="vse" onBack={() => setActiveTab('home')} />,
      articles: <ArticleSection initialArticleId={selectedArticleId} />,
      hourly: <HourlyRateCalculator />,
      invoice: <EliteInvoice />,
      qr: <QRGenerator />,
      dues: <DuesGenerator />,
      reserves: <ReservesCalculator />,
      rizika: <RiskAssessment />,
      gold: <AssetsCalculator />,
      projects: <ProjectProfitCalculator />,
      stability_calc: <StabilityCalculator />,
      roi_calc: <ROICalculator />,
    };

    return tabs[activeTab] || null;
  };

  const NavButton = ({ id, icon: Icon, label }: { id: string, icon: any, label?: string }) => (
    <button 
      className={`nav-item ${activeTab === id ? 'active' : ''}`} 
      onClick={() => {
        setActiveTab(id);
        setSelectedArticleId(null);
      }}
    >
      <Icon size={id === 'home' ? 20 : 18} />
      {label && <span>{label}</span>}
    </button>
  );

  return (
    <BusinessProvider>
      <div className="app-container">
        <Header onLogoClick={() => {
          setActiveTab('home');
          setSelectedArticleId(null);
        }} />

        <nav className="main-nav">
          <NavButton id="home" icon={Home} />
          <div className="nav-separator" style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '10px 0' }} />
          
          {/* AUTOMATICKÉ GENEROVÁNÍ MENU Z REGISTRU */}
          {TOOLS_REGISTRY.map((tool) => (
            <button 
              key={tool.id}
              disabled={tool.disabled}
              className={`nav-item ${activeTab === tool.id || tool.subIds?.includes(activeTab) ? 'active' : ''}`}
              onClick={() => {
                if (!tool.disabled) {
                  setActiveTab(tool.id);
                  setSelectedArticleId(null);
                }
              }}
              style={{ 
                opacity: tool.disabled ? 0.3 : 1, 
                cursor: tool.disabled ? 'default' : 'pointer' 
              }}
            >
              <tool.icon size={18} />
              <span>{tool.label}</span>
            </button>
          ))}
        </nav>

        <main style={{ marginTop: '40px' }}>
          {renderContent()}
        </main>

        <Footer onShowDisclaimer={() => setIsDisclaimerOpen(true)} />
        <DisclaimerModal isOpen={isDisclaimerOpen} onClose={() => setIsDisclaimerOpen(false)} />
      </div>
    </BusinessProvider>
  );
}

export default App;