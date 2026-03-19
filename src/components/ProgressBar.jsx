/**
 * components/ProgressBar.jsx
 * ─────────────────────────────────────────────────────────────
 * Animated progress bar that tracks how many required fields
 * have been completed. Provides an accessible label.
 * ─────────────────────────────────────────────────────────────
 */
import React from 'react';
import './ProgressBar.css';

/**
 * @param {number} filled - Number of completed required fields
 * @param {number} total  - Total required fields
 */
export default function ProgressBar({ filled, total }) {
  const pct = total > 0 ? Math.round((filled / total) * 100) : 0;

  return (
    <div className="progress-wrap">
      <div className="progress-header">
        <span className="progress-label">Progress</span>
        <span className="progress-count">{filled} of {total} required fields</span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Form completion: ${pct}%`}
      >
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
