'use client';

import { useState, useEffect } from 'react';

import { useTopBrowsersAnalytics } from 'src/actions/analytics/hooks';

import { ErrorBoundary } from 'src/components/error/';

import { AppCurrentDownload } from 'src/sections/overview/app/app-current-download';

/**
 * TopBrowsersWidget displays a donut chart of top browsers by page views for the last 7 days.
 * Fetches analytics data, formats it for the AppCurrentDownload component, and wraps in an ErrorBoundary.
 *
 * @component
 * @returns {JSX.Element}
 */
export function TopBrowsersWidget() {
  const [series, setSeries] = useState([]);

  const { data, isLoading } = useTopBrowsersAnalytics();

  useEffect(() => {
    // Defensive: only set if data is an array
    if (Array.isArray(data)) {
      setSeries(data);
    } else {
      setSeries([]);
    }
  }, [data]);

  const chartData = {
    series,
    labels: Array.isArray(data) ? data.map((d) => d.label) : [],
  };

  return (
    <ErrorBoundary>
      <AppCurrentDownload
        isLoading={isLoading}
        title="Top Browsers"
        subheader="Page views by browser (last 7 days)"
        chart={chartData}
      />
    </ErrorBoundary>
  );
}
