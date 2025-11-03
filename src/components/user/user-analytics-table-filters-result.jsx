import { useMemo, useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

export function UserAnalyticsTableFiltersResult({
  filters,
  onResetPage,
  totalResults,
  onClearFilters,
  sx,
}) {
  // Support both old and new filter prop shapes
  const currentFilters = filters?.state ||
    filters || { name: '', event: 'all', dateRange: [null, null] };
  const updateFilters = useMemo(() => filters?.setState || (() => {}), [filters?.setState]);

  const handleRemoveKeyword = useCallback(() => {
    onResetPage && onResetPage();
    updateFilters((prev) => ({ ...prev, name: '' }));
  }, [onResetPage, updateFilters]);

  const handleRemoveEvent = useCallback(() => {
    onResetPage && onResetPage();
    updateFilters((prev) => ({ ...prev, event: 'all' }));
  }, [onResetPage, updateFilters]);

  const handleRemoveDateRange = useCallback(() => {
    onResetPage && onResetPage();
    updateFilters((prev) => ({ ...prev, dateRange: [null, null] }));
  }, [onResetPage, updateFilters]);

  const handleClearAll = useCallback(() => {
    onResetPage && onResetPage();
    onClearFilters && onClearFilters();
  }, [onResetPage, onClearFilters]);

  // Defensive: always treat dateRange as [start, end]
  const dateRange = Array.isArray(currentFilters.dateRange)
    ? currentFilters.dateRange
    : [null, null];
  const [start, end] = dateRange;

  // Only show if at least one filter is active
  const hasActiveFilters =
    (!!currentFilters.event && currentFilters.event !== 'all') ||
    !!currentFilters.name ||
    (!!start && !!end);

  if (!hasActiveFilters) return null;

  return (
    <FiltersResult totalResults={totalResults} onReset={handleClearAll} sx={sx}>
      <FiltersBlock
        label="Event:"
        isShow={!!currentFilters.event && currentFilters.event !== 'all'}
      >
        <Chip
          {...chipProps}
          label={currentFilters.event}
          onDelete={handleRemoveEvent}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>

      {/* Show date range as a chip if both dates are set */}
      <FiltersBlock label="Date Range:" isShow={!!start && !!end}>
        {!!start && !!end && (
          <Chip
            {...chipProps}
            label={`${start} - ${end}`}
            onDelete={handleRemoveDateRange}
            sx={{ ml: 1 }}
          />
        )}
      </FiltersBlock>

      <FiltersBlock label="Keyword:" isShow={!!currentFilters.name}>
        <Chip {...chipProps} label={currentFilters.name} onDelete={handleRemoveKeyword} />
      </FiltersBlock>
    </FiltersResult>
  );
}
