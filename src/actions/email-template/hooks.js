/**
 * @file hooks.js
 * @description React hooks for EmailTemplate operations using SWR with comprehensive template management
 * @namespace CityArtWalks.Actions.EmailTemplate.Hooks
 * @version 1.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Analytics-Hooks} - Hooks documentation
 */

import useSWR from 'swr';

import { endpoints } from 'src/endpoints';
import { debugError } from 'src/lib/debug';

import { getEmailTemplates, getEmailTemplateById } from './requests';

// ----------------------------------------------------------------------

/**
 * Hook to fetch all email templates with SWR caching and comprehensive filtering.
 * Supports pagination, search, category filtering, and active status filtering.
 *
 * Features:
 * - SWR-based caching and revalidation
 * - Pagination support with configurable page size
 * - Search functionality across template content
 * - Category-based filtering
 * - Active/inactive status filtering
 * - Automatic error handling and logging
 *
 * @function useEmailTemplates
 * @memberof CityArtWalks.Actions.EmailTemplate.Hooks
 *
 * @example
 * // Basic usage
 * const { data, loading, error } = useEmailTemplates({}, accessToken);
 *
 * @example
 * // With filters and pagination
 * const { data, pagination, mutate } = useEmailTemplates({
 *   page: 1,
 *   limit: 20,
 *   search: 'newsletter',
 *   category: 'marketing',
 *   isActive: true
 * }, accessToken);
 *
 * @param {Object} [params={}] - Query parameters for filtering and pagination
 * @param {number} [params.page] - Page number for pagination
 * @param {number} [params.limit] - Items per page
 * @param {string} [params.search] - Search query for template content
 * @param {string} [params.category] - Filter by template category
 * @param {boolean} [params.isActive] - Filter by active status
 * @param {string} [accessToken=''] - Authentication token for API access
 * @returns {Object} Hook state with templates data, pagination, loading, error, and mutate function
 */
export function useEmailTemplates(params = {}, accessToken = '') {
  const { data, error, isLoading, mutate } = useSWR(
    accessToken ? [endpoints.emailTemplate.list.path, params, accessToken] : null,
    ([, queryParams]) => getEmailTemplates(queryParams, accessToken),
    {
      revalidateOnFocus: false,
      onError: (err) => {
        debugError('useEmailTemplates', 'Failed to fetch email templates', err);
      },
    }
  );

  return {
    data: data?.data?.data || [],
    pagination: data?.data?.meta || data?.meta,
    loading: isLoading,
    error,
    mutate,
  };
}

// ----------------------------------------------------------------------

/**
 * Hook to fetch a single email template by ID with SWR caching.
 * Automatically handles conditional fetching based on template ID and token availability.
 *
 * Features:
 * - Conditional fetching (only when ID and token are available)
 * - SWR-based caching and revalidation
 * - Automatic error handling and logging
 * - Flexible data structure handling
 *
 * @function useEmailTemplate
 * @memberof CityArtWalks.Actions.EmailTemplate.Hooks
 *
 * @example
 * // Fetch specific template
 * const { data, loading, error } = useEmailTemplate(templateId, accessToken);
 *
 * @param {number|string} templateId - Template ID to fetch
 * @param {string} [accessToken=''] - Authentication token for API access
 * @returns {Object} Hook state with template data, loading, error, and mutate function
 */
export function useEmailTemplate(templateId, accessToken = '') {
  const shouldFetch = templateId !== null && templateId !== undefined && accessToken;

  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? [endpoints.emailTemplate.details.path(templateId), accessToken] : null,
    shouldFetch ? () => getEmailTemplateById(templateId, accessToken) : null,
    {
      revalidateOnFocus: false,
      onError: (err) => {
        debugError('useEmailTemplate', 'Failed to fetch email template', err);
      },
    }
  );

  return {
    data: data?.data?.data || data?.data || null,
    loading: isLoading,
    error,
    mutate,
  };
}

// ----------------------------------------------------------------------

/**
 * Hook to get email template categories with predefined category options.
 * Returns static category data for use in filtering and form components.
 *
 * Categories include:
 * - Contact: Customer contact and inquiry templates
 * - Notification: System notification templates
 * - Marketing: Marketing and promotional templates
 * - System: Internal system operation templates
 * - Transactional: Transaction-related email templates
 *
 * @function useEmailTemplateCategories
 * @memberof CityArtWalks.Actions.EmailTemplate.Hooks
 *
 * @example
 * // Get categories for filter dropdown
 * const { categories } = useEmailTemplateCategories();
 *
 * @returns {Object} Categories data with loading and error states
 */
export function useEmailTemplateCategories() {
  const categories = [
    { value: 'contact', label: 'Contact', count: 0 },
    { value: 'notification', label: 'Notification', count: 0 },
    { value: 'marketing', label: 'Marketing', count: 0 },
    { value: 'system', label: 'System', count: 0 },
    { value: 'transactional', label: 'Transactional', count: 0 },
  ];

  return {
    categories,
    loading: false,
    error: null,
  };
}

// ----------------------------------------------------------------------

/**
 * Hook for email template actions providing cache invalidation utilities.
 * Useful for triggering data refresh after template mutations (create, update, delete).
 *
 * Features:
 * - Template cache invalidation
 * - Integration with useEmailTemplates hook
 * - Optimistic updates support
 *
 * @function useEmailTemplateActions
 * @memberof CityArtWalks.Actions.EmailTemplate.Hooks
 *
 * @example
 * // Invalidate templates after creating a new one
 * const { invalidateTemplates } = useEmailTemplateActions();
 * await createTemplate(newTemplate);
 * invalidateTemplates();
 *
 * @returns {Object} Action functions for template management
 */
export function useEmailTemplateActions() {
  const { mutate: mutateTemplates } = useEmailTemplates();

  const invalidateTemplates = () => {
    mutateTemplates();
  };

  return {
    invalidateTemplates,
  };
}
