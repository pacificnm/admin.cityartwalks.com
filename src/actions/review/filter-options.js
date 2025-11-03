/**
 * @file review-filter-options.js
 * @description Helper utilities for review filter options and configurations
 * @namespace CityArtWalks.Lib.ReviewFilterOptions
 * @version 1.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Review-Model} - Review model documentation
 */

/**
 * @memberof CityArtWalks.Lib.ReviewFilterOptions
 * @description Default display filter configurations for different views
 */
export const DISPLAY_FILTER_PRESETS = {
  public: {
    search: true,
    rating: true,
    status: false, // Public only shows ACTIVE reviews
    entityType: false, // Hidden when viewing specific entity
    creationDate: false,
    toolMenu: false,
  },
  profile: {
    search: true,
    rating: true,
    status: true, // User can see their own review statuses
    entityType: true,
    creationDate: true,
    toolMenu: false,
  },
  moderation: {
    search: true,
    rating: true,
    status: true, // Show PENDING, REVIEW statuses
    entityType: true,
    creationDate: true,
    createdBy: true,
    priority: true,
    toolMenu: true,
  },
  admin: {
    search: true,
    rating: true,
    status: true,
    entityType: true,
    creationDate: true,
    createdBy: true,
    priority: true,
    aiDecision: true,
    flagged: true,
    toolMenu: true,
  },
};

/**
 * @memberof CityArtWalks.Lib.ReviewFilterOptions
 * @description Default tab options for status filtering
 */
export const STATUS_TAB_OPTIONS = {
  public: [
    { value: 'all', label: 'All' },
    { value: 'ACTIVE', label: 'Active' },
  ],
  profile: [
    { value: 'all', label: 'All' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'REJECTED', label: 'Rejected' },
  ],
  moderation: [
    { value: 'all', label: 'All' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'REVIEW', label: 'Under Review' },
  ],
  admin: [
    { value: 'all', label: 'All' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'REVIEW', label: 'Under Review' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'BANNED', label: 'Banned' },
    { value: 'DELETED', label: 'Deleted' },
  ],
};

/**
 * @memberof CityArtWalks.Lib.ReviewFilterOptions
 * @description Rating filter options
 */
export const RATING_FILTER_OPTIONS = [
  { value: 'all', label: 'All Ratings' },
  { value: '5', label: '5 Stars' },
  { value: '4-plus', label: '4+ Stars' },
  { value: '3-plus', label: '3+ Stars' },
  { value: '2-plus', label: '2+ Stars' },
  { value: '1', label: '1 Star' },
];

/**
 * @memberof CityArtWalks.Lib.ReviewFilterOptions
 * @description Entity type filter options
 */
export const ENTITY_TYPE_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'ARTIST', label: 'Artists' },
  { value: 'ART_PIECE', label: 'Art Pieces' },
  { value: 'IMAGE', label: 'Images' },
  { value: 'PATH', label: 'Paths' },
  { value: 'PATH_MAP', label: 'Path Maps' },
];

/**
 * @memberof CityArtWalks.Lib.ReviewFilterOptions
 * @description Sort options for reviews
 */
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First', field: 'createdAt', order: 'desc' },
  { value: 'oldest', label: 'Oldest First', field: 'createdAt', order: 'asc' },
  { value: 'rating-high', label: 'Highest Rating', field: 'rating', order: 'desc' },
  { value: 'rating-low', label: 'Lowest Rating', field: 'rating', order: 'asc' },
  { value: 'updated', label: 'Recently Updated', field: 'updatedAt', order: 'desc' },
];

/**
 * @memberof CityArtWalks.Lib.ReviewFilterOptions
 * @description Gets the appropriate Material-UI color for status values
 * @param {string} status - The status value from review
 * @returns {string} Material-UI color name
 */
export function getStatusColor(status) {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'PENDING':
      return 'warning';
    case 'REVIEW':
      return 'info';
    case 'REJECTED':
      return 'error';
    case 'BANNED':
      return 'error';
    case 'DELETED':
      return 'default';
    case 'all':
      return 'default';
    default:
      return 'default';
  }
}

/**
 * @memberof CityArtWalks.Lib.ReviewFilterOptions
 * @description Gets the appropriate Material-UI color for rating values
 * @param {number} rating - The rating value (1-5)
 * @returns {string} Material-UI color name
 */
export function getRatingColor(rating) {
  if (rating >= 4) return 'success';
  if (rating >= 3) return 'info';
  if (rating >= 2) return 'warning';
  return 'error';
}

/**
 * @memberof CityArtWalks.Lib.ReviewFilterOptions
 * @description Default pagination options for different views
 */
export const PAGINATION_OPTIONS = {
  public: {
    defaultRowsPerPage: 12,
    rowsPerPageOptions: [6, 12, 24, 36],
  },
  profile: {
    defaultRowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 20, 30],
  },
  moderation: {
    defaultRowsPerPage: 20,
    rowsPerPageOptions: [10, 20, 50, 100],
  },
  admin: {
    defaultRowsPerPage: 25,
    rowsPerPageOptions: [10, 25, 50, 100],
  },
};

/**
 * @memberof CityArtWalks.Lib.ReviewFilterOptions
 * @description Creates filter options object for different contexts
 * @param {Object} options - Options for creating filter configuration
 * @param {string} options.viewType - Type of view ('public', 'profile', 'moderation', 'admin')
 * @param {Object} [options.customDisplayFilters] - Custom display filter overrides
 * @param {Array} [options.customTabOptions] - Custom tab options
 * @param {Array} [options.customSortOptions] - Custom sort options
 * @returns {Object} Complete filter configuration
 */
export function createFilterOptions({
  viewType,
  customDisplayFilters,
  customTabOptions,
  customSortOptions,
}) {
  return {
    displayFilters: {
      ...DISPLAY_FILTER_PRESETS[viewType],
      ...customDisplayFilters,
    },
    tabOptions: customTabOptions || STATUS_TAB_OPTIONS[viewType],
    pagination: PAGINATION_OPTIONS[viewType],
    filterOptions: {
      ratings: RATING_FILTER_OPTIONS,
      entityTypes: ENTITY_TYPE_OPTIONS,
      sorts: customSortOptions || SORT_OPTIONS,
    },
    getStatusColor,
    getRatingColor,
  };
}
