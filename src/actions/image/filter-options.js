/**
 * @file filter-options.js
 * @description Image-specific filter configuration and display presets
 *
 * This module provides comprehensive filter configuration for image-related views,
 * including display presets for different user contexts, status configurations,
 * and helper functions for creating customized filter setups.
 * @namespace CityArtWalks.Actions.Image.FilterOptions
 * @version 1.0.0
 * @author Claude
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Filter-Components} - Filter documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Image-Model} - Image model documentation
 */

'use client';

import { debugLog } from 'src/lib/debug';

/**
 * Predefined filter display configurations for different view types.
 * Controls which filters are visible and how they behave in different contexts.
 *
 * Each preset defines:
 * - Which filters to display (true/false or null to hide)
 * - View-specific behaviors and defaults
 * - Filter relationships and dependencies
 *
 * @memberof CityArtWalks.Actions.Image.FilterOptions
 * @type {Object}
 */
export const DISPLAY_FILTER_PRESETS = {
  // Explore view - public discovery interface
  explore: {
    // Core discovery filters
    search: true,
    toolMenu: true,

    // Related entity filters
    artistId: true,
    artPieceId: true,
    pathId: true,

    // Image-specific filters
    featured: true,
    status: false, // Hide status in explore view

    // Date filters
    createdAt: true,
    uploadedAt: true,

    // Engagement metrics
    viewCount: true,
  },

  // Profile view - user's own image management
  profile: {
    // Essential management filters
    search: true,
    toolMenu: true,

    // Status management
    status: true,

    // Related entity filters
    artistId: true,
    artPieceId: true,
    pathId: true,

    // Content organization
    featured: true,

    // Upload and creation tracking
    createdAt: true,
    uploadedAt: true,

    // Performance metrics
    viewCount: true,
  },

  // Admin view - full administrative control
  admin: {
    // Full search and management
    search: true,
    toolMenu: true,

    // Administrative status control
    status: true,

    // User management
    createdBy: true,
    updatedBy: true,

    // Related entity filters
    artistId: true,
    artPieceId: true,
    pathId: true,

    // Content management
    featured: true,

    // Comprehensive date tracking
    createdAt: true,
    uploadedAt: true,
    updatedAt: true,

    // Full analytics
    viewCount: true,
  },
};

/**
 * Status tab configurations for different view types.
 * Defines the status options available and their visual representation.
 *
 * @memberof CityArtWalks.Actions.Image.FilterOptions
 * @type {Object}
 */
const STATUS_CONFIGURATIONS = {
  profile: [
    { value: 'all', label: 'All Images', color: 'default' },
    { value: 'ACTIVE', label: 'Published', color: 'success' },
    { value: 'DRAFT', label: 'Draft', color: 'warning' },
    { value: 'PRIVATE', label: 'Private', color: 'info' },
    { value: 'ARCHIVED', label: 'Archived', color: 'secondary' },
  ],
  admin: [
    { value: 'all', label: 'All Images', color: 'default' },
    { value: 'ACTIVE', label: 'Active', color: 'success' },
    { value: 'PENDING', label: 'Pending Review', color: 'warning' },
    { value: 'REJECTED', label: 'Rejected', color: 'error' },
    { value: 'ARCHIVED', label: 'Archived', color: 'secondary' },
    { value: 'FLAGGED', label: 'Flagged', color: 'error' },
  ],
};

/**
 * Main factory function that creates filter configuration objects.
 * Returns the appropriate filter display settings and helper functions for a given view type.
 *
 * Features:
 * - View-specific filter configurations
 * - Custom filter override support
 * - Status tab configuration
 * - Debug logging capabilities
 * - Status color helper functions
 *
 * @memberof CityArtWalks.Actions.Image.FilterOptions
 * @function createFilterOptions
 *
 * @example
 * // Basic usage for explore view
 * const { displayFilters, tabOptions, getStatusColor } = createFilterOptions({
 *   viewType: 'explore'
 * });
 *
 * @example
 * // Admin view with custom overrides
 * const config = createFilterOptions({
 *   viewType: 'admin',
 *   customFilters: { specialAdminFilter: true },
 *   enableDebug: true
 * });
 *
 * @param {Object} options - Configuration options
 * @param {string} [options.viewType='explore'] - View type ('explore', 'profile', 'admin')
 * @param {Object} [options.customFilters={}] - Additional custom filter overrides
 * @param {boolean} [options.enableDebug=false] - Enable debug logging
 * @returns {Object} Filter configuration object
 * @returns {Object} returns.displayFilters - Filters to display for this view type
 * @returns {Array} returns.tabOptions - Status tab configuration (if applicable)
 * @returns {Function} returns.getStatusColor - Helper to get status colors
 */
