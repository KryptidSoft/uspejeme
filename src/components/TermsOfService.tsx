import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { useNavigate } from 'react-router-dom';

export const TermsOfService: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="fade-in" style={{ maxWidth: '850px', margin: '0 auto', padding: '40px 20px', color: '#fff' }}>
      
      <button 
        onClick={() => navigate(-1)}
        style={{ 
          background: 'none', 
          border: 'none', 
          color: 'rgba(255,255,255,0.5)', 
          cursor: 'pointer', 
          marginBottom: '20px',
          padding: 0,
          fontSize: '0.9rem',
          textDecoration: 'underline'
        }}
      >
        Zpět na předchozí stránku
      </button>

      <GlassCard style={{ padding: '50px', borderRadius: '4px' }}>
        <header style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '30px', paddingBottom: '20px' }}>
          <h1 style={{ fontSize: '1.8rem', margin: '0 0 10px 0', letterSpacing: '0.5px' }}>
            VŠEOBECNÉ PODMÍNKY UŽÍVÁNÍ
          </h1>
          <p style={{ fontSize: '0.9rem', opacity: 0.5, margin: 0 }}>
            Platnost od: 20. března 2026 | Uspejeme.cz
          </p>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', textAlign: 'justify', fontSize: '0.95rem', lineHeight: '1.6' }}>
          
          <section>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '10px', textTransform: 'uppercase' }}>1. Akceptace podmínek</h2>
            <p>
              Vstupem na tuto webovou aplikaci a jejím používáním vyjadřuje uživatel bezvýhradný souhlas s těmito 
              všeobecnými podmínkami užívání. Pokud uživatel s těmito podmínkami nesouhlasí, je povinen 
              aplikaci neprodleně opustit a ukončit její používání.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '10px', textTransform: 'uppercase' }}>2. Charakter poskytovaných informací</h2>
            <p>
              Veškeré výstupy, výpočty a simulace poskytované touto aplikací mají <strong>pouze informativní a orientační charakter</strong>. 
              Aplikace využívá zjednodušené matematické modely, které nemusí reflektovat aktuální legislativní změny 
              v plném rozsahu nebo specifické individuální okolnosti uživatele.
            </p>
            <p style={{ marginTop: '10px' }}>
              Výsledky generované aplikací v žádném případě <strong>nenahrazují odborné daňové, účetní, právní 
              ani investiční poradenství</strong>. Provozovatel důrazně doporučuje konzultovat jakákoliv 
              finanční rozhodnutí s kvalifikovaným odborníkem.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '10px', textTransform: 'uppercase' }}>3. Omezení odpovědnosti</h2>
            <p>
              Provozovatel nenese žádnou odpovědnost za přímé, nepřímé, náhodné nebo následné škody, ztráty zisku 
              nebo sankce vyměřené státními orgány, které vznikly v důsledku použití nebo nemožnosti použití 
              této aplikace, případně v důsledku spoléhání se na data generovaná aplikací.
            </p>
            <p style={{ marginTop: '10px' }}>
              Uživatel nese plnou a výhradní odpovědnost za svá rozhodnutí a za správnost dat, která do aplikace vkládá. 
              Aplikace je poskytována v režimu „tak jak je“ (as is), bez jakýchkoliv záruk na přesnost nebo funkčnost.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '10px', textTransform: 'uppercase' }}>4. Autorská práva a duševní vlastnictví</h2>
            <p>
              Veškerý obsah aplikace, včetně zdrojového kódu, algoritmů, textů, grafického rozhraní a logiky 
              výpočtů, je chráněn autorským zákonem. Jakékoliv kopírování, šíření nebo komerční využívání 
              obsahu bez předchozího písemného souhlasu provozovatele je zakázáno.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '10px', textTransform: 'uppercase' }}>5. Dostupnost a změny služby</h2>
            <p>
              Provozovatel si vyhrazuje právo kdykoliv, i bez předchozího upozornění, omezit nebo ukončit provoz 
              aplikace, případně změnit její funkcionality. Stejně tak si provozovatel vyhrazuje právo na 
              aktualizaci těchto podmínek. Pokračováním v používání aplikace po změně podmínek uživatel 
              stvrzuje svůj souhlas s novým zněním.
            </p>
          </section>

        </div>

        <footer style={{ marginTop: '40px', fontSize: '0.85rem', opacity: 0.5, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', textAlign: 'center' }}>
          Dokumentace podléhá právnímu řádu České republiky.
        </footer>
      </GlassCard>
    </div>
  );
};