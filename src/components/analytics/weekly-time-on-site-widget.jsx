'use client';

import { useState, useEffect } from 'react';

import { useWeeklyTimeOnSiteAnalytics } from 'src/actions/analytics/hooks';

import { ErrorBoundary } from 'src/components/error/';

import { AppWidgetSummary } from 'src/sections/overview/app/app-widget-summary';

export function WeeklyTimeOnSiteWidget() {
  const [categories, setCategories] = useState([]);
  const [series, setSeries] = useState([]);
  const [average, setAverage] = useState(0);

  const { data, isLoading } = useWeeklyTimeOnSiteAnalytics();

  useEffect(() => {
    if (data) {
      if (!Array.isArray(data.results)) return;

      // Use data.results for chart, not data directly
      const newCategories = data.results.map((d) => d.date);
      const newSeries = data.results.map((d) =>
        Number.isFinite(d.avgTime) ? Math.round(d.avgTime) : 0
      );

      const safeAverage = Number.isFinite(data.average) ? Math.round(data.average) : 0;

      setCategories(newCategories);
      setSeries(newSeries);
      setAverage(safeAverage);
    }
  }, [data]);

  const formatTime = (seconds) => {
    const safeSeconds = Number.isFinite(seconds) ? seconds : 0;
    const m = Math.floor(safeSeconds / 60);
    const s = Math.floor(safeSeconds % 60);
    return `${m}m ${s}s`;
  };

  return (
    <ErrorBoundary>
      <AppWidgetSummary
        isLoading={isLoading}
        title="Avg Time on Site"
        total={formatTime(average || 0)}
        percent={0}
        chart={{
          categories: categories.length ? categories : [],
          series: series.length ? series : [],
        }}
      />
    </ErrorBoundary>
  );
}
