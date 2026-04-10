# 🚀 Uspějeme.cz (v1.0)
Moderní offline-first finanční asistent pro OSVČ a investory.

Tato aplikace slouží k rychlému a bezpečnému výpočtu klíčových finančních metrik. Veškerá data zůstávají v prohlížeči uživatele, což zaručuje 100% soukromí.

🚀 Klíčové funkce

1. ROI & Investiční analýza (NPV Model)
- Výpočet čisté současné hodnoty (NPV) na pětiletém horizontu.
- Zohlednění diskontní sazby (inflace + alternativní výnosy).
- Rozlišení mezi prostou a diskontovanou dobou návratnosti.

2. Plánovač prosperity & Hodinová sazba
- Dynamický výpočet nutné fakturační sazby na základě životního standardu.
- Integrovaný daňový simulátor (Paušální daň 2026, Výdajový paušál, Reálné výdaje).
- Kalkulace "vaty" na spoření a investice přímo v základu hodinovky.

3. Diagnostika finanční rezervy (Smart Visualizer)
- Interaktivní Doughnut Chart: Vizuální rozdělení rezervy na "Základní bezpečí" (3 měsíce) a "Komfortní polštář".
- URL Scénáře: Možnost vygenerovat unikátní odkaz s parametry výpočtu.
- Plánovač měsíčního spoření pro dosažení cílové zóny v čase.

4. Business Operativa & Fakturace
- Fakturační editor: Rychlé generování faktur pro neplátce DPH s PDF exportem.
- Smart QR Pay: Generátor platebních kódů s rychlou volbou DPH (+12%, +21%).
- Payment Guard: Správa splatnosti a inteligentní generátor upomínek (Přátelská až Důrazná).
- Kalendář OSVČ: Hlídač daňových a odvodových termínů pro rok 2026.

5. Stabilita & Odolnost
- Audit podnikatelské odolnosti: Stres test závislosti na klientech a procesní stability.
- Profitabilita zakázek: Analýza reálného zisku po odečtení hodnoty vlastního času.
- Hlídač energií: Průběžná bilance spotřeby (elektřina, plyn, voda) pro zamezení nedoplatků.

6. Další nástroje
- Kupní síla: Přepočet CZK na tvrdá aktiva (Zlato, Stříbro, Bitcoin) dle cen k 02/2026.
- Kontextová nápověda: Inteligentní tooltipy u komplexních finančních pojmů.

🛠 Technologický zásobník
- Framework: React 18+ s TypeScriptem
- Grafy: Chart.js & React-Chartjs-2
- Design: Custom Glassmorphism (CSS Variables, Backdrop Filter)
- Ikony: Lucide React
- Persistence: LocalStorage & URL Search Params

📁 Struktura projektu (rozšířená)
/src
├─ /components
│  ├─ /calculators      # Prosperity, ROI, Energy, Profitability
│  ├─ /business         # InvoiceEditor, QRPay, PaymentGuard
│  ├─ /ui               # GlassCard, InputGroup, Tooltips
│  └─ ArticleSection.tsx
├─ /utils
│  ├─ /calculations     # Jádra matematických modelů
│  └─ /hooks            # Custom hooks pro LocalStorage persistence
└─ App.tsx              # Navigation Router & Global State

© 2026 Uspejeme.cz | Vytvořeno pro komunitu svobodných profesionálů.