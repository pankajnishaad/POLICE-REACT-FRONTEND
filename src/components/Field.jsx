/**
 * components/Field.jsx
 * ─────────────────────────────────────────────────────────────
 * Form field wrapper: renders a label (with optional/required
 * badges) above whatever children are passed in.
 *
 * Keeps label rendering consistent across all 6 form sections.
 * ─────────────────────────────────────────────────────────────
 */
import React from 'react';
import './Field.css';

/**
 * @param {string}  label    - Field label text
 * @param {boolean} required - Shows a red asterisk
 * @param {boolean} optional - Shows a muted "(optional)" hint
 * @param {node}    children - The input / chip group / textarea
 */
export default function Field({ label, required, optional, children }) {
  return (
    <div className="field">
      {label && (
        <label className="field__label">
          {label}
          {required && <span className="field__req" aria-label="required"> *</span>}
          {optional && <span className="field__opt"> (optional — rough only)</span>}
        </label>
      )}
      {children}
    </div>
  );
}
