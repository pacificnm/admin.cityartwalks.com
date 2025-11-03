/**
 * @namespace CityArtWalks.Components.ArtHarvesting.Queue.ArtPieceQueueTableFiltersResult
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import { useMemo, useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

/**
 * ArtPieceQueue Table Filters Result component for displaying active filters dynamically
 *
 * Displays active filters as removable chips with ID-based display for optimal performance.
 * Avoids API calls for relationship data fetching to prevent performance issues.
 *
 * @param {Object} props - Component props
 * @param {Object} props.filters - Current filter state
 * @param {number} props.totalResults - Total number of results
 * @param {Function} props.onResetFilters - Handler to reset all filters
 * @param {Object} props.sx - Additional styling props
 * @returns {JSX.Element|null} The table filters result component or null if no visible filters
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Table-Filter-Results-Guidelines} - Complete guidelines
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceQueue} - Database schema reference
 */
export function ArtPieceQueueTableFiltersResult({
  filters = {},
  totalResults,
  onResetFilters,
  sx,
}) {
  // Handler for filter changes
  const handleFilterChange = useCallback(
    (name, value) => {
      // This would typically call the parent's filter handler
      // For now, we'll just handle the reset case
      if (name === 'reset') {
        onResetFilters?.();
      }
    },
    [onResetFilters]
  );

  // Filter out empty/default values and system fields
  const activeFilters = useMemo(() => {
    const systemFields = ['search']; // Fields that shouldn't be displayed as filter chips
    const active = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (
        value !== '' &&
        value !== null &&
        value !== undefined &&
        value !== 'all' &&
        !systemFields.includes(key)
      ) {
        active[key] = value;
      }
    });

    return active;
  }, [filters]);

  // Create filter blocks for display
  const filterBlocks = useMemo(() => {
    const blocks = [];

    // Status filter
    if (activeFilters.status) {
      blocks.push({
        label: 'Status',
        chips: [
          {
            ...chipProps,
            key: `status-${activeFilters.status}`,
            label:
              activeFilters.status.charAt(0).toUpperCase() +
              activeFilters.status.slice(1).toLowerCase(),
            onDelete: () => handleFilterChange('status', 'all'),
          },
        ],
      });
    }

    // Batch filter
    if (activeFilters.harvestBatchId) {
      blocks.push({
        label: 'Batch',
        chips: [
          {
            ...chipProps,
            key: `batch-${activeFilters.harvestBatchId}`,
            label: `Batch #${activeFilters.harvestBatchId}`,
            onDelete: () => handleFilterChange('harvestBatchId', ''),
          },
        ],
      });
    }

    // City filter
    if (activeFilters.city) {
      blocks.push({
        label: 'City',
        chips: [
          {
            ...chipProps,
            key: `city-${activeFilters.city}`,
            label: activeFilters.city,
            onDelete: () => handleFilterChange('city', ''),
          },
        ],
      });
    }

    return blocks;
  }, [activeFilters.city, activeFilters.harvestBatchId, activeFilters.status, handleFilterChange]);

  // Don't render if no active filters
  if (Object.keys(activeFilters).length === 0) {
    return null;
  }

  return (
    <FiltersResult totalResults={totalResults} onReset={onResetFilters} sx={sx}>
      {filterBlocks.map((block) => (
        <FiltersBlock key={block.label} label={block.label} isShow>
          {block.chips.map((chip) => {
            const { key, ...restProps } = chip;
            return <Chip key={key} {...restProps} />;
          })}
        </FiltersBlock>
      ))}
    </FiltersResult>
  );
}
