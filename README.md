🚀 Rozhodni.cz (v1.0)
Moderní offline-first finanční asistent pro OSVČ a investory.

Tato aplikace slouží k rychlému a bezpečnému výpočtu klíčových finančních metrik. Veškerá data zůstávají v prohlížeči uživatele, což zaručuje 100% soukromí.

🚀 Klíčové funkce
1. ROI & Investiční analýza (NPV Model)
Výpočet čisté současné hodnoty (NPV) na pětiletém horizontu.

Zohlednění diskontní sazby (inflace + alternativní výnosy).

Rozlišení mezi prostou a diskontovanou dobou návratnosti.

2. Plánovač prosperity & Hodinová sazba
Dynamický výpočet nutné fakturační sazby na základě životního standardu.

Integrovaný daňový simulátor (Paušální daň 2026, Výdajový paušál, Reálné výdaje).

Kalkulace "vaty" na spoření a investice přímo v základu hodinovky.

3. Diagnostika finanční rezervy (Smart Visualizer)
Interaktivní Doughnut Chart: Vizuální rozdělení rezervy na "Základní bezpečí" (3 měsíce) a "Komfortní polštář".

URL Scénáře: Možnost vygenerovat unikátní odkaz s parametry výpočtu pro okamžité sdílení nebo uložení mimo LocalStorage.

Plánovač měsíčního spoření pro dosažení cílové zóny v čase.

4. Další nástroje
Energetická náročnost: Výpočet nákladů na HW s profily (MacBook, Herní PC, LED) a integrovaným poznámkovým blokem.

Kupní síla: Přepočet CZK na tvrdá aktiva (Zlato, Stříbro, Bitcoin) dle cen k 02/2026.

Kontextová nápověda: Inteligentní tooltipy u komplexních finančních pojmů pro lepší UX.

🛠 Technologický zásobník
Framework: React 18+ s TypeScriptem

Grafy: Chart.js & React-Chartjs-2 (Canvas rendering)

Design: Custom Glassmorphism (CSS Variables + Backdrop Filter + Smooth Transitions)

Ikony: Lucide React

Persistence: LocalStorage (automatické ukládání stavu) & URL Search Params (sdílení scénářů)

📁 Struktura projektu
Plaintext
/src
├─ /components
│  ├─ /calculators      # Moduly (Reserves, Prosperity, Energy, ROI, atd.)
│  ├─ /ui               # Atomické UI (GlassCard, InputGroup s Tooltipem)
│  ├─ Header.tsx / Footer.tsx
│  └─ ArticleSection.tsx
├─ /utils
│  ├─ /calculations     # Matematická jádra (Reserves logic, Energy math)
│  └─ mathHelpers.ts    # Formátování měn a zaokrouhlování
├─ App.tsx              # Hlavní orchestrátor a Navigation Router
└─ index.css            # Globální design systém a animace
💻 Instalace a spuštění
npm install (nainstaluje React, Lucide, Chart.js)

npm run dev (spustí vývojový server)

© 2026 Rozhodni.cz | Vytvořeno pro komunitu svobodných profesionálů.