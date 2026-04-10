import React from 'react';
import { Users, Target, Rocket } from 'lucide-react';

export const AboutUs: React.FC = () => {
  return (
    <div className="article-container">
      <h1 className="article-title">O nás</h1>
      <p className="article-content lead">
        Jsme komunita a platforma pro svobodné profesionály, kteří chtějí mít své finance a strategii pod kontrolou.
      </p>

      <div className="info-grid" style={{ marginTop: '30px' }}>
        <div className="info-box">
          <h3 className="flex items-center gap-2">
            <Target size={20} /> Naše vize
          </h3>
          <p className="article-content">
            Demokratizovat přístup k pokročilým finančním nástrojům a strategiím, které byly dříve dostupné jen velkým korporacím.
          </p>
        </div>

        <div className="info-box">
          <h3 className="flex items-center gap-2">
            <Users size={20} /> Pro koho tu jsme
          </h3>
          <p className="article-content">
            Pro freelancery, OSVČ a malé podnikatele, kteří nechtějí jen "přežívat", ale chtějí budovat udržitelnou prosperitu.
          </p>
        </div>

        <div className="info-box">
          <h3 className="flex items-center gap-2">
            <Rocket size={20} /> Náš přístup
          </h3>
          <p className="article-content">
            Stavíme na datech, jednoduchosti a praktické využitelnosti. Každý nástroj v naší aplikaci má za cíl ušetřit vám čas nebo peníze.
          </p>
        </div>
      </div>
    </div>
  );
};