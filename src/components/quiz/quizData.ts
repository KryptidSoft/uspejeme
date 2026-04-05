export type QuizAnswer = {
  label: string;
  weights: Record<string, number>;
};

export type QuizQuestion = {
  question: string;
  answers: QuizAnswer[];
};

export type ActionPlan = {
  today: string;
  tomorrow: string;
  week: string;
};

export type QuizResult = {
  type: string;
  description: string;
  tips: string[];
  actionPlan: ActionPlan;
  cta: { label: string; link: string };
};

export const quizQuestions: QuizQuestion[] = [
  {
    question: "Jak se připravuješ na pracovní týden?",
    answers: [
      { label: "Mám detailní plán a postupně ho plním", weights: { strategic: 3, minimalist: 1 } },
      { label: "Pracuji podle nálady a aktuálních možností", weights: { chaotic: 3 } },
      { label: "Odkládám start, dokud mě k akci nedonutí tlak", weights: { procrastinator: 3, night_owl: 1 } },
    ],
  },
  {
    question: "Jak zvládáš práci s termíny (deadliny)?",
    answers: [
      { label: "Dodržuji je přesně a systematicky s rezervou", weights: { strategic: 3, perfectionist: 1 } },
      { label: "Dělám jen to, co aktuálně cítím jako kritické", weights: { chaotic: 2, minimalist: 1 } },
      { label: "Často odkládám a pak makám v noci před termínem", weights: { procrastinator: 3, night_owl: 2 } },
    ],
  },
  {
    question: "Kdy podáváš svůj nejlepší pracovní výkon?",
    answers: [
      { label: "Ráno a dopoledne, dokud mám čistou hlavu", weights: { strategic: 2, workaholic: 1 } },
      { label: "Pozdě večer nebo v noci, když mě nikdo neruší", weights: { night_owl: 3, procrastinator: 1 } },
      { label: "V nárazech – když mě chytne flow, neznám čas", weights: { workaholic: 3, chaotic: 1 } },
    ],
  },
  {
    question: "Co tě podle tebe nejvíce brzdí ve vyšším výdělku?",
    answers: [
      { label: "Chaos v prioritách a chybějící systém", weights: { chaotic: 3 } },
      { label: "Přílišné zkoumání detailů na úkor rychlosti", weights: { perfectionist: 3, strategic: 1 } },
      { label: "Čas strávený prokrastinací a odkládáním úkolů", weights: { procrastinator: 3 } },
    ],
  },
  {
    question: "Jak vypadá tvůj ideální pracovní den?",
    answers: [
      { label: "Maximálně 4 hodiny hluboké, efektivní práce", weights: { minimalist: 3, strategic: 1 } },
      { label: "Celý den v plném nasazení a řešení výzev", weights: { workaholic: 3, strategic: 1 } },
      { label: "Flexibilní čas, kde improvizace hraje hlavní roli", weights: { chaotic: 3, night_owl: 1 } },
    ],
  },
];

