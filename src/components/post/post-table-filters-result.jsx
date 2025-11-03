/**
 * @file post-table-filters-result.jsx
 * @description Post Table Filter Results Component
 * @namespace CityArtWalks.Components.Post.PostTableFiltersResult
 * @version 2.0.0
 * @author Jaimie Garner
 */

'use client';

import { useMemo, useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { debugLog } from 'src/lib/debug';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

/**
 * Post Table Filter Results Component
 *
 * Displays active post table filters as removable chips with Post-specific formatting.
 * Integrates with the parent table component for filter state management and provides
 * user-friendly display of filter combinations with proper Post field handling.
 *
 * Specifically handles Post entity filters including:
 * - Status filters (DRAFT, PUBLISHED, ARCHIVED, DELETED)
 * - Feature flags (featured)
 * - User tracking (createdBy, updatedBy)
 * - Search queries
 * - Date ranges (publishedAt, createdAt, updatedAt)
 * - Content fields (title, slug, content, excerpt)
 * - View metrics (viewCount)
 * - Meta fields (metaTitle, metaDescription)
 * - Category and tags
 *
 * Features:
 * - Post-specific filter display names and value formatting
 * - Status enum value mapping (DRAFT, PUBLISHED, ARCHIVED, DELETED)
 * - Date filter formatting with localized display
 * - Individual and bulk filter removal
 * - Search filter display and removal
 * - Conditional visibility based on active filters
 * - Array value handling for multi-select filters (tags)
 * - Enhanced accessibility with ARIA labels
 * - Proper error handling with debug logging
 *
 * @namespace CityArtWalks.Components.Post.TableFilterResults
 * @fileoverview Table filter results component for post management
 * @author Jaimie Garner
 * @version 2.0.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for chip display
 * @requires CityArtWalks.Components.FiltersResult - Base filter result components
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Post-Model} - Post model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Post} - Database schema reference
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Table-Components} - Table component patterns
 */

/**
 * Post Table Filter Results component
 * Displays active post filters as removable chips with Post-specific formatting.
 *
 * Integration with PostTable component:
 *
 * @example
 * // In PostTable component:
 * <PostTableFiltersResult
 *   filters={tableFilters}
 *   totalResults={posts.length}
 *   onResetPage={() => setPage(0)}
 *   onClearFilters={() => setFilters({})}
 *   onFilterChange={handleFilterChange}
 *   search={searchValue}
 *   displayFilters={{
 *     search: true,
 *     status: true,
 *     featured: true,
 *     category: true,
 *     tags: true
 *   }}
 * />
 *
 * @memberof CityArtWalks.Components.Post.TableFilterResults
 * @function PostTableFiltersResult
 * @param {Object} props - Component props
 * @param {Object} [props.filters={}] - Current filter state from parent table
 * @param {number} props.totalResults - Total number of filtered results
 * @param {Function} props.onResetPage - Handler to reset pagination when filters change
 * @param {Function} props.onClearFilters - Handler to clear all active filters
 * @param {Function} props.onFilterChange - Handler for individual filter changes
 * @param {string} props.search - Current search value
 * @param {Object} props.displayFilters - Controls which filters are shown in UI
 * @param {Object} [props.filterOptions={}] - Options data for looking up names (users, categories)
 * @param {...Object} sx - Additional styling props (rest parameter)
 * @returns {JSX.Element|null} The table filter results component or null if no visible filters
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Post-Model} - Post model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Post} - Database schema reference
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Table-Components} - Table component patterns
 */
export function PostTableFiltersResult({
  filters = {},
  totalResults,
  onResetPage,
  onClearFilters,
  onFilterChange,
  onSearchChange,
  search,
  displayFilters,
  filterOptions = {}, // Add filterOptions to access user/category names
  ...sx
}) {
  /**
   * Maps filter keys to human-readable display names for Post filters
   * @memberof CityArtWalks.Components.Post.TableFilterResults
   * @param {string} key - The filter key
   * @returns {string} Human-readable display name
   */
  const getFilterDisplayName = useCallback((key) => {
    const displayNames = {
      // Core Post fields
      title: 'Title',
      slug: 'Slug',
      content: 'Content',
      excerpt: 'Excerpt',

      // Meta fields
      metaTitle: 'Meta Title',
      metaDescription: 'Meta Description',
      featuredImage: 'Featured Image',

      // Status and features
      status: 'Status',
      featured: 'Featured',
      viewCount: 'View Count',

      // Dates
      publishedAt: 'Published At',
      createdAt: 'Created At',
      updatedAt: 'Updated At',

      // User tracking
      createdBy: 'Created By',
      updatedBy: 'Updated By',

      // Content organization
      category: 'Category',
      tags: 'Tags',

      // Search
      search: 'Search',
    };
    return displayNames[key] || key.charAt(0).toUpperCase() + key.slice(1);
  }, []);

  /**
   * Formats filter values for display with Post-specific handling
   * @memberof CityArtWalks.Components.Post.TableFilterResults
   * @param {*} value - The filter value
   * @param {string} filterKey - The filter key for context
   * @returns {string} Formatted display value
   */
  const getFilterValueDisplay = useCallback(
    (value, filterKey) => {
      try {
        // Handle Post status enum
        if (filterKey === 'status') {
          const statusDisplayNames = {
            DRAFT: 'Draft',
            PUBLISHED: 'Published',
            ARCHIVED: 'Archived',
            DELETED: 'Deleted',
          };
          return statusDisplayNames[value] || value;
        }

        // Handle featured filter
        if (filterKey === 'featured') {
          return value ? 'Featured' : 'All';
        }

        // Handle date filters with formatting
        if (['publishedAt', 'createdAt', 'updatedAt'].includes(filterKey)) {
          try {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
              return date.toLocaleDateString();
            }
          } catch {
            // Fallback to string
          }
        }

        // Handle numeric fields with formatting
        if (filterKey === 'viewCount') {
          return `${parseInt(value).toLocaleString()} views`;
        }

        // Handle relationship fields with name lookup
        if (filterKey === 'createdBy' || filterKey === 'updatedBy') {
          // Look up actual user name from filterOptions
          if (filterOptions.users && filterOptions.users.length > 0) {
            const user = filterOptions.users.find(
              (u) => u.id === parseInt(value) || u.userId === parseInt(value)
            );
            return user ? user.name || user.displayName || user.email : `User ID: ${value}`;
          }
          return `User ID: ${value}`;
        }

        // Handle category with lookup
        if (filterKey === 'category') {
          if (filterOptions.categories && filterOptions.categories.length > 0) {
            const category = filterOptions.categories.find((c) => c.value === value);
            return category ? category.label : value;
          }
          return value;
        }

        // Handle tags array
        if (filterKey === 'tags' && Array.isArray(value)) {
          return value.join(', ');
        }

        // Default string conversion
        if (typeof value === 'string') return value;
        if (typeof value === 'number') return value.toString();
        return String(value);
      } catch (error) {
        debugLog(
          'CityArtWalks.Components.Post.filterValueError',
          `Error formatting filter value: ${error.message}`
        );
        return String(value || 'Unknown');
      }
    },
    [filterOptions.users, filterOptions.categories]
  );

  /**
   * Determines which Post filters are currently active and should be displayed as chips
   * @memberof CityArtWalks.Components.Post.TableFilterResults
   * @returns {Object} Object containing only active filters with non-default values
   */
  const activeFilters = useMemo(() => {
    const systemFields = ['search']; // Fields handled separately
    const active = {};

    Object.entries(filters).forEach(([key, value]) => {
      // Skip system fields and hidden filters
      if (systemFields.includes(key)) return;
      if (displayFilters && !displayFilters[key]) return;

      // Post-specific filter logic
      const validStatusValues = ['DRAFT', 'PUBLISHED', 'ARCHIVED', 'DELETED'];
      if (
        key === 'status' &&
        value !== 'all' &&
        value !== '' &&
        validStatusValues.includes(value)
      ) {
        active[key] = value;
      } else if (key === 'featured' && value === true) {
        active[key] = value;
      } else if (
        key === 'viewCount' &&
        value >= 0 &&
        value !== '' &&
        value !== null &&
        value !== undefined
      ) {
        // Allow zero view count as a valid filter
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
        // Keep 0 check for non-viewCount fields
        if (key !== 'viewCount' || value !== 0) {
          active[key] = value;
        }
      }
    });

    return active;
  }, [filters, displayFilters]);

  /**
   * Counts visible filters including search to determine component visibility
   * @memberof CityArtWalks.Components.Post.TableFilterResults
   * @returns {number} Total count of visible filter chips
   */
  const visibleFilterCount = useMemo(() => {
    const activeCount = Object.keys(activeFilters).length;
    const searchCount = search && (!displayFilters || displayFilters.search) ? 1 : 0;
    return activeCount + searchCount;
  }, [activeFilters, search, displayFilters]);

  // Component only renders when filters are active
  return visibleFilterCount > 0 ? (
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
            // Handle array values (multiple selections like tags)
            value.map((item) => (
              <Chip
                {...chipProps}
                key={`${key}-${item}`}
                label={getFilterValueDisplay(item, key)}
                aria-label={`${getFilterDisplayName(key)} filter: ${getFilterValueDisplay(item, key)}`}
              />
            ))
          ) : (
            // Handle single values
            <Chip
              {...chipProps}
              label={getFilterValueDisplay(value, key)}
              aria-label={`${getFilterDisplayName(key)} filter: ${getFilterValueDisplay(value, key)}`}
              sx={{ textTransform: 'capitalize' }}
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
        <Chip {...chipProps} label={search} aria-label={`Search filter: ${search}`} />
      </FiltersBlock>
    </FiltersResult>
  ) : null;
}
