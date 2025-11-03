/**
 * @file user-filter-options.js
 * @description Helper utilities for user filter options and configurations
 * @namespace CityArtWalks.Lib.UserFilterOptions
 * @version 1.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User-Model} - User model documentation
 */

/**
 * @memberof CityArtWalks.Lib.UserFilterOptions
 * @description Default display filter configurations for different views
 */
export const DISPLAY_FILTER_PRESETS = {
  explore: {
    search: true,
    role: false, // Disable for public views
    status: false, // Handled by default filters
    // Geographic filters
    countryId: true,
    stateId: true,
    cityId: true,
    // Advanced filters (usually disabled for explore)
    createdAt: false,
    lastLogin: false,
    toolMenu: false, // Disable action menu for public
  },
  profile: {
    search: true,
    role: false, // User can't change their own role
    status: false, // Handled by tabs
    // Geographic filters
    countryId: true,
    stateId: true,
    cityId: true,
    // Show some advanced filters
    createdAt: false,
    lastLogin: false,
    toolMenu: false,
  },
  admin: {
    search: true,
    role: true,
    status: true,
    // Geographic filters
    countryId: true,
    stateId: true,
    cityId: true,
    // All advanced filters enabled
    createdAt: true,
    lastLogin: true,
    emailAllowed: true,
    toolMenu: true, // Enable action menu for admin
  },
};

/**
 * @memberof CityArtWalks.Lib.UserFilterOptions
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
  admin: [
    { value: 'all', label: 'All' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'BANNED', label: 'Banned' },
    { value: 'REJECTED', label: 'Rejected' },
  ],
};

/**
 * @memberof CityArtWalks.Lib.UserFilterOptions
 * @description Role options for user filtering
 */
export const ROLE_OPTIONS = [
  { value: 'USER', label: 'User' },
  { value: 'MEMBER', label: 'Member' },
  { value: 'ADMIN', label: 'Admin' },
];

/**
 * @memberof CityArtWalks.Lib.UserFilterOptions
 * @description Gets the appropriate Material-UI color for status values
 * @param {string} status - The status value from user
 * @returns {string} Material-UI color name
 */
export function getStatusColor(status) {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'PENDING':
      return 'warning';
    case 'BANNED':
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
 * @memberof CityArtWalks.Lib.UserFilterOptions
 * @description Gets the appropriate Material-UI color for role values
 * @param {string} role - The role value from user
 * @returns {string} Material-UI color name
 */
export function getRoleColor(role) {
  switch (role) {
    case 'ADMIN':
      return 'error';
    case 'MEMBER':
      return 'info';
    case 'USER':
      return 'default';
    default:
      return 'default';
  }
}

/**
 * @memberof CityArtWalks.Lib.UserFilterOptions
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
  admin: {
    defaultRowsPerPage: 25,
    rowsPerPageOptions: [10, 25, 50, 100],
  },
};

/**
 * @memberof CityArtWalks.Lib.UserFilterOptions
 * @description Creates filter options object for different contexts
 * @param {Object} options - Options for creating filter configuration
 * @param {string} options.viewType - Type of view ('explore', 'profile', 'admin')
 * @param {Object} [options.customDisplayFilters] - Custom display filter overrides
 * @param {Array} [options.customTabOptions] - Custom tab options
 * @returns {Object} Complete filter configuration
 */
export function createFilterOptions({ viewType, customDisplayFilters, customTabOptions }) {
  return {
    displayFilters: {
      ...DISPLAY_FILTER_PRESETS[viewType],
      ...customDisplayFilters,
    },
    tabOptions: customTabOptions || STATUS_TAB_OPTIONS[viewType],
    pagination: PAGINATION_OPTIONS[viewType],
    roleOptions: ROLE_OPTIONS,
    getStatusColor,
    getRoleColor,
  };
}
