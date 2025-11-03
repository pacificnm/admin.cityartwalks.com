/**
 * @file filter-options.js
 * @description Filter options configuration for path table
 * @namespace CityArtWalks.Actions.Path.FilterOptions
 * @version 1.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Path-Model} - Path model documentation
 */

/**
 * @memberof CityArtWalks.Actions.Path.FilterOptions
 * @description Default display filter configurations for different views
 */
export const DISPLAY_FILTER_PRESETS = {
  explore: {
    search: true,
    featured: false,
    status: false,
    pathType: true,
    countryId: true,
    stateId: true,
    cityId: true,
    distance: false,
    duration: false,
    createdAt: false,
    viewCount: false,
    toolMenu: false,
  },
  profile: {
    search: true,
    featured: true,
    createdBy: false,
    status: false, // Handled by tabs
    pathType: true,
    countryId: true,
    stateId: true,
    cityId: true,
    distance: false,
    duration: false,
    toolMenu: false,
  },
  member: {
    search: false,
    featured: false,
    createdBy: false,
    status: false,
    pathType: false,
    countryId: false,
    stateId: false,
    cityId: false,
    distance: false,
    duration: false,
    viewCount: false,
    toolMenu: false,
  },
  admin: {
    search: true,
    featured: true,
    status: true,
    pathType: true,
    countryId: true,
    stateId: true,
    cityId: true,
    distance: true,
    duration: true,
    createdAt: true,
    viewCount: true,
    toolMenu: true,
  },
};

/**
 * @memberof CityArtWalks.Actions.Path.FilterOptions
 * @description Default tab options for status filtering
 */
export const STATUS_TAB_OPTIONS = {
  explore: [
    { value: 'all', label: 'All' },
    { value: 'ACTIVE', label: 'Active' },
  ],
  profile: [
    { value: 'all', label: 'All' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'PENDING', label: 'Pending' },
  ],
  member: [], // No tabs for member view
  admin: [
    { value: 'all', label: 'All' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'ARCHIVED', label: 'Archived' },
    { value: 'DELETED', label: 'Deleted' },
  ],
};

/**
 * @memberof CityArtWalks.Actions.Path.FilterOptions
 * @description Gets the appropriate Material-UI color for status values
 * @param {string} status - The status value from entity
 * @returns {string} Material-UI color name
 */
export function getStatusColor(status) {
  switch (status) {
    case 'ACTIVE':
      return 'success';
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
 * @memberof CityArtWalks.Actions.Path.FilterOptions
 * @description Default pagination options for different views
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
  member: {
    defaultRowsPerPage: 12,
    rowsPerPageOptions: [12, 24, 36, 48],
  },
  admin: {
    defaultRowsPerPage: 25,
    rowsPerPageOptions: [10, 25, 50, 100],
  },
};

/**
 * @memberof CityArtWalks.Actions.Path.FilterOptions
 * @description Creates filter options object for different contexts
 * @param {Object} options - Options for creating filter configuration
 * @param {string} options.viewType - Type of view ('explore', 'profile', 'admin')
 * @param {Array} [options.pathTypes=[]] - Available path types for filtering
 * @param {Object} [options.customDisplayFilters] - Custom display filter overrides
 * @param {Array} [options.customTabOptions] - Custom tab options
 * @returns {Object} Complete filter configuration
 */
export function createFilterOptions({
  viewType,
  pathTypes = [],
  customDisplayFilters,
  customTabOptions,
}) {
  return {
    displayFilters: {
      ...DISPLAY_FILTER_PRESETS[viewType],
      ...customDisplayFilters,
    },
    tabOptions: customTabOptions || STATUS_TAB_OPTIONS[viewType],
    pagination: PAGINATION_OPTIONS[viewType],
    filterOptions: {
      pathTypes,
    },
    getStatusColor,
  };
}
