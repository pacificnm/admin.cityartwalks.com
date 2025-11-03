/**
 * @file filter-options.js
 * @description Helper utilities for artist filter options and configurations
 * @namespace CityArtWalks.Actions.Artist.FilterOptions
 * @version 2.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Analytics-Hooks} - Hooks documentation
 */

/**
 * Default display filter configurations for different views
 *
 * @memberof CityArtWalks.Actions.Artist.FilterOptions
 * @type {Object}
 * @readonly
 */
export const DISPLAY_FILTER_PRESETS = {
  explore: {
    search: true,
    featured: false,
    status: false,
    nationality: true,
    countryId: true,
    stateId: true,
    cityId: true,
    location: false,
    birthDate: false,
    deathDate: false,
    viewCount: false,
    toolMenu: false,
  },
  profile: {
    search: true,
    featured: true,
    nationality: true,
    createdBy: false,
    status: false, // Handled by tabs
    countryId: true,
    stateId: true,
    cityId: true,
    location: false,
    birthDate: false,
    deathDate: false,
    toolMenu: false,
  },
  member: {
    search: false,
    featured: false,
    nationality: false,
    createdBy: false,
    status: false,
    countryId: false,
    stateId: false,
    cityId: false,
    location: false,
    birthDate: false,
    deathDate: false,
    viewCount: false,
    toolMenu: false,
  },
  admin: {
    search: true,
    featured: true,
    status: true,
    nationality: true,
    countryId: true,
    stateId: true,
    cityId: true,
    location: true,
    birthDate: true,
    deathDate: true,
    viewCount: true,
    createdBy: true,
    website: true,
    toolMenu: true,
  },
};

/**
 * Default tab options for status filtering
 *
 * @memberof CityArtWalks.Actions.Artist.FilterOptions
 * @type {Object}
 * @readonly
 */
export const STATUS_TAB_OPTIONS = {
  explore: [
    { value: 'all', label: 'All' },
    { value: 'ACTIVE', label: 'Active' },
  ],
  profile: [
    { value: 'all', label: 'All' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'REVIEW', label: 'Review' },
    { value: 'PENDING', label: 'Pending' },
  ],
  member: [], // No tabs for member view
  admin: [
    { value: 'all', label: 'All' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'REVIEW', label: 'Review' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'ARCHIVED', label: 'Archived' },
    { value: 'DELETED', label: 'Deleted' },
  ],
};

/**
 * Gets the appropriate Material-UI color for status values
 *
 * @function getStatusColor
 * @memberof CityArtWalks.Actions.Artist.FilterOptions
 * @param {string} status - The status value from entity
 * @returns {string} Material-UI color name
 *
 * @example
 * getStatusColor('ACTIVE') // returns 'success'
 * getStatusColor('DELETED') // returns 'error'
 */
export function getStatusColor(status) {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'REVIEW':
      return 'warning';
    case 'PENDING':
      return 'warning';
    case 'ARCHIVED':
      return 'info';
    case 'DELETED':
      return 'error';
    case 'REJECTED':
      return 'error';
    case 'all':
      return 'default';
    default:
      return 'default';
  }
}

/**
 * Default pagination options for different views
 *
 * @memberof CityArtWalks.Actions.Artist.FilterOptions
 * @type {Object}
 * @readonly
 */
export const PAGINATION_OPTIONS = {
  explore: {
    defaultRowsPerPage: 24,
    rowsPerPageOptions: [12, 24, 36, 48],
  },
  profile: {
    defaultRowsPerPage: 12,
    rowsPerPageOptions: [12, 24, 36, 48],
  },
  admin: {
    defaultRowsPerPage: 25,
    rowsPerPageOptions: [10, 25, 50, 100],
  },
};

/**
 * Creates filter options object for different contexts
 *
 * @function createFilterOptions
 * @memberof CityArtWalks.Actions.Artist.FilterOptions
 * @param {Object} options - Options for creating filter configuration
 * @param {string} options.viewType - Type of view ('explore', 'profile', 'admin')
 * @param {Object} [options.customDisplayFilters] - Custom display filter overrides
 * @param {Array} [options.customTabOptions] - Custom tab options
 * @returns {Object} Complete filter configuration
 *
 * @example
 * const filterConfig = createFilterOptions({
 *   viewType: 'admin',
 *   customDisplayFilters: { search: false },
 *   customTabOptions: [{ value: 'all', label: 'All' }]
 * });
 */
export function createFilterOptions({ viewType, customDisplayFilters, customTabOptions }) {
  return {
    displayFilters: {
      ...DISPLAY_FILTER_PRESETS[viewType],
      ...customDisplayFilters,
    },
    tabOptions: customTabOptions || STATUS_TAB_OPTIONS[viewType],
    pagination: PAGINATION_OPTIONS[viewType],
    filterOptions: {},
    getStatusColor,
  };
}
