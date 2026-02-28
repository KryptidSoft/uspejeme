# 🚀 Rozhodni.cz (v1.0)
**Moderní offline-first finanční asistent pro OSVČ a investory.**

Tato aplikace slouží k rychlému a bezpečnému výpočtu klíčových finančních metrik. Veškerá data zůstávají v prohlížeči uživatele, což zaručuje 100% soukromí.

## 🚀 Klíčové funkce

### 1. ROI & Investiční analýza (NPV Model)
- Výpočet čisté současné hodnoty (**NPV**) na pětiletém horizontu.
- Zohlednění **diskontní sazby** (inflace + alternativní výnosy).
- Očištění o rizikový faktor projektu.
- Rozlišení mezi prostou a diskontovanou dobou návratnosti.

### 2. Kalkulačka hodinové sazby
- Rozklad na **fakturační sazbu** a **efektivní mzdu**.
- Kalkulace neviditelných nákladů (daně, režie, dovolená, nemocenská).
- Sledování vytíženosti (poměr fakturovatelných a režijních hodin).

### 3. Diagnostika finanční stability
- Algoritmus využívající **sigmoidní normalizaci** pro skórování stability.
- Vážený průměr faktorů: rezervy, udržitelnost příjmů, pracovní vytížení a efektivita investic.

### 4. Další nástroje
- **Energetická náročnost:** Výpočet nákladů na HW s variabilitou ±5 %.
- **Kupní síla:** Přepočet CZK na tvrdá aktiva (Zlato, Stříbro, Bitcoin) dle cen k 02/2026.
- **Finanční rezervy:** Plánování měsíčního spoření pro dosažení "bezpečné zóny".

---

## 🛠 Technologický zásobník

- **Framework:** React 18+ s TypeScriptem
- **Design:** Custom Glassmorphism (CSS Variables + Backdrop Filter)
- **Ikony:** Lucide React
- **Persistence:** Custom Hook `usePersistentState` (synchronizace s LocalStorage)
- **Export:** Validní CSV export s UTF-8 BOM podporou pro Excel

---

## 📁 Struktura projektu

```text
/src
├─ /components
│  ├─ /calculators      # Specifické moduly kalkulaček
│  ├─ /ui               # Znovupoužitelné UI prvky (GlassCard, InputGroup)
│  ├─ Header.tsx / Footer.tsx
│  └─ ArticleSection.tsx
├─ /hooks
│  └─ usePersistentState.ts
├─ /utils
│  ├─ /calculations     # Čistá matematická logika (bez side-effectů)
│  ├─ localStorage.ts
│  └─ csvExport.ts
├─ /data
│  ├─ articles.ts       # Databáze vzdělávacího obsahu
│  └─ about.ts          # Texty pro sekci O nás a Reference
├─ App.tsx              # Hlavní orchestrátor a router
└─ index.css            # Globální styly a design systém

---
© 2026 Rozhodni.cz | Vytvořeno pro komunitu svobodných profesionálů.