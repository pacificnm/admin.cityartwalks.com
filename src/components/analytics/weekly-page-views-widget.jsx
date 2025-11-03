'use client';

import { useState, useEffect } from 'react';

import { useWeeklyPageviewAnalytics } from 'src/actions/analytics/hooks';

import { ErrorBoundary } from 'src/components/error/';

import { AppWidgetSummary } from 'src/sections/overview/app/app-widget-summary';

/**
 * WeeklyPageViewsWidget displays a summary card of total page views for the week.
 * Fetches weekly pageview analytics, aggregates totals, and renders an AppWidgetSummary inside an ErrorBoundary.
 *
 * @component
 * @returns {JSX.Element}
 */

export function WeeklyPageViewsWidget() {
  const [categories, setCategories] = useState([]);
  const [series, setSeries] = useState([]);
  const [total, setTotal] = useState(0);

  const { data, isLoading } = useWeeklyPageviewAnalytics();

  useEffect(() => {
    if (data) {
      const newCategories = data.map((d) => d.date);
      const newSeries = data.map((d) => d.count);
      const totalViews = newSeries.reduce((sum, val) => sum + val, 0);

      setCategories(newCategories);
      setSeries(newSeries);
      setTotal(totalViews);
    }
  }, [data]);

  return (
    <ErrorBoundary>
      <AppWidgetSummary
        isLoading={isLoading}
        title="Page views"
        percent={0}
        total={total}
        chart={{
          categories: categories.length ? categories : [],
          series: series.length ? series : [],
        }}
      />
    </ErrorBoundary>
  );
}
