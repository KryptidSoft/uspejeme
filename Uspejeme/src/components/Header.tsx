import { useState } from 'react';
import { Menu, X, ChevronDown, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavItem {
  id: string;
  label: string;
  path: string;
}

interface SubItem {
  label: string;
  path: string;
}

interface HeaderProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  tools: NavItem[];
  subItems: Record<string, SubItem[]>;
}

export const Header = ({ isMobileMenuOpen, setIsMobileMenuOpen, tools, subItems }: HeaderProps) => {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleNav = (path: string) => {
    if (path !== '#') {
      navigate(path);
      setIsMobileMenuOpen(false);
      setOpenDropdown(null);
    }
  };

  return (
    <header className="main-header">
      <div className="header-wrapper container-max">
        
        {/* LOGO SEKCE S PŘÍMÝMI STYLY */}
        <div 
          className="logo-section" 
          onClick={() => handleNav('/')} 
          style={{ 
            cursor: 'pointer', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'flex-start',
            padding: '5px 0'
          }}
        >
          <h1 style={{ 
            fontSize: '2.1rem', 
            margin: 2, 
            lineHeight: '1.1', 
            color: 'white',
            fontWeight: 'bold'
          }}>
            Uspějeme<span style={{ color: 'var(--primary)' }}>.cz</span>
          </h1>
          <p style={{ 
            fontSize: '0.9rem', 
            margin: '12px 0 0 4px', 
            color: 'var(--text-dim)', 
            opacity: 0.8,
            whiteSpace: 'nowrap'
          }}>
            Finanční nástroj pro OSVČ
          </p>
        </div>

        <nav className={`header-nav ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
          <button className="nav-link" onClick={() => handleNav('/')}>
            <Home size={18} />
          </button>
          
          {tools.map((tool: NavItem) => {
            const hasSubs = subItems[tool.id] && subItems[tool.id].length > 0;

            return (
              <div 
                key={tool.id} 
                className="nav-dropdown-container"
                onMouseEnter={() => !isMobileMenuOpen && hasSubs && setOpenDropdown(tool.id)}
                onMouseLeave={() => !isMobileMenuOpen && setOpenDropdown(null)}
              >
                <button 
                  className="nav-link" 
                  onClick={() => {
                    if (isMobileMenuOpen && hasSubs) {
                      setOpenDropdown(openDropdown === tool.id ? null : tool.id);
                    } else {
                      handleNav(tool.path);
                    }
                  }}
                >
                  {tool.label}
                  {hasSubs && <ChevronDown size={14} style={{ 
                    transform: openDropdown === tool.id ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                  }} />}
                </button>

                {hasSubs && openDropdown === tool.id && (
                  <div className="dropdown-menu">
                    {subItems[tool.id].map((sub: SubItem) => (
                      <button key={sub.path} onClick={() => handleNav(sub.path)}>
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <button className="hamburger" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </header>
  );
};