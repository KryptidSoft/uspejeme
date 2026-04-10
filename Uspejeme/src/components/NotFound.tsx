import { useNavigate } from 'react-router-dom';
import { GlassCard } from './ui/GlassCard';

export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <GlassCard>
        <h1>404 - Stránka nenalezena</h1>
        <p>Tato cesta neexistuje nebo byla přesunuta.</p>
        <button 
          onClick={() => navigate('/')}
          style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}
        >
          Zpět na hlavní stránku
        </button>
      </GlassCard>
    </div>
  );
};