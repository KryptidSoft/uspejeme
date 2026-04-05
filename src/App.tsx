import './index.css';
import { useState } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { 
  Activity, FileText, Target, Coins, ShieldAlert, GraduationCap, type LucideIcon 
} from 'lucide-react';

import { BusinessProvider } from './hooks/useBusinessData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DisclaimerModal } from './components/DisclaimerModal';
import { AppContent } from './components/AppContent';

interface ToolItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
}

const TOOLS_REGISTRY: ToolItem[] = [
  { id: 'dashboard', label: 'Můj panel', icon: Activity, path: '/panel' },
  { id: 'finance', label: 'Faktury & platby', icon: FileText, path: '/nastroje' },
  { id: 'stability', label: 'Audit stability', icon: ShieldAlert, path: '/audit' },
  { id: 'strategie', label: 'Strategie & růst', icon: Target, path: '/strategie' },
  { id: 'investice', label: 'Investice & ROI', icon: Coins, path: '/investice' },
  { id: 'vzdelavani', label: 'Vzdělávání', icon: GraduationCap, path: '#' }, 
];

const SUB_ITEMS: Record<string, { label: string, path: string }[]> = {
  finance: [
    { label: 'Faktura', path: '/faktura' },
    { label: 'QR Platba', path: '/qr' },
    { label: 'Splatnost', path: '/upominky' },
  ],
  stability: [
    { label: 'Index stability', path: '/stabilita' },
    { label: 'Rezerva', path: '/rezerva' },
    { label: 'Rizika', path: '/rizika' },
    { label: 'Energie', path: '/energie' },
  ],
  strategie: [
    { label: 'Plánovač', path: '/planovac' },
    { label: 'Hodinovka', path: 'hodinovka' },
    { label: 'Zakázky', path: '/projekt' },
  ],
  investice: [
    { label: 'Návratnost', path: '/roi' },
    { label: 'Inflace', path: '/inflace' },
    { label: 'Aktiva', path: '/aktiva' },
    { label: 'Nákupy', path: '/nakupy' },
  ],
  vzdelavani: [
    { label: 'Články', path: '/clanky' },
    { label: 'Termíny 2026', path: '/kalendar' },
    { label: 'Poznej se', path: '/kviz' },
  ]
};

// Vnitřní komponenta, která už má přístup k Routeru
const AppInner = () => {
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="app-container">
      <Header 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        tools={TOOLS_REGISTRY}
        subItems={SUB_ITEMS}
      />

      <main className="main-content" key={location.pathname}>
        <AppContent />
      </main>

      <Footer onShowDisclaimer={() => setIsDisclaimerOpen(true)} />
      <DisclaimerModal isOpen={isDisclaimerOpen} onClose={() => setIsDisclaimerOpen(false)} />
    </div>
  );
};

// Hlavní export
export const App = () => {
  return (
    <BusinessProvider>
      <Router>
        <AppInner />
      </Router>
    </BusinessProvider>
  );
};

export default App;