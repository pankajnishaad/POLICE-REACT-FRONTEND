/**
 * constants/formOptions.js
 * ─────────────────────────────────────────────────────────────
 * Single source of truth for every option list used in the
 * reporting form.
 *
 * Keeping all options here (instead of inline in components)
 * ensures the frontend and backend stay in sync — if you add
 * an option here, just add it to the backend enum as well.
 * ─────────────────────────────────────────────────────────────
 */

export const GERMAN_STATES = [
  'Baden-Württemberg',
  'Bavaria',
  'Berlin',
  'Brandenburg',
  'Bremen',
  'Hamburg',
  'Hesse',
  'Mecklenburg-Vorpommern',
  'Lower Saxony',
  'North Rhine-Westphalia',
  'Rhineland-Palatinate',
  'Saarland',
  'Saxony',
  'Saxony-Anhalt',
  'Schleswig-Holstein',
  'Thuringia',
];

export const VIOLENCE_TYPES = [
  'Physical force',
  'Disproportionate control',
  'Discrimination',
  'Verbal abuse',
  'Detention / arrest',
  'Search / raid',
  'Other',
];

export const MOTIVE_OPTIONS = ['No', 'Unsure', 'Yes'];

export const MOTIVE_TYPES = [
  'Religious',
  'Racist',
  'Political',
  'Appearance / clothing',
  'Other',
];

export const RELIGIOUS_DETAILS = [
  'Clothing / symbols',
  'Police statements',
  'Targeted behavior',
  'Near religious site',
  'Other',
];

export const GENDERS = [
  'Female',
  'Male',
  'Non-binary',
  'Prefer not to say',
];

export const AGE_GROUPS = [
  'Under 18',
  '18–25',
  '26–40',
  '41–60',
  '60+',
];

export const CONTEXTS = [
  'Stop / control',
  'Demonstration',
  'Traffic',
  'Public space',
  'Other',
];

export const OFFICER_COUNTS = ['1', '2–3', '4+', 'Unknown'];

export const TIMES_OF_DAY = ['Morning', 'Daytime', 'Evening', 'Night'];

/** Ordered for chart display */
export const TIME_CHART_ORDER   = ['Morning', 'Daytime', 'Evening', 'Night'];
export const AGE_CHART_ORDER    = ['Under 18', '18–25', '26–40', '41–60', '60+'];
