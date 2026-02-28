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
 */
export const articles: Article[] = [
  {
    id: '1',
    title: 'Jak správně počítat ROI u digitálních projektů',
    excerpt: 'Návratnost investice není jen o číslech, ale i o čase a riziku. Naučte se, jak do výpočtů zahrnout i skryté náklady.',
    content: 'Zde by byl celý text článku o ROI...',
    category: 'finance',
    readTime: '5 min',
    date: '15. 2. 2026'
  },
  {
    id: '2',
    title: 'Hodinová sazba: Past na freelancery?',
    excerpt: 'Proč fixace na hodinovou sazbu může brzdit váš růst a jak přejít na naceňování podle hodnoty (Value-based pricing).',
    content: 'Zde by byl celý text článku o hodinové sazbě...',
    category: 'productivity',
    readTime: '7 min',
    date: '10. 2. 2026'
  }
];