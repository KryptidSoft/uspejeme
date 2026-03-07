import React, { useState } from 'react';
import { BookOpen, ArrowLeft, Clock } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';

// 1. DEFINICE TYPU (aby TypeScript věděl, co článek obsahuje)
export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'finance' | 'productivity' | 'strategy';
  readTime: string;
  date: string;
}

// 2. DATA ČLÁNKŮ (přímo zde v souboru)
export const articles: Article[] = [
  {
    id: '0',
    title: 'Vítejte na Rozhodni.cz!',
    excerpt: 'OSVČ tvoří páteř ekonomiky, přesto většina z nás riskuje svou budoucnost špatným naceňováním.',
    category: 'strategy',
    readTime: '4 min',
    date: '28. 02. 2026',
    content: `V České republice jsou statisíce OSVČ. Jsme programátoři, řemeslníci, kreativci i konzultanti... (zde je váš dlouhý text)...`
  },
  {
    id: '1',
    title: 'Jak správně počítat ROI u digitálních projektů',
    excerpt: 'Návratnost investice není jen o číslech, ale i o čase a riziku.',
    content: 'Zde je detailní rozbor výpočtu ROI...',
    category: 'finance',
    readTime: '5 min',
    date: '15. 02. 2026'
  },
  {
    id: '2',
    title: 'Hodinová sazba: Past na freelancery?',
    excerpt: 'Proč fixace na hodinovou sazbu může brzdit váš růst.',
    content: 'Prodávat svůj čas je nejjednodušší cesta...',
    category: 'productivity',
    readTime: '7 min',
    date: '10. 02. 2026'
  }
];

export const ArticleSection: React.FC<{ initialArticleId?: string | null }> = ({ initialArticleId }) => {
  
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(
    initialArticleId ? articles.find(a => a.id === initialArticleId) || null : null
  );

  React.useEffect(() => {
    if (initialArticleId) {
      const article = articles.find(a => a.id === initialArticleId);
      if (article) setSelectedArticle(article);
    }
  }, [initialArticleId]);

  // Zobrazení detailu jednoho článku
  if (selectedArticle) {
    return (
      <GlassCard className="article-detail" style={{ padding: '30px' }}>
        <button 
          onClick={() => setSelectedArticle(null)} 
          style={{ marginBottom: '20px', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: 0 }}
        >
          <ArrowLeft size={16} /> Zpět na seznam
        </button>
        <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>{selectedArticle.title}</h1>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', opacity: 0.7, fontSize: '0.9rem' }}>
          <span>{selectedArticle.category}</span>
          <span><Clock size={14} style={{ verticalAlign: 'middle' }} /> {selectedArticle.readTime} čtení</span>
        </div>
        <div style={{ lineHeight: '1.8', whiteSpace: 'pre-line' }}>
          {selectedArticle.content}
        </div>
      </GlassCard>
    );
  }

  // Zobrazení mřížky všech článků
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
      {articles.map((article) => (
        <GlassCard 
          key={article.id} 
          onClick={() => setSelectedArticle(article)} 
          style={{ cursor: 'pointer', padding: '20px' }}
          className="hover-card"
        >
          <BookOpen size={20} color="var(--primary)" />
          <h3 style={{ margin: '15px 0 10px' }}>{article.title}</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '20px' }}>{article.excerpt}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', opacity: 0.8 }}>
            <span>{article.readTime}</span>
            <span style={{ color: 'var(--primary)' }}>Číst více →</span>
          </div>
        </GlassCard>
      ))}
    </div>
  );
};