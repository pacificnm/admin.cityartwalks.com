/**
 * @file post-filter-options.js
 * @description Helper utilities for post filter options and configurations
 * @namespace CityArtWalks.Actions.PostFilterOptions
 * @version 1.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Post-Model} - Post model documentation
 */

/**
 * @memberof CityArtWalks.Actions.PostFilterOptions
 * @description Default display filter configurations for different views
 */
export const DISPLAY_FILTER_PRESETS = {
  explore: {
    search: true,
    featured: false,
    status: false, // Only show published posts in explore
    category: true,
    tags: true,
    publishedAt: false,
    viewCount: false,
    createdBy: false,
    toolMenu: false,
  },
  profile: {
    search: true,
    featured: true,
    status: false, // Handled by tabs
    category: true,
    tags: true,
    publishedAt: true,
    viewCount: false,
    createdBy: false, // User's own posts
    toolMenu: false,
  },
  member: {
    search: false,
    featured: false,
    status: false,
    category: false,
    tags: false,
    publishedAt: false,
    viewCount: false,
    createdBy: false,
    toolMenu: false,
  },
  admin: {
    search: true,
    featured: true,
    status: true,
    category: true,
    tags: true,
    publishedAt: true,
    viewCount: true,
    createdBy: true, // Show author filter in admin
    toolMenu: true,
  },
};

/**
 * @memberof CityArtWalks.Actions.PostFilterOptions
 * @description Default tab options for status filtering
 */
export const STATUS_TAB_OPTIONS = {
  explore: [
    { value: 'PUBLISHED', label: 'Published' }, // Only published posts in explore
  ],
  profile: [
    { value: 'all', label: 'All' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'PUBLISHED', label: 'Published' },
    { value: 'ARCHIVED', label: 'Archived' },
  ],
  member: [], // No tabs for member view
  admin: [
    { value: 'all', label: 'All' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'PUBLISHED', label: 'Published' },
    { value: 'ARCHIVED', label: 'Archived' },
    { value: 'DELETED', label: 'Deleted' },
  ],
};

/**
 * @memberof CityArtWalks.Actions.PostFilterOptions
 * @description Gets the appropriate Material-UI color for post status values
 * @param {string} status - The status value from post entity
 * @returns {string} Material-UI color name
 */
export function getStatusColor(status) {
  switch (status) {
    case 'PUBLISHED':
      return 'success';
    case 'DRAFT':
      return 'warning';
    case 'ARCHIVED':
      return 'info';
    case 'DELETED':
      return 'error';
    case 'all':
      return 'default';
    default:
      return 'default';
  }
}

/**
 * @memberof CityArtWalks.Actions.PostFilterOptions
 * @description Default pagination options for different views
 */
export const PAGINATION_OPTIONS = {
  explore: {
    defaultRowsPerPage: 12,
    rowsPerPageOptions: [6, 12, 24, 48],
  },
  profile: {
    defaultRowsPerPage: 12,
    rowsPerPageOptions: [6, 12, 24, 48],
  },
  admin: {
    defaultRowsPerPage: 25,
    rowsPerPageOptions: [10, 25, 50, 100],
  },
};

/**
 * @memberof CityArtWalks.Actions.PostFilterOptions
 * @description Post category options for filtering
 */
export const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  { value: 'news', label: 'News' },
  { value: 'tutorials', label: 'Tutorials' },
  { value: 'guides', label: 'Guides' },
  { value: 'updates', label: 'Updates' },
  { value: 'community', label: 'Community' },
  { value: 'events', label: 'Events' },
  { value: 'features', label: 'Features' },
];

/**
 * @memberof CityArtWalks.Actions.PostFilterOptions
 * @description Boolean filter options for featured posts
 */
export const FEATURED_OPTIONS = [
  { value: 'all', label: 'All Posts' },
  { value: true, label: 'Featured Only' },
  { value: false, label: 'Non-Featured' },
];

/**
 * @memberof CityArtWalks.Actions.PostFilterOptions
 * @description Creates filter options object for different contexts
 * @param {Object} options - Options for creating filter configuration
 * @param {string} options.viewType - Type of view ('explore', 'profile', 'admin')
 * @param {Array} [options.authors=[]] - Available authors for filtering
 * @param {Array} [options.categories=[]] - Available categories for filtering
 * @param {Array} [options.tags=[]] - Available tags for filtering
 * @param {Object} [options.customDisplayFilters] - Custom display filter overrides
 * @param {Array} [options.customTabOptions] - Custom tab options
 * @returns {Object} Complete filter configuration
 */
export function createFilterOptions({
  viewType = 'explore',
  authors = [],
  categories = [],
  tags = [],
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
      authors,
      categories: categories.length > 0 ? categories : CATEGORY_OPTIONS,
      tags,
      featuredOptions: FEATURED_OPTIONS,
    },
    getStatusColor,
  };
}
