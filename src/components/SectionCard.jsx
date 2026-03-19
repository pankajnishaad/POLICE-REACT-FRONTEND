/**
 * components/SectionCard.jsx
 * ─────────────────────────────────────────────────────────────
 * White card with a numbered section label and title.
 * Used as the visual container for each of the 6 form sections.
 * ─────────────────────────────────────────────────────────────
 */
import React from 'react';
import './SectionCard.css';

/**
 * @param {number} num      - Section number (1–6)
 * @param {string} title    - Section heading text
 * @param {node}   children - Form fields inside the card
 */
export default function SectionCard({ num, title, children }) {
  return (
    <section className="section-card" aria-label={`Section ${num}: ${title}`}>
      <div className="section-card__num" aria-hidden="true">
        Section {String(num).padStart(2, '0')}
      </div>
      <h2 className="section-card__title">{title}</h2>
      {children}
    </section>
  );
}