export const quizResults: Record<string, QuizResult> = {
  chaotic: {
    type: "Chaotický dříč",
    description: "Máš neuvěřitelné množství energie, ale tvůj největší nepřítel je chybějící struktura, která ti odčerpává zisk. Pokud lépe organizuješ svůj den, dokážeš tuto energii přeměnit na měřitelný výsledek.",
    tips: [
      "Zaveď si fixní čas na administrativu (např. ráno 30 min).",
      "Používej vizuální checklisty a barevné štítky.",
      "Rozděl velké úkoly na malé kroky a označ si priority."
    ],
    actionPlan: {
      today: "Ukliď si plochu počítače a zavři 10 nepotřebných karet v prohlížeči. [cca 10 min]",
      tomorrow: "Napiš si 3 nejdůležitější úkoly hned ráno na papír. [cca 5 min]",
      week: "Vyzkoušej jeden digitální nástroj na správu úkolů (např. Trello). [cca 30 min]"
    },
    cta: { label: "Spočítej si hodinovou sazbu", link: "/hodinovka" },
  },
  strategic: {
    type: "Strategický hráč",
    description: "Plánuješ dopředu a znáš svá čísla. Pozor ale, abys neuvízl v 'analýze paralýze'. S trochou flexibility můžeš dosáhnout ještě lepší efektivity.",
    tips: [
      "Metoda 80% hotovo je dost dobré, nečekej na dokonalost.",
      "Pravidelně vyhodnocuj ROI a měř výsledky.",
      "Vytvářej rutiny, které minimalizují rozhodovací únavu."
    ],
    actionPlan: {
      today: "Vyber jeden rozpracovaný úkol a dokonči ho bez dalšího ladění. [cca 25 min]",
      tomorrow: "Deleguj nebo zruš jednu aktivitu, která ti nepřináší peníze. [cca 15 min]",
      week: "Naplánuj si strategickou hodinu bez e-mailu a telefonu. [cca 60 min]"
    },
    cta: { label: "Prověř svou ziskovost", link: "/roi" },
  },
  procrastinator: {
    type: "Prokrastinační ninja",
    description: "Zvládneš týdenní práci za noc, ale tento tlak je dlouhodobě neudržitelný. Lepší plánování ti ušetří stres i energii.",
    tips: [
      "Časové bloky pro úkoly – nastav si konkrétní začátek a konec.",
      "Odměňuj se za dokončené milníky – i malé úspěchy se počítají.",
      "Technika Pomodoro ti pomůže udržet fokus."
    ],
    actionPlan: {
      today: "Nastav si časovač na 25 minut a pracuj jen na jedné věci. [25 min]",
      tomorrow: "Nejtěžší úkol dne udělej jako první věc po probuzení. [cca 30–45 min]",
      week: "Zablokuj si v kalendáři 'nedotknutelný čas' pro hlubokou práci. [cca 2 hodiny]"
    },
    cta: { label: "Hlídej si termíny v kalendáři", link: "/kalendar" },
  },
  night_owl: {
    type: "Noční makáč",
    description: "V noci jsi kreativnější, ale tvůj biorytmus může kolidovat s požadavky okolí. Optimalizací dne můžeš využít svůj vrchol energie efektivněji.",
    tips: [
      "Hranice pro komunikaci přes den – nastav jasný čas pro odpovědi.",
      "Práce na vrcholu energie – soustřeď se na kreativní úkoly v noci.",
      "Spánková hygiena – snaž se mít pravidelný rytmus spánku."
    ],
    actionPlan: {
      today: "Nastav si na mobilu režim 'Nerušit' od 22:00. [večer]",
      tomorrow: "Důležité maily klientům naplánuj k odeslání na 8:00 ráno. [ráno]",
      week: "Zkus jeden den začít pracovat o hodinu dříve než obvykle. [experiment]"
    },
    cta: { label: "Zkontroluj své rezervy", link: "/rezerva" },
  },
  perfectionist: {
    type: "Perfekcionista",
    description: "Tvá práce je top, ale ladění detailů tě stojí čas, který ti nikdo nezaplatí. Naučit se uvolnit kontrolu zlepší tvou produktivitu.",
    tips: [
      "Definuj si 'hotovo' – perfektní není vždy nutné.",
      "Omez čas nad detaily – např. max 60 minut na úkol.",
      "Soustřeď se na funkčnost a hodnotu pro klienta."
    ],
    actionPlan: {
      today: "Odevzdej úkol, na kterém pracuješ, hned teď. [cca 5 min]",
      tomorrow: "U nového úkolu si stopni čas a po 60 minutách přestaň. [60 min]",
      week: "Sleduj, kolik času trávíš opravami, které klient nevyžadoval. [cca 1 hodina]"
    },
    cta: { label: "Otestuj svou stabilitu", link: "/rizika" },
  },
  minimalist: {
    type: "Efektivní minimalista",
    description: "Mistr v osekávání nepodstatného. Tvůj čas je pro tebe nejcennější komoditou. Můžeš maximalizovat výnosy při minimálním úsilí.",
    tips: [
      "Reviduj služby s nízkou marží a odstraň je.",
      "Automatizuj opakované úsilí a úkoly.",
      "Investuj ušetřený čas do ziskových aktivit."
    ],
    actionPlan: {
      today: "Najdi jeden automatizovatelný proces ve svém podnikání. [cca 30 min]",
      tomorrow: "Řekni 'ne' jedné schůzce, která nemá jasný program. [cca 5 min]",
      week: "Zvyš cenu své nejžádanější služby o 10 %. [strategická akce]"
    },
    cta: { label: "Plánuj svou prosperitu", link: "/planovac" },
  },
  workaholic: {
    type: "Přepálený workoholik",
    description: "Motor firmy, ale tvoje svíčka hoří z obou stran. Hrozí ti vyhoření. Pravidelný odpočinek zlepší dlouhodobou výkonnost.",
    tips: [
      "Pevný konec pracovní doby – nastav si hranice.",
      "Deleguj úkoly a nesnaž se dělat vše sám.",
      "Odpočívej bez pocitu viny – tvá efektivita se zvýší."
    ],
    actionPlan: {
      today: "Dnes vypni počítač přesně v 18:00 a jdi na procházku. [večer]",
      tomorrow: "Smaž si pracovní e-mail z telefonu pro zbytek dne. [cca 5 min]",
      week: "Naplánuj si jeden celý den v týdnu bez jediné pracovní myšlenky. [celý den]"
    },
    cta: { label: "Zkus kalkulačku vyhoření", link: "/stabilita" },
  },
};