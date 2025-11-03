import { useMemo, useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

export function UserTableFiltersResult({ filters, onResetPage, totalResults, onClearFilters, sx }) {
  // Support both old and new filter prop shapes
  const currentFilters = filters?.state || filters || { role: [], name: '', status: 'all' };
  const updateFilters = useMemo(() => filters?.setState || (() => {}), [filters?.setState]);
  const roleDeps = currentFilters.role;

  const handleRemoveKeyword = useCallback(() => {
    onResetPage && onResetPage();
    updateFilters({ name: '' });
  }, [onResetPage, updateFilters]);

  const handleRemoveStatus = useCallback(() => {
    onResetPage && onResetPage();
    updateFilters({ status: 'all' });
  }, [onResetPage, updateFilters]);

  const handleRemoveRole = useCallback(
    (inputValue) => {
      const newValue = (roleDeps || []).filter((item) => item !== inputValue);
      onResetPage && onResetPage();
      updateFilters({ role: newValue });
    },
    [onResetPage, updateFilters, roleDeps]
  );

  // Defensive: always ensure currentFilters.role is an array
  const safeRole = Array.isArray(currentFilters.role) ? currentFilters.role : [];

  return (
    <FiltersResult totalResults={totalResults} onReset={onClearFilters} sx={sx}>
      <FiltersBlock label="Status:" isShow={currentFilters.status !== 'all'}>
        <Chip
          {...chipProps}
          label={currentFilters.status}
          onDelete={handleRemoveStatus}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>

      <FiltersBlock label="Role:" isShow={!!safeRole.length}>
        {safeRole.map((item) => (
          <Chip {...chipProps} key={item} label={item} onDelete={() => handleRemoveRole(item)} />
        ))}
      </FiltersBlock>

      <FiltersBlock label="Keyword:" isShow={!!currentFilters.name}>
        <Chip {...chipProps} label={currentFilters.name} onDelete={handleRemoveKeyword} />
      </FiltersBlock>
    </FiltersResult>
  );
}
