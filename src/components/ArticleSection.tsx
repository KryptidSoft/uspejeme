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
      {articles.map((article, index) => (
        <GlassCard key={article.id} onClick={() => setSelectedArticle(article)} style={{ animationDelay: `${index * 0.05}s` }} className="fade-in">
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
    </div>
  );
};