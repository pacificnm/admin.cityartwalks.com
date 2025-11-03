'use client';

import { useMemo, useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { debugLog } from 'src/lib/debug';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

/**
 * ArtPiece Table Filter Results Component
 *
 * Displays active art piece table filters as removable chips with ArtPiece-specific formatting.
 * Integrates with the parent table component for filter state management and provides
 * user-friendly display of filter combinations with proper ArtPiece field handling.
 *
 * Specifically handles ArtPiece entity filters including:
 * - Artist relationships (artistId)
 * - Geographic filters (cityId, stateId, countryId, latitude, longitude)
 * - Status filters (ACTIVE, ARCHIVED, DELETED, REVIEW, BANNED, REJECTED, PENDING)
 * - Feature flags (featured)
 * - User tracking (createdBy, updatedBy)
 * - Search queries
 * - Date ranges (creationDate, installationDate)
 * - Content fields (title, slug, description)
 * - View metrics (viewCount)
 * - JSON relationship fields (artPieceMaterial, artPieceTag, artPieceType)
 *
 * Features:
 * - ArtPiece-specific filter display names and value formatting
 * - Status enum value mapping (ACTIVE, ARCHIVED, DELETED, REVIEW, BANNED, REJECTED, PENDING)
 * - Geographic coordinate formatting with precision
 * - Date filter formatting with localized display
 * - JSON field handling for relationship data
 * - Individual and bulk filter removal
 * - Search filter display and removal
 * - Conditional visibility based on active filters
 * - Array value handling for multi-select filters
 * - Enhanced accessibility with ARIA labels
 * - Proper error handling with debug logging
 *
 * @namespace CityArtWalks.Components.ArtPiece.TableFilterResults
 * @fileoverview Table filter results component for art piece management
 * @author Jaimie Garner
 * @version 2.1.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for chip display
 * @requires CityArtWalks.Components.FiltersResult - Base filter result components
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece-Model} - ArtPiece model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPiece} - Database schema reference
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Table-Components} - Table component patterns
 */

/**
 * ArtPiece Table Filter Results component
 * Displays active art piece filters as removable chips with ArtPiece-specific formatting.
 *
 * Integration with ArtPieceTable component:
 *
 * @example
 * // In ArtPieceTable component:
 * <ArtPieceTableFiltersResult
 *   filters={tableFilters}
 *   totalResults={artPieces.length}
 *   onResetPage={() => setPage(0)}
 *   onClearFilters={() => setFilters({})}
 *   onFilterChange={handleFilterChange}
 *   search={searchValue}
 *   displayFilters={{
 *     search: true,
 *     status: true,
 *     featured: true,
 *     artistId: true,
 *     cityId: true
 *   }}
 * />
 *
 * @memberof CityArtWalks.Components.ArtPiece.TableFilterResults
 * @function ArtPieceTableFiltersResult
 * @param {Object} props - Component props
 * @param {Object} [props.filters={}] - Current filter state from parent table
 * @param {number} props.totalResults - Total number of filtered results
 * @param {Function} props.onResetPage - Handler to reset pagination when filters change
 * @param {Function} props.onClearFilters - Handler to clear all active filters
 * @param {Function} props.onFilterChange - Handler for individual filter changes
 * @param {string} props.search - Current search value
 * @param {Object} props.displayFilters - Controls which filters are shown in UI
 * @param {Object} [props.filterOptions={}] - Options data for looking up names (countries, states, cities)
 * @param {...Object} sx - Additional styling props (rest parameter)
 * @returns {JSX.Element|null} The table filter results component or null if no visible filters
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece-Model} - ArtPiece model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPiece} - Database schema reference
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Table-Components} - Table component patterns
 */
export function ArtPieceTableFiltersResult({
  filters,
  filterOptions,
  location,
  totalResults,
  onResetPage,
  onClearFilters,
  onFilterChange,
  search,
  displayFilters,
  onClearFilter,
  sx,
  ...other
}) {
  /**
   * Maps filter keys to human-readable display names for ArtPiece filters
   * @memberof CityArtWalks.Components.ArtPiece.TableFilterResults
   * @param {string} key - The filter key
   * @returns {string} Human-readable display name
   */
  const getFilterDisplayName = useCallback((key) => {
    const displayNames = {
      // Core ArtPiece fields
      title: 'Title',
      slug: 'Slug',
      artistId: 'Artist',
      description: 'Description',

      // Geographic fields
      latitude: 'Latitude',
      longitude: 'Longitude',
      city: 'City',
      state: 'State',
      country: 'Country',
      cityId: 'City',
      stateId: 'State',
      countryId: 'Country',

      // Status and features
      status: 'Status',
      featured: 'Featured',
      viewCount: 'View Count',

      // Dates
      creationDate: 'Creation Date',
      installationDate: 'Installation Date',
      createdAt: 'Created At',
      updatedAt: 'Updated At',

      // User tracking
      createdBy: 'Created By',
      updatedBy: 'Updated By',

      // Content fields
      imageUrl: 'Image',
      staticMapUrl: 'Map',

      // JSON relationship fields (stored as JSON in database)
      artPieceMaterial: 'Material',
      artPieceTag: 'Tag',
      artPieceType: 'Type',

      // Search
      search: 'Search',
    };
    return displayNames[key] || key.charAt(0).toUpperCase() + key.slice(1);
  }, []);

  /**
   * Formats filter values for display with ArtPiece-specific handling
   * @memberof CityArtWalks.Components.ArtPiece.TableFilterResults
   * @param {*} value - The filter value
   * @param {string} filterKey - The filter key for context
   * @returns {string} Formatted display value
   */
  const getFilterValueDisplay = useCallback(
    (value, filterKey) => {
      try {
        // Debug: Log filterOptions structure for geographic filters
        if (['cityId', 'stateId', 'countryId'].includes(filterKey)) {
          debugLog(
            'CityArtWalks.Components.ArtPiece.filterOptions',
            `Filter ${filterKey}=${value}, available data:`,
            {
              countries: filterOptions.countries?.length || 0,
              states: filterOptions.states?.length || 0,
              cities: filterOptions.cities?.length || 0,
              sampleCountry: filterOptions.countries?.[0],
              sampleState: filterOptions.states?.[0],
              sampleCity: filterOptions.cities?.[0],
            }
          );
        }
        // Handle ArtPiece status enum - updated to include all valid status values
        if (filterKey === 'status') {
          const statusDisplayNames = {
            ACTIVE: 'Active',
            ARCHIVED: 'Archived',
            DELETED: 'Deleted',
            REVIEW: 'Under Review',
            BANNED: 'Banned',
            REJECTED: 'Rejected',
            PENDING: 'Pending',
          };
          return statusDisplayNames[value] || value;
        }

        // Handle featured filter
        if (filterKey === 'featured') {
          return value ? 'Featured' : 'All';
        }

        // Handle geographic coordinates with precision
        if (filterKey === 'latitude' || filterKey === 'longitude') {
          return `${filterKey === 'latitude' ? 'Lat' : 'Lng'}: ${parseFloat(value).toFixed(6)}`;
        }

        // Handle date filters with formatting
        if (['creationDate', 'installationDate', 'createdAt', 'updatedAt'].includes(filterKey)) {
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
        if (filterKey === 'artistId') {
          // Look up actual artist name from filterOptions
          if (filterOptions.artists && filterOptions.artists.length > 0) {
            const artist = filterOptions.artists.find(
              (a) => a.id === parseInt(value) || a.artistId === parseInt(value)
            );
            return artist ? artist.name : `Artist ID: ${value}`;
          }
          // If no artists in filterOptions, just show a clean label
          return `Artist Filter: ${value}`;
        }

        if (filterKey === 'createdBy' || filterKey === 'updatedBy') {
          return `User ID: ${value}`;
        }

        if (filterKey === 'cityId' || filterKey === 'stateId' || filterKey === 'countryId') {
          // Look up actual names from filterOptions first, then fallback to location data
          let displayName = value;

          if (filterKey === 'countryId') {
            // Try filterOptions first
            if (filterOptions.countries) {
              const country = filterOptions.countries.find(
                (c) => c.countryId === parseInt(value) || c.id === parseInt(value)
              );
              if (country) {
                displayName = country.name;
              }
            }
            // Fallback to location data if current location matches
            if (displayName === value && location && location.countryId === parseInt(value)) {
              displayName = location.country || `Country: ${value}`;
            } else if (displayName === value) {
              displayName = `Country: ${value}`;
            }
          } else if (filterKey === 'stateId') {
            // Try filterOptions first
            if (filterOptions.states) {
              const state = filterOptions.states.find(
                (s) => s.stateId === parseInt(value) || s.id === parseInt(value)
              );
              if (state) {
                displayName = state.name;
              }
            }
            // Fallback to location data if current location matches
            if (displayName === value && location && location.stateId === parseInt(value)) {
              displayName = location.state || location.regionName || `State: ${value}`;
            } else if (displayName === value) {
              displayName = `State: ${value}`;
            }
          } else if (filterKey === 'cityId') {
            // Try filterOptions first
            if (filterOptions.cities) {
              const city = filterOptions.cities.find(
                (c) => c.cityId === parseInt(value) || c.id === parseInt(value)
              );
              if (city) {
                displayName = city.name;
              }
            }
            // Fallback to location data if current location matches
            if (displayName === value && location && location.cityId === parseInt(value)) {
              displayName = location.city || `City: ${value}`;
            } else if (displayName === value) {
              displayName = `City: ${value}`;
            }
          }

          return displayName;
        }

        // Handle JSON fields properly
        if (['artPieceMaterial', 'artPieceTag', 'artPieceType'].includes(filterKey)) {
          if (typeof value === 'object' && value !== null) {
            // Handle JSON objects - display as formatted string
            return `${getFilterDisplayName(filterKey)}: ${JSON.stringify(value)}`;
          }
          return `${getFilterDisplayName(filterKey)}: ${value}`;
        }

        // Default string conversion
        if (typeof value === 'string') return value;
        if (typeof value === 'number') return value.toString();
        return String(value);
      } catch (error) {
        debugLog(
          'CityArtWalks.Components.ArtPiece.filterValueError',
          `Error formatting filter value: ${error.message}`
        );
        return String(value || 'Unknown');
      }
    },
    [
      getFilterDisplayName,
      filterOptions.countries,
      filterOptions.states,
      filterOptions.cities,
      filterOptions.artists,
      location,
    ]
  );

  /**
   * Determines which ArtPiece filters are currently active and should be displayed as chips
   * @memberof CityArtWalks.Components.ArtPiece.TableFilterResults
   * @returns {Object} Object containing only active filters with non-default values
   */
  const activeFilters = useMemo(() => {
    const systemFields = ['search']; // Fields handled separately
    const active = {};

    Object.entries(filters).forEach(([key, value]) => {
      // Skip system fields and hidden filters
      if (systemFields.includes(key)) return;
      if (displayFilters && !displayFilters[key]) return;

      // ArtPiece-specific filter logic
      const validStatusValues = [
        'DELETED',
        'ACTIVE',
        'ARCHIVED',
        'REVIEW',
        'BANNED',
        'REJECTED',
        'PENDING',
      ];
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
        (key === 'latitude' || key === 'longitude') &&
        value !== null &&
        value !== undefined &&
        value !== ''
      ) {
        // Allow zero coordinates as valid values
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
        // Keep 0 check for non-coordinate/viewCount fields
        if (!['latitude', 'longitude', 'viewCount'].includes(key) || value !== 0) {
          active[key] = value;
        }
      }
    });

    return active;
  }, [filters, displayFilters]);

  /**
   * Counts visible filters including search to determine component visibility
   * @memberof CityArtWalks.Components.ArtPiece.TableFilterResults
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
            // Handle array values (multiple selections)
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
