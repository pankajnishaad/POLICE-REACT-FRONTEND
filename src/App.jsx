/**
 * App.jsx
 * ─────────────────────────────────────────────────────────────
 * Root component. Owns the single page-level state toggle
 * between the report form and the statistics dashboard.
 *
 * No routing library is needed — the app has exactly two views:
 *   'form'  → ReportForm
 *   'stats' → StatsPage
 * ─────────────────────────────────────────────────────────────
 */
import React, { useState, useCallback } from 'react';
import Navbar     from './components/Navbar';
import ReportForm from './pages/ReportForm';
import StatsPage  from './pages/StatsPage';

export default function App() {
  const [page,      setPage]      = useState('form');
  const [statsData, setStatsData] = useState(null);

  /** Called by ReportForm after successful submit + stats fetch */
  const handleSubmitSuccess = useCallback((data) => {
    setStatsData(data);
    setPage('stats');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /** Called by StatsPage "submit another" button */
  const handleNewReport = useCallback(() => {
    setPage('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <Navbar />
      {page === 'form' ? (
        <ReportForm onSuccess={handleSubmitSuccess} />
      ) : (
        <StatsPage stats={statsData} onNewReport={handleNewReport} />
      )}
    </>
  );
}
