import React from 'react';
import { ArrowLeft, Clock, BookOpen } from 'lucide-react';
import { useParams, useNavigate } from "react-router-dom";
import { GlassCard } from './ui/GlassCard';
import { articles } from '../data/articles';

export const ArticleSection: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const article = articles.find(a => String(a.id) === id);

  // DETAIL ČLÁNKU
  if (article) {
    return (
      <div className="article-container fade-in" style={{ overflowX: 'clip' }}>
        <button
          onClick={() => navigate('/clanky')}
          className="back-button"
        >
          <ArrowLeft size={16} />
          Zpět na články
        </button>

        <GlassCard className="article-card">
          {/* Tady h1 sedí na tvůj globální styl automaticky */}
          <h1 className="article-title">{article.title}</h1>

          <div className="article-meta">
            <span className="category-badge">{article.category}</span>
            <span><Clock size={12} /> {article.readTime}</span>
            <span>{article.date}</span>
          </div>

          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
            onClick={(e) => {
              const target = e.target as HTMLElement;
              if (target.tagName === 'A') {
                const href = (target as HTMLAnchorElement).getAttribute('href');
                if (href?.startsWith('/')) {
                  e.preventDefault();
                  navigate(href);
                }
              }
            }}
          />
        </GlassCard>
      </div>
    );
  }

  // SEZNAM ČLÁNKŮ (LIST)
  return (
    <div className="container-max fade-in" style={{ paddingBottom: '60px', overflowX: 'clip' }}>
      
      {/* --- VYČIŠTĚNÝ ÚVOD SEZNAMU --- */}
      <div>
        <h1>Vzdělávání a strategie</h1>
        <h2>Tipy pro vaše podnikání v roce 2026</h2>
      </div>

      <div className="article-list">
        {articles.map(a => (
          <GlassCard
            key={a.id}
            onClick={() => navigate(`/clanky/${a.id}`)}
            className="list-card"
          >
            <div className="list-card-content">
              <div className="list-card-header">
                <BookOpen size={16} color="var(--primary)" />
                <span className="list-category">{a.category}</span>
              </div>

              <h3 className="list-title">{a.title}</h3>
              <p className="list-excerpt">{a.excerpt}</p>
            </div>

            <div className="list-card-footer">
              {a.readTime} • {a.date}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};