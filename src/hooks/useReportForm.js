/**
 * hooks/useReportForm.js
 * ─────────────────────────────────────────────────────────────
 * Custom React hook that owns all state and business logic
 * for the anonymous report form.
 *
 * Separating this from the UI component keeps ReportForm.jsx
 * purely presentational and makes the logic independently
 * testable.
 *
 * Exports:
 *  - form          : current form values
 *  - set(key, val) : update a single-value field
 *  - toggleMulti   : toggle an item in an array field
 *  - handleMotiveChange      : motive field + cascade reset
 *  - handleMotiveTypeToggle  : motive type + religious cascade
 *  - progress      : { filled, total } for the progress bar
 *  - validate()    : returns an error string or null
 *  - loading, error
 *  - handleSubmit  : calls API, invokes onSuccess callback
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useCallback, useMemo } from 'react';
import { submitReport, fetchStats } from '../utils/api';

// ── Initial state ─────────────────────────────────────────────
const INITIAL_FORM = {
  state:            '',
  cityRegion:       '',
  incidentMonth:    '',
  timeOfDay:        '',
  violenceTypes:    [],
  motivePresent:    '',
  motiveTypes:      [],
  religiousDetails: [],
  gender:           '',
  ageGroup:         '',
  context:          '',
  officerCount:     '',
  description:      '',
};

const TOTAL_REQUIRED = 7;

// ── Validation ────────────────────────────────────────────────
const validate = (form) => {
  if (!form.state)               return 'Please select a federal state.';
  if (!form.incidentMonth)       return 'Please select the month and year of the incident.';
  if (!form.timeOfDay)           return 'Please select a time of day.';
  if (!form.violenceTypes.length)return 'Please select at least one type of violence.';
  if (!form.motivePresent)       return 'Please indicate whether a motive was present.';
  if (!form.gender)              return 'Please select a gender.';
  if (!form.context)             return 'Please select the situation context.';
  if (!form.officerCount)        return 'Please select the number of officers involved.';
  return null;
};

// ── Count filled required fields (for progress bar) ───────────
const countFilled = (form) => {
  let n = 0;
  if (form.state)                n++;
  if (form.incidentMonth)        n++;
  if (form.timeOfDay)            n++;
  if (form.violenceTypes.length) n++;
  if (form.motivePresent)        n++;
  if (form.gender)               n++;
  if (form.context)              n++;
  return n;
};

// ── Hook ──────────────────────────────────────────────────────
export default function useReportForm({ onSuccess }) {
  const [form,    setForm]    = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  /** Update any single-value field */
  const set = useCallback((key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
  }, []);

  /** Toggle an item inside an array field (multi-select chips) */
  const toggleMulti = useCallback((key, val) => {
    setForm(prev => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(val)
          ? arr.filter(v => v !== val)
          : [...arr, val],
      };
    });
  }, []);

  /**
   * Handle the top-level "motive present?" field.
   * Resets dependent fields when user picks No / Unsure.
   */
  const handleMotiveChange = useCallback((val) => {
    setForm(prev => ({
      ...prev,
      motivePresent:    val,
      motiveTypes:      val === 'Yes' ? prev.motiveTypes : [],
      religiousDetails: val === 'Yes' ? prev.religiousDetails : [],
    }));
  }, []);

  /**
   * Handle motive type chips (multi-select).
   * Clears religiousDetails when "Religious" is deselected.
   */
  const handleMotiveTypeToggle = useCallback((val) => {
    setForm(prev => {
      const arr  = prev.motiveTypes;
      const next = arr.includes(val)
        ? arr.filter(v => v !== val)
        : [...arr, val];
      return {
        ...prev,
        motiveTypes:      next,
        religiousDetails: next.includes('Religious') ? prev.religiousDetails : [],
      };
    });
  }, []);

  /** Derived progress value */
  const progress = useMemo(() => ({
    filled: countFilled(form),
    total:  TOTAL_REQUIRED,
  }), [form]);

  /** Submit: validate → POST report → GET stats → callback */
  const handleSubmit = useCallback(async () => {
    setError('');
    const validationError = validate(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await submitReport(form);
      const statsResponse = await fetchStats();
      onSuccess(statsResponse.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [form, onSuccess]);

  return {
    form,
    set,
    toggleMulti,
    handleMotiveChange,
    handleMotiveTypeToggle,
    progress,
    loading,
    error,
    handleSubmit,
  };
}
