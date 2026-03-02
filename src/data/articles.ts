/**
 * Definice rozhraní pro článek.
 * Exportujeme jej, aby jej mohla používat komponenta ArticleSection.tsx.
 */
export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'finance' | 'productivity' | 'strategy';
  readTime: string;
  date: string;
}

/**
 * Seznam článků pro sekci "Články".
 * Obsahuje úvodní manifest a odborné články zaměřené na budoucnost OSVČ.
 */
export const articles: Article[] = [
  {
    id: '0',
    title: 'Vítejte na Rozhodni.cz!',
    excerpt: 'OSVČ tvoří páteř ekonomiky, přesto většina z nás riskuje svou budoucnost špatným naceňováním. Zjistěte, jak propojit finance a technologie, které vás ochrání.',
    category: 'strategy',
    readTime: '4 min',
    date: '28. 02. 2026',
    content: `
V České republice jsou statisíce OSVČ. Jsme programátoři, řemeslníci, kreativci i konzultanti. I když děláme různé obory, spojuje nás jedno: neseme plnou odpovědnost za svou finanční budoucnost. 

Většina dostupných nástrojů pro podnikatele se soustředí na minulost – na to, jak zaúčtovat to, co už se stalo. Rozhodni.cz vzniklo s opačnou filozofií. Chceme vám pomoci se rozhodovat o tom, co se stane zítra.

### Hodinová sazba je iluze bez rezervy
Mnoho freelancerů počítá svou sazbu jako prostý podíl nákladů a času. To je cesta k vyhoření. Skutečná sazba musí obsahovat „neviditelné“ proměnné, jejichž ignorování má fatální následky:
* **Rizikový faktor:** Co když vypadne hlavní klient nebo přijde nemoc?
* **Technologický dluh:** Máte prostředky na upgrade HW a SW každé dva roky?
* **Vzdělávací buffer:** Kolik času musíte věnovat studiu AI, abyste za rok nebyli nahrazeni automatizací?

Nízká cena není konkurenční výhoda, je to strategie přežití, která neumožňuje růst. Pokud vaše kalkulace nepočítá s 20–30% rezervou na rozvoj, ve skutečnosti dotujete své klienty z vlastního budoucího důchodu.

### Platforma pro éru AI a technologií
Svět se mění. AI nemění jen to, jak pracujeme, ale radikálně mění hodnotu našeho času. Na Rozhodni.cz proto nenajdete jen tabulky. Naším cílem je poskytnout vám nástroje pro:
1.  **Tvrdá data:** Precizní kalkulace ROI a NPV (čisté současné hodnoty), abyste věděli, zda se projekt vyplatí i za 5 let.
2.  **Budoucí příležitosti:** Jak transformovat váš model příjmů, aby byl odolný vůči automatizaci.
3.  **Absolutní soukromí:** Offline-first přístup znamená, že vaše data nikdy neopustí váš prohlížeč. Vaše strategie je jen vaše věc.

### Co zde najdete?
Připravili jsme pro vás sadu nástrojů, které jdou pod povrch. Od diagnostiky finanční stability využívající sigmoidní normalizaci až po přepočet vaší kupní síly na tvrdá aktiva jako zlato či bitcoin. 

Nejsme jen další finanční blog. Jsme platforma pro OSVČ, investory a menší podniky a lidi, kteří potřebují konkrétní rozhodnutí a nástroje.

Vítejte v komunitě svobodných profesionálů, kteří se nebojí budoucnosti, protože si ji umí spočítat.
    `
  },
  {
    id: '1',
    title: 'Jak správně počítat ROI u digitálních projektů',
    excerpt: 'Návratnost investice není jen o číslech, ale i o čase a riziku. Naučte se, jak do výpočtů zahrnout i skryté náklady.',
    content: 'Zde je detailní rozbor výpočtu ROI pomocí našeho NPV modelu. Při investici do nového softwaru nebo hardwaru musíte započítat nejen pořizovací cenu, ale i čas na implementaci a diskontní sazbu (inflaci). Naše kalkulačka na Rozhodni.cz vám s tímto pomůže během několika vteřin.',
    category: 'finance',
    readTime: '5 min',
    date: '15. 02. 2026'
  },
  {
    id: '2',
    title: 'Hodinová sazba: Past na freelancery?',
    excerpt: 'Proč fixace na hodinovou sazbu může brzdit váš růst a jak přejít na naceňování podle hodnoty (Value-based pricing).',
    content: 'Prodávat svůj čas je nejjednodušší cesta, ale má svůj strop. Pokud se díky AI stanete 2x efektivnější, při hodinové sazbě paradoxně vyděláte polovinu. Řešením je přechod na naceňování výsledků. V článku rozebereme, jak efektivní mzda ovlivňuje vaši dlouhodobou stabilitu.',
    category: 'productivity',
    readTime: '7 min',
    date: '10. 02. 2026'
  }
];