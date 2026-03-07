export interface Article {
  id: string;
  title: string;
  excerpt: string; // <-- Důležité: používáme název excerpt
  content: string;
  category: 'finance' | 'productivity' | 'strategy';
  readTime: string;
  date: string;
}
