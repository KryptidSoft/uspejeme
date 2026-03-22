import React from 'react';
import { Users, Target, Rocket } from 'lucide-react';

export const AboutUs: React.FC = () => {
  return (
    <div className="legal-content" style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>O nás</h1>
      <p className="lead">Jsme komunita a platforma pro svobodné profesionály, kteří chtějí mít své finance a strategii pod kontrolou.</p>
      
      <div style={{ marginTop: '30px', display: 'grid', gap: '25px' }}>
        <section>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Target size={20} /> Naše vize</h3>
          <p>Demokratizovat přístup k pokročilým finančním nástrojům a strategiím, které byly dříve dostupné jen velkým korporacím.</p>
        </section>

        <section>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Users size={20} /> Pro koho tu jsme</h3>
          <p>Pro freelancery, OSVČ a malé podnikatele, kteří nechtějí jen "přežívat", ale chtějí budovat udržitelnou prosperitu.</p>
        </section>

        <section>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Rocket size={20} /> Náš přístup</h3>
          <p>Stavíme na datech, jednoduchosti a praktické využitelnosti. Každý nástroj v naší aplikaci má za cíl ušetřit vám čas nebo peníze.</p>
        </section>
      </div>
    </div>
  );
};