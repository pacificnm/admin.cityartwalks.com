import { useState, useEffect } from 'react';

import { useWeeklyUserAnalytics } from 'src/actions/analytics/hooks';

import { ErrorBoundary } from 'src/components/error/';

import { AppWidgetSummary } from 'src/sections/overview/app/app-widget-summary';

/**
 * WeeklyUsersWidget displays a summary card of total active users for the week.
 * Fetches weekly user analytics, aggregates totals, and renders an AppWidgetSummary inside an ErrorBoundary.
 *
 * @component
 * @returns {JSX.Element}
 */
export function WeeklyUsersWidget() {
  const [categories, setCategories] = useState([]);
  const [series, setSeries] = useState([]);
  const [total, setTotal] = useState(0);

  const { data, isLoading } = useWeeklyUserAnalytics();

  useEffect(() => {
    if (data) {
      const newCategories = data.map((d) => d.date);
      const newSeries = data.map((d) => d.count);
      const totalUsers = newSeries.reduce((sum, val) => sum + val, 0);

      setCategories(newCategories);
      setSeries(newSeries);
      setTotal(totalUsers);
    }
  }, [data]);

  return (
    <ErrorBoundary>
      <AppWidgetSummary
        isLoading={isLoading}
        title="Total active users"
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
