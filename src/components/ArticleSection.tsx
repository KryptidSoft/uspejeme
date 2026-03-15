import React from 'react'; 
import { BookOpen, ArrowLeft, Clock } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { articles } from '../data/articles';
import type { Article } from '../data/articles';
import { useParams, useNavigate } from "react-router-dom";

export const ArticleSection: React.FC = () => {
  const { id } = useParams();       // URL parametr
  const navigate = useNavigate();   // navigace

  // Najdeme článek podle id
  const selectedArticle = id ? articles.find(a => String(a.id) === id) || null : null;

  // DETAIL ČLÁNKU
  if (selectedArticle) {
    return (
      <GlassCard className="article-detail" style={{ padding: '30px' }}>
        {/* Tlačítko zpět */}
        <button 
          onClick={() => navigate('/articles')}
          style={{
            marginBottom: '20px', 
            background: 'none', 
            border: 'none', 
            color: 'var(--primary)', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: 0
          }}
        >
          <ArrowLeft size={16} /> Zpět na seznam
        </button>

        {/* Nadpis */}
        <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>
          {selectedArticle.title}
        </h1>

        {/* Kategorie a čas čtení */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', opacity: 0.7, fontSize: '0.9rem' }}>
          <span>{selectedArticle.category}</span>
          <span><Clock size={14} style={{ verticalAlign: 'middle' }} /> {selectedArticle.readTime} čtení</span>
        </div>

        {/* Obsah článku – HTML se vykreslí správně */}
        <div style={{ lineHeight: '1.8' }}
             dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
        />
      </GlassCard>
    );
  }

  // SEZNAM ČLÁNKŮ
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
      {articles.map(article => (
        <GlassCard 
          key={article.id} 
          onClick={() => navigate(`/articles/${article.id}`)}  // Navigace na detail
          style={{ cursor: 'pointer', padding: '20px' }}
          className="hover-card"
        >
          <BookOpen size={20} color="var(--primary)" />
          <h3 style={{ margin: '15px 0 10px' }}>{article.title}</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '20px' }}>
            {article.excerpt}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', opacity: 0.8 }}>
            <span>{article.readTime}</span>
            <span style={{ color: 'var(--primary)' }}>Číst více →</span>
          </div>
        </GlassCard>
      ))}
    </div>
  );
};