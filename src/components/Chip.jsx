/**
 * components/Chip.jsx
 * ─────────────────────────────────────────────────────────────
 * Reusable pill-shaped toggle chip components.
 *
 * ChipGroup  — flex container for a set of chips
 * Chip       — individual toggle button (single or multi-select)
 *
 * Accessibility: uses <button type="button"> with aria-pressed
 * so screen readers announce selected state correctly.
 * ─────────────────────────────────────────────────────────────
 */
import React from 'react';
import './Chip.css';

/** Wrapper that lays chips out in a wrapping flex row. */
export function ChipGroup({ children, className = '' }) {
  return (
    <div className={`chip-group ${className}`} role="group">
      {children}
    </div>
  );
}

/**
 * Individual toggleable chip / pill button.
 * @param {string}   label    - Display text
 * @param {boolean}  selected - Whether chip is currently active
 * @param {Function} onClick  - Toggle callback
 */
export function Chip({ label, selected, onClick }) {
  return (
    <button
      type="button"
      className={`chip${selected ? ' chip--on' : ''}`}
      onClick={onClick}
      aria-pressed={selected}
    >
      {label}
    </button>
  );
}
