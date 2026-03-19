/**
 * pages/StatsPage.jsx
 * ─────────────────────────────────────────────────────────────
 * Live statistics dashboard shown immediately after submission.
 *
 * Visualisations (all powered by react-chartjs-2 + Chart.js):
 *   1. KPI summary cards          — total, religious %, top type
 *   2. Top affected states        — custom horizontal bar chart
 *   3. Type of violence           — vertical bar chart
 *   4. Motive distribution        — doughnut chart
 *   5. Time of day                — vertical bar chart
 *   6. Gender breakdown           — doughnut chart
 *   7. Age groups                 — vertical bar chart
 *   8. Religious motive details   — vertical bar (conditional)
 *   9. Situation context          — vertical bar chart
 *  10. Monthly trend              — vertical bar chart (last 12 mo)
 *
 * Privacy: receives only aggregated counts from the API.
 * No individual records are ever passed to this component.
 * ─────────────────────────────────────────────────────────────
 */
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  defaults,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { TIME_CHART_ORDER, AGE_CHART_ORDER } from '../constants/formOptions';
import './StatsPage.css';

// ── Register Chart.js modules ─────────────────────────────────
ChartJS.register(
  CategoryScale, LinearScale, BarElement, ArcElement,
  Title, Tooltip, Legend
);

// Global Chart.js defaults
defaults.font.family = "'DM Sans', system-ui, sans-serif";
defaults.font.size   = 11;
defaults.color       = '#7A7A7A';

// ── Chart colour palette ──────────────────────────────────────
const PALETTE = [
  '#C0392B', '#E74C3C', '#F08080',
  '#922B21', '#D5DBDB', '#B2BABB',
  '#7F8C8D', '#FADBD8',
];

// ── Shared chart option factories ─────────────────────────────

const barOptions = (horizontal = false) => ({
  responsive:           true,
  maintainAspectRatio:  false,
  indexAxis:            horizontal ? 'y' : 'x',
  plugins: {
    legend: { display: false },
    tooltip: {
      padding:          8,
      backgroundColor:  '#1A1A1A',
      titleColor:       '#FAFAF8',
      bodyColor:        '#D5CFC8',
    },
  },
  scales: {
    x: {
      grid: { display: horizontal },
      ticks: { font: { size: 11 } },
    },
    y: {
      grid: { color: horizontal ? 'transparent' : '#F2EDE8' },
      ticks: { font: { size: 11 } },
    },
  },
});

const doughnutOptions = {
  responsive:          true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display:  true,
      position: 'bottom',
      labels: { font: { size: 10 }, boxWidth: 10, padding: 10 },
    },
    tooltip: {
      padding:         8,
      backgroundColor: '#1A1A1A',
    },
  },
};

// ── Helper: build Chart.js dataset ───────────────────────────
const mkBarData  = (labels, counts) => ({
  labels,
  datasets: [{
    data:            counts,
    backgroundColor: PALETTE,
    borderWidth:     0,
    borderRadius:    4,
  }],
});

const mkDoughnut = (labels, counts) => ({
  labels,
  datasets: [{
    data:            counts,
    backgroundColor: PALETTE,
    borderWidth:     2,
    borderColor:     '#FFFFFF',
    hoverOffset:     4,
  }],
});

// ── Sub-components ────────────────────────────────────────────

function ChartCard({ title, wide, tall, children }) {
  return (
    <div className={`chart-card${wide ? ' chart-card--wide' : ''}`}>
      <p className="chart-card__title">{title}</p>
      <div className={`chart-canvas${tall ? ' chart-canvas--tall' : ''}`}>
        {children}
      </div>
    </div>
  );
}

