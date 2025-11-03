'use client';

import { useMemo, useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { debugLog } from 'src/lib/debug';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

import ReviewErrorBoundary from './review-error-boundary';

/**
 * Review Table Filter Results Component
 *
 * Displays active review table filters as removable chips with Review-specific formatting.
 * Integrates with the parent table component for filter state management and provides
 * user-friendly display of filter combinations with proper Review field handling.
 *
 * Specifically handles Review entity filters including:
 * - Rating filters (1-5 stars, rating ranges)
 * - Status filters (ACTIVE, PENDING, REJECTED, REVIEW, BANNED, DELETED)
 * - Entity type filters (ARTIST, ART_PIECE, IMAGE, PATH, PATH_MAP)
 * - User tracking (createdBy)
 * - Search queries
 * - Date ranges (startDate, endDate)
 * - Priority filters for moderation queue
 *
 * Features:
 * - Review-specific filter display names and value formatting
 * - Status enum value mapping with color coding
 * - Rating display with star formatting
 * - Entity type display with user-friendly names
 * - Date filter formatting with localized display
 * - Individual and bulk filter removal
 * - Search filter display and removal
 * - Conditional visibility based on active filters
 * - Enhanced accessibility with ARIA labels
 * - Proper error handling with debug logging
 *
 * @namespace CityArtWalks.Components.Review.TableFilterResults
 * @fileoverview Table filter results component for review management
 * @author Jaimie Garner
 * @version 1.0.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for chip display
 * @requires CityArtWalks.Components.FiltersResult - Base filter result components
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Review-Model} - Review model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Review} - Database schema reference
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Table-Components} - Table component patterns
 */

/**
 * Review Table Filter Results component
 * Displays active review filters as removable chips with Review-specific formatting.
 *
 * Integration with ReviewTable component:
 *
 * @example
 * // In ReviewTable component:
 * <ReviewTableFiltersResult
 *   filters={tableFilters}
 *   totalResults={reviews.length}
 *   onClearFilters={() => setFilters({})}
 *   onFilterChange={handleFilterChange}
 *   search={searchValue}
 *   displayFilters={{
 *     search: true,
 *     status: true,
 *     rating: true,
 *     entityType: true
 *   }}
 *   filterOptions={filterOptions}
 *   getStatusColor={getStatusColor}
 *   getRatingColor={getRatingColor}
 * />
 *
 * @memberof CityArtWalks.Components.Review.TableFilterResults
 * @function ReviewTableFiltersResult
 * @param {Object} props - Component props
 * @param {Object} [props.filters={}] - Current filter state from parent table
 * @param {number} props.totalResults - Total number of filtered results
 * @param {Function} props.onClearFilters - Handler to clear all active filters
 * @param {Function} props.onFilterChange - Handler for individual filter changes
 * @param {string} props.search - Current search value
 * @param {Object} props.displayFilters - Controls which filters are shown in UI
 * @param {Object} [props.filterOptions={}] - Options data for looking up names
 * @param {Function} [props.getStatusColor] - Function to get color for status values
 * @param {Function} [props.getRatingColor] - Function to get color for rating values
 * @param {...Object} sx - Additional styling props (rest parameter)
 * @returns {JSX.Element|null} The table filter results component or null if no visible filters
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Review-Model} - Review model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Review} - Database schema reference
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Table-Components} - Table component patterns
 */
export function ReviewTableFiltersResult({
  filters = {},
  totalResults,
  onClearFilters,
  onFilterChange,
  search,
  displayFilters,
  filterOptions = {},
  getStatusColor,
  getRatingColor,
  ...sx
}) {
  /**
   * Maps filter keys to human-readable display names for Review filters
   * @memberof CityArtWalks.Components.Review.TableFilterResults
   * @param {string} key - The filter key
   * @returns {string} Human-readable display name
   */
  const getFilterDisplayName = useCallback((key) => {
    const displayNames = {
      // Core Review fields
      rating: 'Rating',
      comment: 'Comment',
      status: 'Status',

      // Entity relationship fields
      entityType: 'Entity Type',
      entityId: 'Entity ID',
      artistId: 'Artist',
      artPieceId: 'Art Piece',
      imageId: 'Image',
      pathId: 'Path',
      pathMapId: 'Path Map',

      // User tracking
      createdBy: 'Reviewer',
      updatedBy: 'Updated By',

      // Dates
      startDate: 'From Date',
      endDate: 'To Date',
      createdAt: 'Created At',
      updatedAt: 'Updated At',

      // Moderation fields
      priority: 'Priority',
      flagged: 'Flagged',
      aiDecision: 'AI Decision',

      // Search
      search: 'Search',
    };
    return displayNames[key] || key.charAt(0).toUpperCase() + key.slice(1);
  }, []);

  /**
   * Formats filter values for display with Review-specific handling
   * @memberof CityArtWalks.Components.Review.TableFilterResults
   * @param {*} value - The filter value
   * @param {string} filterKey - The filter key for context
   * @returns {string} Formatted display value
   */
  const getFilterValueDisplay = useCallback(
    (value, filterKey) => {
      try {
        // Handle Review status enum
        if (filterKey === 'status') {
          const statusDisplayNames = {
            ACTIVE: 'Active',
            PENDING: 'Pending',
            REJECTED: 'Rejected',
            REVIEW: 'Under Review',
            BANNED: 'Banned',
            DELETED: 'Deleted',
          };
          return statusDisplayNames[value] || value;
        }

        // Handle rating filters with star formatting
        if (filterKey === 'rating') {
          if (value === '5') return '5 Stars ⭐⭐⭐⭐⭐';
          if (value === '4-plus') return '4+ Stars ⭐⭐⭐⭐';
          if (value === '3-plus') return '3+ Stars ⭐⭐⭐';
          if (value === '2-plus') return '2+ Stars ⭐⭐';
          if (value === '1') return '1 Star ⭐';
          if (typeof value === 'number') return `${value} Star${value > 1 ? 's' : ''}`;
          return value;
        }

        // Handle entity type filters
        if (filterKey === 'entityType') {
          const entityTypeDisplayNames = {
            ARTIST: 'Artists',
            ART_PIECE: 'Art Pieces',
            IMAGE: 'Images',
            PATH: 'Paths',
            PATH_MAP: 'Path Maps',
          };
          return entityTypeDisplayNames[value] || value;
        }

        // Handle priority filters
        if (filterKey === 'priority') {
          const priorityDisplayNames = {
            high_first: 'High Priority First',
            date_desc: 'Newest First',
            date_asc: 'Oldest First',
          };
          return priorityDisplayNames[value] || value;
        }

        // Handle date filters with formatting
        if (['startDate', 'endDate', 'createdAt', 'updatedAt'].includes(filterKey)) {
          try {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
              return date.toLocaleDateString();
            }
          } catch {
            // Fallback to string
          }
        }

        // Handle boolean filters
        if (filterKey === 'flagged' || filterKey === 'aiDecision') {
          return value ? 'Yes' : 'No';
        }

        // Handle user ID fields
        if (filterKey === 'createdBy' || filterKey === 'updatedBy') {
          // Look up actual user name from filterOptions if available
          if (filterOptions.users && filterOptions.users.length > 0) {
            const user = filterOptions.users.find(
              (u) => u.id === parseInt(value) || u.userId === parseInt(value)
            );
            return user ? user.name : `User ID: ${value}`;
          }
          return `User ID: ${value}`;
        }

        // Handle entity ID fields
        if (['artistId', 'artPieceId', 'imageId', 'pathId', 'pathMapId'].includes(filterKey)) {
          return `ID: ${value}`;
        }

        // Default string conversion
        if (typeof value === 'string') return value;
        if (typeof value === 'number') return value.toString();
        return String(value);
      } catch (error) {
        debugLog(
          'CityArtWalks.Components.Review.filterValueError',
          `Error formatting filter value: ${error.message}`
        );
        return String(value || 'Unknown');
      }
    },
    [filterOptions.users]
  );

  /**
   * Determines which Review filters are currently active and should be displayed as chips
   * @memberof CityArtWalks.Components.Review.TableFilterResults
   * @returns {Object} Object containing only active filters with non-default values
   */
  const activeFilters = useMemo(() => {
    const systemFields = ['search']; // Fields handled separately
    const active = {};

    Object.entries(filters).forEach(([key, value]) => {
      // Skip system fields and hidden filters
      if (systemFields.includes(key)) return;
      if (displayFilters && !displayFilters[key]) return;

      // Review-specific filter logic
      const validStatusValues = ['ACTIVE', 'PENDING', 'REJECTED', 'REVIEW', 'BANNED', 'DELETED'];
      if (
        key === 'status' &&
        value !== 'all' &&
        value !== '' &&
        validStatusValues.includes(value)
      ) {
        active[key] = value;
      } else if (key === 'rating' && value !== 'all' && value !== '' && value !== null) {
        active[key] = value;
      } else if (key === 'entityType' && value !== 'all' && value !== '' && value !== null) {
        active[key] = value;
      } else if (key === 'priority' && value !== 'high_first' && value !== '' && value !== null) {
        // Only show priority if it's not the default
        active[key] = value;
      } else if (Array.isArray(value) && value.length > 0) {
        active[key] = value;
      } else if (
        value !== '' &&
        value !== null &&
        value !== undefined &&
        value !== 'all' &&
        value !== 0
      ) {
        active[key] = value;
      }
    });

    return active;
  }, [filters, displayFilters]);

  /**
   * Counts visible filters including search to determine component visibility
   * @memberof CityArtWalks.Components.Review.TableFilterResults
   * @returns {number} Total count of visible filter chips
   */
  const visibleFilterCount = useMemo(() => {
    const activeCount = Object.keys(activeFilters).length;
    const searchCount = search && (!displayFilters || displayFilters.search) ? 1 : 0;
    return activeCount + searchCount;
  }, [activeFilters, search, displayFilters]);

  /**
   * Gets the appropriate color for a filter chip based on filter type and value
   * @memberof CityArtWalks.Components.Review.TableFilterResults
   * @param {string} key - The filter key
   * @param {*} value - The filter value
   * @returns {string} Material-UI color name
   */
  const getFilterChipColor = useCallback(
    (key, value) => {
      if (key === 'status' && getStatusColor) {
        return getStatusColor(value);
      }
      if (key === 'rating' && getRatingColor) {
        return getRatingColor(value);
      }
      if (key === 'entityType') {
        return 'info';
      }
      if (key === 'priority') {
        return 'warning';
      }
      return 'default';
    },
    [getStatusColor, getRatingColor]
  );

  // Component only renders when filters are active
  return visibleFilterCount > 0 ? (
    <ReviewErrorBoundary
      name="ReviewTableFiltersResult"
      context="displaying_active_filters"
      variant="inline"
      title="Filter Display Error"
      description="Unable to display active filters."
    >
      <FiltersResult totalResults={totalResults} onReset={onClearFilters} sx={{ ...sx }}>
        {/* Dynamic filter chips for non-search filters */}
        {Object.entries(activeFilters).map(([key, value]) => (
          <FiltersBlock
            key={key}
            label={`${getFilterDisplayName(key)}:`}
            isShow
            aria-live="polite"
            aria-label={`Active ${getFilterDisplayName(key)} filters`}
          >
            {Array.isArray(value) ? (
              // Handle array values (multiple selections)
              value.map((item) => (
                <Chip
                  {...chipProps}
                  key={`${key}-${item}`}
                  label={getFilterValueDisplay(item, key)}
                  color={getFilterChipColor(key, item)}
                  aria-label={`${getFilterDisplayName(key)} filter: ${getFilterValueDisplay(item, key)}`}
                  onDelete={() => {
                    // Handle array filter removal
                    const newArray = value.filter((v) => v !== item);
                    onFilterChange(key, newArray.length > 0 ? newArray : 'all');
                  }}
                />
              ))
            ) : (
              // Handle single values
              <Chip
                {...chipProps}
                label={getFilterValueDisplay(value, key)}
                color={getFilterChipColor(key, value)}
                aria-label={`${getFilterDisplayName(key)} filter: ${getFilterValueDisplay(value, key)}`}
                sx={{ textTransform: 'capitalize' }}
                onDelete={() => {
                  // Handle single filter removal
                  const defaultValue = key === 'priority' ? 'high_first' : 'all';
                  onFilterChange(key, defaultValue);
                }}
              />
            )}
          </FiltersBlock>
        ))}

        {/* Search filter - displayed separately */}
        <FiltersBlock
          label="Search:"
          isShow={!!search && (!displayFilters || displayFilters.search)}
          aria-live="polite"
          aria-label="Active search filter"
        >
          <Chip
            {...chipProps}
            label={search}
            aria-label={`Search filter: ${search}`}
            onDelete={() => {
              // Clear search - this depends on how search is handled in the parent
              if (onFilterChange) {
                onFilterChange('search', '');
              }
            }}
          />
        </FiltersBlock>
      </FiltersResult>
    </ReviewErrorBoundary>
  ) : null;
}
