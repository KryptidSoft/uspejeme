import './index.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import { 
  Home, FileText, TrendingUp, Zap, Activity, 
  Coins, Target, Briefcase, PiggyBank, ShieldAlert, Circle, Calendar, GraduationCap
} from 'lucide-react';

import { BusinessProvider } from './hooks/useBusinessData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DisclaimerModal } from './components/DisclaimerModal';
import { AppContent } from './components/AppContent';

const TOOLS_REGISTRY = [
  { id: 'dashboard', label: 'Můj panel', icon: Activity, path: '/dashboard' },
  { id: 'finance', label: 'Faktury & platby', icon: FileText, path: '/faktury' },
  { id: 'stability', label: 'Audit stability', icon: ShieldAlert, path: '/audit' },
  { id: 'strategie', label: 'Strategie & růst', icon: Target, path: '/strategie' },
  { id: 'investice', label: 'Investice & ROI', icon: Coins, path: '/investice' },
  { id: 'calendar', label: 'Termíny 2026', icon: Calendar, path: '/calendar' },
  { id: 'articles', label: 'Vzdělávání', icon: GraduationCap, path: '/articles' },
  { id: 'slot9', label: 'Připravujeme...', icon: Circle, disabled: true },
];

export const App = () => {
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

  return (
    <BusinessProvider>
      <Router>
        <div className="app-container">
          {/* --- HEADER --- */}
          <Header onLogoClick={() => window.location.href = '/'} />

          {/* --- NAV MENU --- */}
          <NavMenu />

          {/* --- MAIN CONTENT --- */}
          <main style={{ marginTop: '40px' }}>
            <AppContent />
          </main>

          {/* --- FOOTER & MODAL --- */}
          <Footer onShowDisclaimer={() => setIsDisclaimerOpen(true)} />
          <DisclaimerModal isOpen={isDisclaimerOpen} onClose={() => setIsDisclaimerOpen(false)} />
        </div>
      </Router>
    </BusinessProvider>
  );
};

// --- NAV MENU jako samostatná komponenta ---
const NavMenu = () => {
  const navigate = useNavigate();

  return (
    <nav className="main-nav">
      <button className="nav-item" onClick={() => navigate('/')}>
        <Home size={20} />
      </button>

      <div className="nav-separator" style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '10px 0' }} />

      {TOOLS_REGISTRY.map((tool) => (
        <button
          key={tool.id}
          disabled={tool.disabled}
          className="nav-item"
          style={{
            opacity: tool.disabled ? 0.3 : 1,
            cursor: tool.disabled ? 'default' : 'pointer'
          }}
          onClick={() => !tool.disabled && navigate(tool.path!)}
        >
          <tool.icon size={18} />
          <span>{tool.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default App;