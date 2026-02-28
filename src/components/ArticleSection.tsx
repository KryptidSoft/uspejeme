import React, { useState } from 'react';
import { BookOpen, ArrowLeft, Clock } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { articles, type Article } from '../data/articles';

export const ArticleSection: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  if (selectedArticle) {
    return (
      <GlassCard className="article-detail">
        <button className="text-link" onClick={() => setSelectedArticle(null)} style={{ marginBottom: '1rem' }}>
          <ArrowLeft size={16} /> Zpět na seznam
        </button>
        <h1>{selectedArticle.title}</h1>
        <div className="article-meta">
          <span className="category-badge">{selectedArticle.category}</span>
          <span><Clock size={14} /> {selectedArticle.readTime} čtení</span>
        </div>
        <div className="article-body">
          {selectedArticle.content.split('\n').map((para, i) => <p key={i}>{para}</p>)}
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="articles-grid">
      {articles.map(article => (
        <GlassCard key={article.id} className="clickable" onClick={() => setSelectedArticle(article)}>
          <div className="article-card-content">
            <BookOpen size={20} className="accent-text" />
            <span className="category-tag">{article.category}</span>
            <h3>{article.title}</h3>
            <p>{article.excerpt}</p>
            <div className="article-footer">
              <span>{article.readTime}</span>
              <span className="read-more">Číst více →</span>
            </div>
          </div>
        </GlassCard>
      ))}
      <style>{`
        .articles-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
        .article-card-content h3 { margin: 0.5rem 0; font-size: 1.2rem; }
        .article-card-content p { font-size: 0.85rem; color: var(--text-dim); line-height: 1.5; }
        .category-tag { font-size: 0.7rem; text-transform: uppercase; color: var(--accent); font-weight: bold; }
        .article-footer { display: flex; justify-content: space-between; margin-top: 1rem; font-size: 0.8rem; color: var(--text-dim); }
        .read-more { color: var(--accent); font-weight: bold; }
        
        .article-meta { display: flex; gap: 1rem; align-items: center; margin-bottom: 2rem; color: var(--text-dim); font-size: 0.9rem; }
        .category-badge { background: var(--accent); color: white; padding: 2px 8px; border-radius: 4px; text-transform: capitalize; }
        .article-body { line-height: 1.8; color: var(--text-main); }
      `}</style>
    </div>
  );
};