/**
 * pages/ReportForm.jsx
 * ─────────────────────────────────────────────────────────────
 * The anonymous reporting form — 6 sections:
 *   01  Location & time
 *   02  Type of police violence  (multi-select chips)
 *   03  Possible motive          (conditional cascade)
 *   04  Person affected          (gender + age group)
 *   05  Situation & context
 *   06  Free-text description    (write-only, sanitised on backend)
 *
 * All state and submission logic lives in hooks/useReportForm.js.
 * This component is purely presentational.
 * ─────────────────────────────────────────────────────────────
 */
import React from 'react';
import SectionCard  from '../components/SectionCard';
import Field        from '../components/Field';
import { Chip, ChipGroup } from '../components/Chip';
import ProgressBar  from '../components/ProgressBar';
import useReportForm from '../hooks/useReportForm';
import {
  GERMAN_STATES, VIOLENCE_TYPES, MOTIVE_OPTIONS, MOTIVE_TYPES,
  RELIGIOUS_DETAILS, GENDERS, AGE_GROUPS, CONTEXTS, OFFICER_COUNTS,
  TIMES_OF_DAY,
} from '../constants/formOptions';
import './ReportForm.css';

export default function ReportForm({ onSuccess }) {
  const {
    form,
    set,
    toggleMulti,
    handleMotiveChange,
    handleMotiveTypeToggle,
    progress,
    loading,
    error,
    handleSubmit,
  } = useReportForm({ onSuccess });

  const charLen = form.description.length;

  return (
    <main className="report-form">

      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="hero">
        <div className="hero__badge">
          <span className="hero__dot" aria-hidden="true" />
          Anonymous Reporting · Germany
        </div>
        <h1 className="hero__title">
          Report police violence<br />
          <em>safely &amp; anonymously.</em>
        </h1>
        <p className="hero__sub">
          Help make incidents visible. No names, no email, no tracking —
          only your experience matters.
        </p>

        {/* Privacy strip */}
        <ul className="privacy-strip" aria-label="Privacy guarantees">
          {[
            { icon: '✗', type: 'no',  text: 'No IP logging'   },
            { icon: '✗', type: 'no',  text: 'No cookies'      },
            { icon: '✗', type: 'no',  text: 'No tracking'     },
            { icon: '✓', type: 'yes', text: 'Only aggregated data stored' },
          ].map(item => (
            <li className="privacy-item" key={item.text}>
              <span className={`privacy-dot privacy-dot--${item.type}`} aria-hidden="true" />
              {item.text}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Form body ─────────────────────────────────────── */}
      <div className="form-body">

        <ProgressBar filled={progress.filled} total={progress.total} />

        {/* ── 01  Location & Time ──────────────────────────── */}
        <SectionCard num={1} title="Location & time">

          <Field label="Federal state" required>
            <select
              value={form.state}
              onChange={e => set('state', e.target.value)}
              aria-required="true"
            >
              <option value="">Select state...</option>
              {GERMAN_STATES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>

          <Field label="City / region" optional>
            <input
              type="text"
              value={form.cityRegion}
              onChange={e => set('cityRegion', e.target.value)}
              placeholder="e.g. Munich north, Rhine area…"
              maxLength={60}
            />
          </Field>

          <Field label="Month & year of incident" required>
            <input
              type="month"
              value={form.incidentMonth}
              onChange={e => set('incidentMonth', e.target.value)}
              aria-required="true"
            />
          </Field>

          <Field label="Time of day" required>
            <ChipGroup aria-label="Time of day">
              {TIMES_OF_DAY.map(t => (
                <Chip
                  key={t}
                  label={t}
                  selected={form.timeOfDay === t}
                  onClick={() => set('timeOfDay', form.timeOfDay === t ? '' : t)}
                />
              ))}
            </ChipGroup>
          </Field>

        </SectionCard>

        {/* ── 02  Type of Violence ──────────────────────────── */}
        <SectionCard num={2} title="Type of police violence">
          <p className="section-hint">Select all that apply.</p>
          <ChipGroup>
            {VIOLENCE_TYPES.map(v => (
              <Chip
                key={v}
                label={v}
                selected={form.violenceTypes.includes(v)}
                onClick={() => toggleMulti('violenceTypes', v)}
              />
            ))}
          </ChipGroup>
        </SectionCard>

        {/* ── 03  Motive ────────────────────────────────────── */}
        <SectionCard num={3} title="Possible motive">

          <Field label="Do you believe a motive was present?" required>
            <ChipGroup>
              {MOTIVE_OPTIONS.map(opt => (
                <Chip
                  key={opt}
                  label={opt}
                  selected={form.motivePresent === opt}
                  onClick={() => handleMotiveChange(opt)}
                />
              ))}
            </ChipGroup>
          </Field>

          {/* Level 1 conditional: motive types */}
          {form.motivePresent === 'Yes' && (
            <div className="conditional">
              <p className="conditional__label">
                Type of motive <span className="hint">(select all that apply)</span>
              </p>
              <ChipGroup>
                {MOTIVE_TYPES.map(m => (
                  <Chip
                    key={m}
                    label={m}
                    selected={form.motiveTypes.includes(m)}
                    onClick={() => handleMotiveTypeToggle(m)}
                  />
                ))}
              </ChipGroup>

              {/* Level 2 conditional: religious details */}
              {form.motiveTypes.includes('Religious') && (
                <div className="conditional conditional--nested">
                  <p className="conditional__label">
                    How did you notice the religious motive?{' '}
                    <span className="hint">(select all that apply)</span>
                  </p>
                  <ChipGroup>
                    {RELIGIOUS_DETAILS.map(d => (
                      <Chip
                        key={d}
                        label={d}
                        selected={form.religiousDetails.includes(d)}
                        onClick={() => toggleMulti('religiousDetails', d)}
                      />
                    ))}
                  </ChipGroup>
                </div>
              )}
            </div>
          )}

        </SectionCard>

        {/* ── 04  Victim details ────────────────────────────── */}
        <SectionCard num={4} title="About the person affected">

          <Field label="Gender" required>
            <ChipGroup>
              {GENDERS.map(g => (
                <Chip
                  key={g}
                  label={g}
                  selected={form.gender === g}
                  onClick={() => set('gender', form.gender === g ? '' : g)}
                />
              ))}
            </ChipGroup>
          </Field>

          <Field label="Age group" required>
            <ChipGroup>
              {AGE_GROUPS.map(a => (
                <Chip
                  key={a}
                  label={a}
                  selected={form.ageGroup === a}
                  onClick={() => set('ageGroup', form.ageGroup === a ? '' : a)}
                />
              ))}
            </ChipGroup>
          </Field>

        </SectionCard>

        {/* ── 05  Situation & Context ───────────────────────── */}
        <SectionCard num={5} title="Situation & context">

          <Field label="Occasion / context" required>
            <ChipGroup>
              {CONTEXTS.map(c => (
                <Chip
                  key={c}
                  label={c}
                  selected={form.context === c}
                  onClick={() => set('context', form.context === c ? '' : c)}
                />
              ))}
            </ChipGroup>
          </Field>

          <Field label="Number of officers involved" required>
            <ChipGroup>
              {OFFICER_COUNTS.map(o => (
                <Chip
                  key={o}
                  label={o}
                  selected={form.officerCount === o}
                  onClick={() => set('officerCount', form.officerCount === o ? '' : o)}
                />
              ))}
            </ChipGroup>
          </Field>

        </SectionCard>

        {/* ── 06  Free Text ─────────────────────────────────── */}
        <SectionCard num={6} title="Describe what happened">

          <div className="warn-box" role="alert">
            <strong>Important:</strong> Do NOT include names, badge numbers, or any
            identifying details. Your description is automatically filtered before storage.
          </div>

          <Field>
            <textarea
              className="desc-textarea"
              value={form.description}
              onChange={e => set('description', e.target.value)}
              maxLength={800}
              rows={5}
              placeholder="Describe the incident briefly in your own words. Stay factual. No personal identifiers."
              aria-label="Incident description"
            />
            <div className={`char-count${charLen > 700 ? ' char-count--warn' : ''}`}>
              {charLen} / 800 characters
            </div>
          </Field>

        </SectionCard>

        {/* ── Submit ───────────────────────────────────────── */}
        <div className="submit-wrap">
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? 'Submitting…' : 'Submit Anonymously'}
          </button>
          <p className="submit-note">
            This form is not a substitute for emergency services.
            Call <strong>112</strong> in life-threatening situations.
          </p>
          {error && (
            <p className="submit-error" role="alert">{error}</p>
          )}
        </div>

      </div>
    </main>
  );
}