export function createFilterOptions({
  viewType = 'explore',
  customFilters = {},
  enableDebug = false,
} = {}) {
  // Get base filter configuration for view type
  const baseFilters = DISPLAY_FILTER_PRESETS[viewType] || DISPLAY_FILTER_PRESETS.explore;

  // Merge with custom overrides
  const displayFilters = {
    ...baseFilters,
    ...customFilters,
  };

  // Get status configuration for views that support tabs
  const tabOptions = STATUS_CONFIGURATIONS[viewType] || null;

  /**
   * Helper function to get consistent status colors across the application.
   *
   * @memberof CityArtWalks.Actions.Image.FilterOptions
   * @function getStatusColor
   * @param {string} status - Status value to get color for
   * @returns {string} Material-UI color name
   */
  const getStatusColor = (status) => {
    const statusMap = {
      ACTIVE: 'success',
      DRAFT: 'warning',
      PRIVATE: 'info',
      PENDING: 'warning',
      REJECTED: 'error',
      ARCHIVED: 'secondary',
      FLAGGED: 'error',
      all: 'default',
    };
    return statusMap[status] || 'default';
  };

  // Debug logging if enabled
  if (enableDebug) {
    debugLog('createFilterOptions', 'Created filter config?:', {
      viewType,
      displayFilters,
      tabOptions,
      customFilters,
    });
  }

  return {
    displayFilters,
    tabOptions,
    getStatusColor,
  };
}

/**
 * Pre-configured filter options for specific image categories.
 * Provides common filter combinations for different use cases.
 *
 * @memberof CityArtWalks.Actions.Image.FilterOptions
 * @type {Object}
 */
export const IMAGE_FILTER_PRESETS = {
  // Featured images
  featured: {
    featured: true,
    status: 'ACTIVE',
  },

  // Recently uploaded images
  recent: {
    uploadedAt: {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    },
    status: 'ACTIVE',
  },

  // Artist images
  artistImages: {
    artistId: true, // Will need specific artist ID
    status: 'ACTIVE',
  },

  // Art piece images
  artPieceImages: {
    artPieceId: true, // Will need specific art piece ID
    status: 'ACTIVE',
  },

  // Path images
  pathImages: {
    pathId: true, // Will need specific path ID
    status: 'ACTIVE',
  },

  // Popular images
  popular: {
    viewCount: { min: 100 },
    downloadCount: { min: 10 },
    status: 'ACTIVE',
    featured: true,
  },
};

// Note: These filter options are placeholders for future implementation
// The current database schema doesn't support these fields yet

/**
 * Available image format options for filtering.
 * @deprecated Not implemented in current schema
 *
 * @memberof CityArtWalks.Actions.Image.FilterOptions
 * @type {Array}
 */
export const IMAGE_FORMAT_OPTIONS = [];

/**
 * Available image size categories for filtering.
 * @deprecated Not implemented in current schema
 *
 * @memberof CityArtWalks.Actions.Image.FilterOptions
 * @type {Array}
 */
export const IMAGE_SIZE_OPTIONS = [];

/**
 * Common aspect ratio options for image filtering.
 * @deprecated Not implemented in current schema
 *
 * @memberof CityArtWalks.Actions.Image.FilterOptions
 * @type {Array}
 */
export const ASPECT_RATIO_OPTIONS = [];

/**
 * Image type classifications for content filtering.
 * @deprecated Not implemented in current schema
 *
 * @memberof CityArtWalks.Actions.Image.FilterOptions
 * @type {Array}
 */
export const IMAGE_TYPE_OPTIONS = [];

/**
 * Image category options for content organization.
 * @deprecated Not implemented in current schema
 *
 * @memberof CityArtWalks.Actions.Image.FilterOptions
 * @type {Array}
 */
export const IMAGE_CATEGORY_OPTIONS = [];
