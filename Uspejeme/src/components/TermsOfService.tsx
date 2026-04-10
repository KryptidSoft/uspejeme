import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="article-container fade-in">
	
	      {/* Lokální CSS jen pro tuto stránku */}
      <style>
        {`
          /* Zarovnání textu pro desktop */
          .article-content p {
            text-align: justify;
            line-height: 1.6;
          }

          /* Mobilní verze – vypnout justify */
          @media (max-width: 768px) {
            .article-content p {
              text-align: left;
            }
          }
        `}
      </style>
	  
      <div className="article-card">
        <h1 className="article-title">VŠEOBECNÉ PODMÍNKY UŽÍVÁNÍ</h1>
        
        <div className="article-meta">
          <span>Platnost od: 20. března 2026 | Uspejeme.cz</span>
        </div>

        <div className="article-content">
          <h3>1. Akceptace podmínek</h3>
          <p>
            Vstupem na tuto webovou aplikaci a jejím používáním vyjadřuje uživatel bezvýhradný souhlas s těmito všeobecnými podmínkami užívání. Pokud uživatel s těmito podmínkami nesouhlasí, je povinen aplikaci neprodleně opustit a ukončit její používání.
          </p>

          <h3>2. Charakter poskytovaných informací</h3>
          <p>
            Veškeré výstupy, výpočty a simulace poskytované touto aplikací mají pouze informativní a orientační charakter. Aplikace využívá zjednodušené matematické modely, které nemusí reflektovat aktuální legislativní změny v plném rozsahu nebo specifické individuální okolnosti uživatele.
          </p>
          <p>
            Výsledky generované aplikací v žádném případě nenahrazují odborné daňové, účetní, právní ani investiční poradenství. Provozovatel důrazně doporučuje konzultovat jakákoliv finanční rozhodnutí s kvalifikovaným odborníkem.
          </p>

          <h3>3. Omezení odpovědnosti</h3>
          <p>
            Provozovatel nenese žádnou odpovědnost za přímé, nepřímé, náhodné nebo následné škody, ztráty zisku nebo sankce vyměřené státními orgány, které vznikly v důsledku použití nebo nemožnosti použití této aplikace, případně v důsledku spoléhání se na data generovaná aplikací.
          </p>
          <p>
            Uživatel nese plnou a výhradní odpovědnost za svá rozhodnutí a za správnost dat, která do aplikace vkládá. Aplikace je poskytována v režimu „tak jak je“ (as is), bez jakýchkoliv záruk na přesnost nebo funkčnost.
          </p>

          <h3>4. Autorská práva a duševní vlastnictví</h3>
          <p>
            Veškerý obsah aplikace, včetně zdrojového kódu, algoritmů, textů, grafického rozhraní a logiky výpočtů, je chráněn autorským zákonem. Jakékoliv kopírování, šíření nebo komerční využívání obsahu bez předchozího písemného souhlasu provozovatele je zakázáno.
          </p>

          <h3>5. Dostupnost a změny služby</h3>
          <p>
            Provozovatel si vyhrazuje právo kdykoliv, i bez předchozího upozornění, omezit nebo ukončit provoz aplikace, případně změnit její funkcionality. Stejně tak si provozovatel vyhrazuje právo na aktualizaci těchto podmínek.
          </p>
          
          <p style={{ marginTop: '40px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
            Dokumentace podléhá právnímu řádu České republiky.
          </p>
        </div>
      </div>
    </div>
  );
};

export { TermsOfService };