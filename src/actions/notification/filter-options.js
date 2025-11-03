/**
 * @file filter-options.js
 * @description Filter options configuration for notification table
 * @namespace CityArtWalks.Actions.Notification.FilterOptions
 * @version 1.0.0
 * @author Jaimie Garner
 */

/**
 * Creates filter options configuration based on view type
 * @memberof CityArtWalks.Actions.Notification.FilterOptions
 * @param {Object} options - Configuration options
 * @param {string} [options.viewType='profile'] - The view type ('profile', 'admin')
 * @returns {Object} Filter configuration object
 */
export function createFilterOptions({ viewType = 'profile' } = {}) {
  const baseDisplayFilters = {
    search: true,
    type: true,
    isRead: true,
    priority: true,
    creationDate: true,
    toolMenu: true,
  };

  // Customize filters based on view type
  switch (viewType) {
    case 'admin':
      return {
        displayFilters: {
          ...baseDisplayFilters,
          userId: true,
          createdBy: true,
          expiresAt: true,
        },
      };

    case 'profile':
    default:
      return {
        displayFilters: {
          ...baseDisplayFilters,
          userId: false, // Already filtered by current user
          createdBy: false,
        },
      };
  }
}
