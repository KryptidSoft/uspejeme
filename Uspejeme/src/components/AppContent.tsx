import { Routes, Route, useNavigate } from 'react-router-dom';
import { LandingPage } from './LandingPage';
import { Dashboard } from './Dashboard'; // Předpokládám, že Dashboard.tsx je ve stejné složce, jinak upravte cestu
import { ArticleSection } from './ArticleSection';
import { CalendarPage } from './CalendarPage';
import { ProsperityPlanner } from './calculators/ProsperityPlanner';
import { ROICalculator } from './calculators/ROICalculator';
import { EnergyCalculator } from './calculators/EnergyCalculator';
import { AssetsCalculator } from './calculators/AssetsCalculator';
import { StabilityCalculator } from './calculators/StabilityCalculator';
import { ProjectProfitCalculator } from './calculators/ProjectProfitCalculator';
import { ReservesCalculator } from './calculators/ReservesCalculator';
import { RiskAssessment } from './calculators/RiskAssessment';
import { HourlyRateCalculator } from './calculators/HourlyRateCalculator';
import { QRGenerator } from './generators/QRGenerator';
import { DuesGenerator } from './generators/DuesGenerator';
import { EliteInvoice } from './generators/EliteInvoice';
import { MiniCard } from './MiniCard';
import { InflationCalculator } from "./calculators/InflationCalculator";
import { PrivacyPolicy } from './PrivacyPolicy';
import { TermsOfService } from './TermsOfService';
import { Sitemap } from './SiteMap'; // Předpokládám, že ho máš v /components/
import { AboutUs } from './AboutUs'; // Přidat
import { Contact } from './Contact'; // Přidat
import { SafeBuyCalculator } from './calculators/SafeBuyCalculator';
import { ScrollToTop } from './ScrollToTop'; // Import hooku
import { NotFound } from './NotFound'; // Import fallbacku
import QuizPage from './QuizPage';
import { 
  FileText, Activity, Zap, ShieldAlert, Briefcase, Coins, QrCode, FileWarning, Target, 
  TrendingUp, TrendingDown, PiggyBank 
} from 'lucide-react';

// --- ROZCESTNÍKY (Musí být definovány mimo hlavní komponentu) ---

const FakturyNav = () => (
  <div className="nav-container">
    <h2>Faktury & platby</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '15px' }}>
      <MiniCard title="Faktura" desc="Vytvořit novou" icon={FileText} to="/faktura" />
      <MiniCard title="QR Platba" desc="Generátor kódu" icon={QrCode} to="/qr" />
      <MiniCard title="Splatnost" desc="Hlídač termínů" icon={FileWarning} to="/upominky" />
    </div>
  </div>
);

const AuditNav = () => (
  <div className="nav-container">
    <h2>Audit stability</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '15px' }}>
      <MiniCard title="Index stability" desc="Celková diagnostika" icon={Activity} to="/stabilita" />
      <MiniCard title="Rezerva" desc="Finanční polštář" icon={PiggyBank} to="/rezerva" />
      <MiniCard title="Rizika" desc="Analýza hrozeb" icon={ShieldAlert} to="/rizika" />
      <MiniCard title="Energie" desc="Hlídač nákladů" icon={Zap} to="/energie" />
    </div>
  </div>
);

const StrategieNav = () => (
  <div className="nav-container">
    <h2>Strategie & růst</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '15px' }}>
      <MiniCard title="Plánovač" desc="Kalkulačka prosperity" icon={Target} to="/planovac" />
      <MiniCard title="Hodinovka" desc="Ideální sazba" icon={Coins} to="/hodinovka" />
      <MiniCard title="Zakázky" desc="Ziskovost projektů" icon={Briefcase} to="/projekt" />
    </div>
  </div>
);

const InvesticeNav = () => (
  <div className="nav-container">
    <h2>Investice & ROI</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '15px' }}>
      <MiniCard title="Návratnost" desc="Kalkulačka ROI" icon={TrendingUp} to="/roi" />
      <MiniCard title="Inflace" desc="Znehodnocení úspor" icon={TrendingDown} to="/inflace" />
      <MiniCard title="Aktiva" desc="Zlato a drahé kovy" icon={Coins} to="/aktiva" />
	  <MiniCard title="Nákupy" desc="Dobrá investice" icon={Coins} to="/nakupy" />
    </div>
  </div>
);

// --- HLAVNÍ KOMPONENTA ---

export const AppContent = () => {
  const navigate = useNavigate();

  const handleNavigate = (view: string, articleId?: string) => {
    const routes: Record<string, string> = {
      dashboard: '/panel',
	  prosperita: '/planovac',
      rezerva: '/rezerva',
      rizika: '/rizika',
      hodinovka: '/hodinovka',
      clanky: '/clanky',
      kalendar: '/kalendar',
      nastroje: '/nastroje',
      strategie: '/strategie',
      investice: '/investice',
	  kviz: '/kviz'
    };
    const targetPath = routes[view] || view;
    navigate(articleId ? `${targetPath}/${articleId}` : targetPath);
  };

  return (
  <>
      {/* KLÍČOVÁ ZMĚNA: ScrollToTop musí být uvnitř Routeru, ale vně Routes */}
      <ScrollToTop />
    <Routes>
      <Route path="/" element={<LandingPage onNavigate={handleNavigate} />} />
      <Route path="/panel" element={<Dashboard />} />

      {/* 1. Faktury & platby */}
      <Route path="/nastroje" element={<FakturyNav />} />
      <Route path="/faktura" element={<EliteInvoice />} />
      <Route path="/qr" element={<QRGenerator />} />
      <Route path="/upominky" element={<DuesGenerator />} />

      {/* 2. Audit stability */}
      <Route path="/audit" element={<AuditNav />} />
      <Route path="/stabilita" element={<StabilityCalculator />} />
      <Route path="/rezerva" element={<ReservesCalculator />} />
      <Route path="/rizika" element={<RiskAssessment />} />
	  <Route path="/energie" element={<EnergyCalculator />} />

      {/* 3. Strategie & růst */}
      <Route path="/strategie" element={<StrategieNav />} />
	  <Route path="/planovac" element={<ProsperityPlanner />} />
      <Route path="/hodinovka" element={<HourlyRateCalculator />} />
      <Route path="/projekt" element={<ProjectProfitCalculator />} />

      {/* 4. Investice & ROI */}
      <Route path="/investice" element={<InvesticeNav />} />
      <Route path="/roi" element={<ROICalculator />} />
      <Route path="/inflace" element={<InflationCalculator />} />
      <Route path="/aktiva" element={<AssetsCalculator />} />
	  <Route path="/nakupy" element={<SafeBuyCalculator />} />

      {/* Ostatní */}
      <Route path="/kalendar" element={<CalendarPage userType="vse" />} />
      <Route path="/clanky" element={<ArticleSection />} />
      <Route path="/clanky/:id" element={<ArticleSection />} />
	  <Route path="/kviz" element={<QuizPage />} />
	  
{/* --- Footer & Info --- */}
      <Route path="/o-nas" element={<AboutUs />} />
      <Route path="/kontakt" element={<Contact />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/mapa-stranek" element={<Sitemap />} />
      
      {/* Catch-all route musí být POSLEDNÍ uvnitř <Routes> */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </> // <--- TADY CHYBĚLA TATO ZNAČKA
  );
};

export default AppContent;