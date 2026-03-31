import React from 'react';
import { BookOpen, ArrowLeft, Clock } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { articles } from '../data/articles';
import { useParams, useNavigate } from "react-router-dom";

export const ArticleSection: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const selectedArticle = id ? articles.find(a => String(a.id) === id) || null : null;

  // DETAIL ČLÁNKU
  if (selectedArticle) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
        <button 
          onClick={() => navigate('/articles')}
          style={{
            marginBottom: '25px',
            background: 'none',
            border: 'none',
            color: 'var(--primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 600,
            fontSize: '0.95rem'
          }}
        >
          <ArrowLeft size={16} /> Zpět na seznam
        </button>

        <GlassCard style={{ padding: '35px', borderRadius: '15px', lineHeight: 1.8 }}>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '15px', fontWeight: 900 }}>
            {selectedArticle.title}
          </h1>

          <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', opacity: 0.75, fontSize: '0.9rem', flexWrap: 'wrap' }}>
            <span style={{ textTransform: 'uppercase', fontWeight: 700, background: 'var(--primary-soft)', padding: '2px 8px', borderRadius: '5px' }}>
              {selectedArticle.category}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={14} /> {selectedArticle.readTime} čtení
            </span>
            <span style={{ fontStyle: 'italic', color: 'var(--text-dim)' }}>
              {selectedArticle.date}
            </span>
          </div>

          <div
  style={{ fontSize: '1rem', color: 'var(--text-light)' }}
  onClick={(e) => {
    const target = e.target as HTMLElement;
    const link = target.closest("a");

    if (!link) return;

    const href = link.getAttribute("href");

    if (href && href.startsWith("/")) {
      e.preventDefault();
      navigate(href);
    }
  }}
  dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
/>
        </GlassCard>
      </div>
    );
  }

  // SEZNAM ČLÁNKŮ
  return (
  <div className="app-container" style={{ 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', 
    gap: '25px',
    paddingTop: '20px',    // Horní odsazení, aby to nebylo pod lištou
    paddingBottom: '20px', // Spodní odsazení
    alignItems: 'stretch' 
  }}>
      {articles.map(article => (
        <GlassCard 
          key={article.id} 
          onClick={() => navigate(`/articles/${article.id}`)}
          className="hover-card"
          style={{
            cursor: 'pointer',
            padding: '25px',
            borderRadius: '15px',
            transition: 'all 0.2s',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '220px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <BookOpen size={20} color="var(--primary)" />
              <span style={{ textTransform: 'uppercase', fontWeight: 700, fontSize: '0.75rem', background: 'var(--primary-soft)', padding: '2px 6px', borderRadius: '5px' }}>
                {article.category}
              </span>
            </div>

            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.3 }}>
              {article.title}
            </h3>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '10px', minHeight: '45px' }}>
              {article.excerpt}
            </p>

            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
              {article.date}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', opacity: 0.85, alignItems: 'center', marginTop: '15px' }}>
            <span>{article.readTime}</span>
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Číst více →</span>
          </div>
        </GlassCard>
      ))}
    </div>
  );
};