'use client';

import { useState, useEffect } from 'react';

import { useTopPageViewSegments } from 'src/actions/analytics/hooks';

import { ErrorBoundary } from 'src/components/error/';

import { AppAreaInstalled } from 'src/sections/overview/app/app-area-installed';

export function TopPagesWidget() {
  const [categories, setCategories] = useState([]);
  const [series, setSeries] = useState([]);

  const { data, isLoading } = useTopPageViewSegments();

  useEffect(() => {
    if (!Array.isArray(data.series)) return;

    const fetchedCategories = data.categories || [];

    // Flatten data for ApexCharts
    const flatData = data.series?.[0]?.data?.map((d) => d?.value ?? 0) || [];

    setCategories(fetchedCategories);
    setSeries([
      {
        name: 'Top Pages',
        data: flatData,
      },
    ]);
  }, [data.categories, data.series, data.success]);

  return (
    <ErrorBoundary>
      <AppAreaInstalled
        isLoading={isLoading}
        title="Top Pages"
        subheader="By view count (last 7 days)"
        chart={{
          categories: categories.length ? categories : [],
          series: series.length
            ? series
            : [
                {
                  name: 'Top Pages',
                  data: [],
                },
              ],
        }}
      />
    </ErrorBoundary>
  );
}