/** Horizontal bar chart built with CSS — no canvas needed. */
function HeatmapBars({ byState }) {
  if (!byState?.length) {
    return <p className="no-data">No data available yet.</p>;
  }
  const max = byState[0].count;
  return (
    <div className="heatmap">
      {byState.slice(0, 10).map(({ _id, count }) => (
        <div className="hbar" key={_id}>
          <span className="hbar__label">{_id}</span>
          <div className="hbar__track">
            <div
              className="hbar__fill"
              style={{ width: `${Math.round((count / max) * 100)}%` }}
            />
          </div>
          <span className="hbar__count">{count}</span>
        </div>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
export default function StatsPage({ stats, onNewReport }) {
  if (!stats) return null;

  const {
    summary        = {},
    byState        = [],
    byViolence     = [],
    byMotive       = [],
    byMotiveType   = [],
    byReligious    = [],
    byTime         = [],
    byGender       = [],
    byAge          = [],
    byContext      = [],
    byIncidentMonth = [],
  } = stats;

  const { total = 0, religiousPct = 0, topViolenceType = '–' } = summary;

  // Re-order time / age data for consistent chart display
  const timeData = TIME_CHART_ORDER.map(
    t => byTime.find(x => x._id === t)?.count || 0
  );
  const ageData  = AGE_CHART_ORDER.map(
    a => byAge.find(x => x._id === a)?.count || 0
  );

  // Monthly trend — sort ascending for left-to-right timeline
  const monthsSorted = [...byIncidentMonth].sort((a, b) =>
    a._id.localeCompare(b._id)
  );

  return (
    <main className="stats-page">

      {/* ── Success hero ───────────────────────────────────── */}
      <div className="stats-hero">
        <div className="success-icon" aria-hidden="true">✓</div>
        <h2 className="stats-hero__title">Report submitted.</h2>
        <p className="stats-hero__sub">
          Your report has been added anonymously to the database.
          Below is the current aggregate picture.
        </p>
        <button className="back-btn" onClick={onNewReport}>
          ← Submit another report
        </button>
      </div>

      {/* ── KPI summary cards ──────────────────────────────── */}
      <div className="kpi-row" aria-label="Summary statistics">
        <div className="kpi-card">
          <div className="kpi-card__num">{total.toLocaleString()}</div>
          <div className="kpi-card__label">Total reports</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-card__num">{religiousPct}%</div>
          <div className="kpi-card__label">Religious motive</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-card__num kpi-card__num--sm">{topViolenceType}</div>
          <div className="kpi-card__label">Most reported type</div>
        </div>
      </div>

      {/* ── Charts grid ────────────────────────────────────── */}
      <div className="charts-grid">

        {/* 1. State ranking */}
        <div className="chart-card chart-card--wide">
          <p className="chart-card__title">Top affected states</p>
          <HeatmapBars byState={byState} />
        </div>

        {/* 2. Violence types */}
        <ChartCard title="Type of violence" wide tall>
          <Bar
            data={mkBarData(byViolence.map(x => x._id), byViolence.map(x => x.count))}
            options={barOptions()}
          />
        </ChartCard>

        {/* 3. Motive distribution */}
        <ChartCard title="Motive present">
          <Doughnut
            data={mkDoughnut(byMotive.map(x => x._id), byMotive.map(x => x.count))}
            options={doughnutOptions}
          />
        </ChartCard>

        {/* 4. Time of day */}
        <ChartCard title="Time of day">
          <Bar
            data={mkBarData(TIME_CHART_ORDER, timeData)}
            options={barOptions()}
          />
        </ChartCard>

        {/* 5. Gender */}
        <ChartCard title="Gender breakdown">
          <Doughnut
            data={mkDoughnut(byGender.map(x => x._id), byGender.map(x => x.count))}
            options={doughnutOptions}
          />
        </ChartCard>

        {/* 6. Age groups */}
        <ChartCard title="Age groups">
          <Bar
            data={mkBarData(AGE_CHART_ORDER, ageData)}
            options={barOptions()}
          />
        </ChartCard>

        {/* 7. Religious details — only if data exists */}
        {byReligious.length > 0 && (
          <ChartCard title="Religious motive — how noticed" wide tall>
            <Bar
              data={mkBarData(byReligious.map(x => x._id), byReligious.map(x => x.count))}
              options={barOptions()}
            />
          </ChartCard>
        )}

        {/* 8. Motive types breakdown */}
        {byMotiveType.length > 0 && (
          <ChartCard title="Motive types (among 'Yes' reports)" wide>
            <Bar
              data={mkBarData(byMotiveType.map(x => x._id), byMotiveType.map(x => x.count))}
              options={barOptions()}
            />
          </ChartCard>
        )}

        {/* 9. Situation context */}
        <ChartCard title="Situation context" wide>
          <Bar
            data={mkBarData(byContext.map(x => x._id), byContext.map(x => x.count))}
            options={barOptions()}
          />
        </ChartCard>

        {/* 10. Monthly trend */}
        {monthsSorted.length > 1 && (
          <ChartCard title="Monthly trend (last 12 months)" wide>
            <Bar
              data={mkBarData(monthsSorted.map(x => x._id), monthsSorted.map(x => x.count))}
              options={barOptions()}
            />
          </ChartCard>
        )}

      </div>

      <p className="stats-footer">
        All statistics are aggregated. No individual report data is ever displayed or stored in a retrievable form.
      </p>

    </main>
  );
}
