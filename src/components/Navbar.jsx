/**
 * components/Navbar.jsx
 * ─────────────────────────────────────────────────────────────
 * Sticky top navigation bar.
 * Shows brand name with animated pulse dot and anonymity tag.
 * ─────────────────────────────────────────────────────────────
 */
import React from 'react';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar" role="banner">
      <div className="navbar__brand">
        <span className="navbar__pulse" aria-hidden="true" />
        <span>Melde Polizeigewalt</span>
      </div>
      <span className="navbar__tag">
        Vollständig anonym · Completely anonymous
      </span>
    </nav>
  );
}
