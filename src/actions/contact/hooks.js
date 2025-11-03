/**
 * React hooks for Contact operations using SWR
 *
 * This module provides React hooks for contact CRUD operations with SWR caching,
 * IndexedDB fallback, and automatic cache invalidation. All hooks delegate to
 * requests functions and provide consistent loading/error states.
 *
 * @namespace CityArtWalks.Actions.Contact.Hooks
 * @fileoverview React hooks for contact data operations
 * @author Jaimie Garner
 * @version 1.1.0
 *
 * @requires useSWR - SWR library for data fetching
 * @requires React - React hooks (useMemo, useEffect)
 * @requires CityArtWalks.Lib.Debug - Debug logging utilities
 * @requires CityArtWalks.Lib.IndexedDB - IndexedDB caching utilities
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Requests} - Requests patterns documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Contact-Model} - Contact model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Contact} - Database schema reference
 */

import useSWR, { useSWRConfig } from 'swr';
import { useMemo, useEffect } from 'react';

import { debugLog, debugError } from 'src/lib/debug';
import { saveToIndexedDb, loadFromIndexedDb, buildCacheKeyFromSWRKey } from 'src/lib/indexDb';

import * as requests from './requests.js';

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  keepPreviousData: true,
};

// ----------------------------------------------------------------------

/**
 * SWR hook for paginated contacts with IndexedDB caching support
 *
 * @memberof CityArtWalks.Actions.Contact.Hooks
 * @function useGetPaginatedContacts
 * @param {Object} [filters={}] - Filter parameters object
 * @param {string} [filters.search=''] - Search term for name/email/subject fields
 * @param {string} [filters.name=''] - Filter by contact name
 * @param {string} [filters.email=''] - Filter by contact email
 * @param {string} [filters.subject=''] - Filter by message subject
 * @param {number} [page=1] - Page number for pagination
 * @param {number} [rowsPerPage=10] - Number of items per page
 * @param {string} [token=''] - Auth token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @param {*} [refreshKey] - Key to trigger manual refresh
 * @returns {Object} Paginated contacts result with IndexedDB caching
 * @returns {Array} returns.contacts - Array of contact objects
 * @returns {Object} returns.paginationMeta - Pagination metadata
 * @returns {boolean} returns.contactsLoading - Loading state
 * @returns {Error} returns.contactsError - Error state
 * @returns {boolean} returns.contactsEmpty - Empty state
 * @returns {Function} returns.mutate - SWR mutate function
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useGetPaginatedContacts(
  filters = {},
  page = 1,
  rowsPerPage = 10,
  token = '',
  revalidate = 600,
  refreshKey
) {
  const { search = '', name = '', email = '', subject = '' } = filters;
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    const key = [
      'getPaginatedContacts',
      search,
      name,
      email,
      subject,
      page,
      rowsPerPage,
      revalidate,
    ];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [search, name, email, subject, page, rowsPerPage, revalidate]);

  const { data, isLoading, error, mutate } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getPaginatedContacts(
          page,
          rowsPerPage,
          filters,
          token,
          revalidate
        );
        if (response && cacheKey) {
          await saveToIndexedDb(cacheKey, response);
          debugLog(`[IndexedDB] Saved data for ${cacheKey}`);
        }
        return response;
      } catch (err) {
        debugError(
          'CityArtWalks.Actions.Contact.Hooks.useGetPaginatedContacts',
          'Failed to fetch paginated contacts',
          {
            error: err.message,
            filters,
            page,
            rowsPerPage,
            token: token ? '[REDACTED]' : 'none',
          }
        );
        throw err;
      }
    },
    swrOptions
  );

  // IndexedDB fallback loading
  useEffect(() => {
    if (!cacheKey || !mutate) return;
    (async () => {
      try {
        const cached = await loadFromIndexedDb(cacheKey, revalidateMs);
        if (cached) {
          debugLog(`[IndexedDB] Cache hit for ${cacheKey}`);
          mutate(cached, false);
        }
      } catch (cacheError) {
        debugError(
          'CityArtWalks.Actions.Contact.Hooks.useGetPaginatedContacts',
          'IndexedDB cache operation failed',
          {
            error: cacheError.message,
            cacheKey,
          }
        );
      }
    })();
  }, [cacheKey, mutate, revalidateMs]);

  // Manual refresh trigger
  useEffect(() => {
    if (refreshKey) mutate();
  }, [refreshKey, mutate]);

  return useMemo(
    () => ({
      contacts: data?.data?.contacts || [],
      paginationMeta: data?.data?.meta || {
        total: 0,
        page: 1,
        rowsPerPage: 10,
        totalPages: 0,
      },
      contactsLoading: isLoading,
      contactsError: error,
      contactsEmpty: !isLoading && (!data?.data?.contacts || data.data.contacts.length === 0),
      mutate,
    }),
    [data, isLoading, error, mutate]
  );
}

/**
 * SWR hook for fetching a single contact by ID with IndexedDB caching
 *
 * @memberof CityArtWalks.Actions.Contact.Hooks
 * @function useGetContactById
 * @param {string|number} id - The unique identifier of the contact
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @returns {Object} Contact data with loading and error states
 * @returns {Object} returns.contact - Contact object or null
 * @returns {boolean} returns.contactLoading - Loading state
 * @returns {Error} returns.contactError - Error state
 * @returns {boolean} returns.contactValidating - Revalidation state
 * @returns {boolean} returns.contactEmpty - Empty state
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useGetContactById(id, token = '', revalidate = 600) {
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    if (!id) return { swrKey: null, cacheKey: null };
    const key = ['getContactById', id, revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [id, revalidate]);

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getContactById(id, token, revalidate);
        if (response && cacheKey) {
          await saveToIndexedDb(cacheKey, response);
          debugLog(`[IndexedDB] Saved data for ${cacheKey}`);
        }
        return response;
      } catch (err) {
        debugError(
          'CityArtWalks.Actions.Contact.Hooks.useGetContactById',
          'Failed to fetch contact by ID',
          {
            error: err.message,
            id,
            token: token ? '[REDACTED]' : 'none',
          }
        );
        throw err;
      }
    },
    swrOptions
  );

  // IndexedDB fallback loading
  useEffect(() => {
    if (!cacheKey || !mutate) return;
    (async () => {
      try {
        const cached = await loadFromIndexedDb(cacheKey, revalidateMs);
        if (cached) {
          debugLog(`[IndexedDB] Cache hit for ${cacheKey}`);
          mutate(cached, false);
        }
      } catch (cacheError) {
        debugError(
          'CityArtWalks.Actions.Contact.Hooks.useGetContactById',
          'IndexedDB cache operation failed',
          {
            error: cacheError.message,
            cacheKey,
            id,
          }
        );
      }
    })();
  }, [cacheKey, mutate, revalidateMs, id]);

  return useMemo(
    () => ({
      contact: data?.data || null,
      contactLoading: isLoading,
      contactError: error,
      contactValidating: isValidating,
      contactEmpty: !isLoading && !data?.data,
    }),
    [data, isLoading, error, isValidating]
  );
}

/**
 * Hook for creating a new contact with automatic cache invalidation
 *
 * @memberof CityArtWalks.Actions.Contact.Hooks
 * @function useCreateContact
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to create a contact
 * @returns {Promise<Object>} returns.result - Created contact response
 * @throws {Error} When contact data validation fails or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useCreateContact(token = '') {
  const { mutate } = useSWRConfig();

  return async (contactData) => {
    try {
      const result = await requests.createContact(contactData, token);

      // Invalidate SWR cache
      mutate(
        (key) =>
          Array.isArray(key) && (key.includes('contact') || key.includes('getPaginatedContacts'))
      );

      // Clear related IndexedDB cache entries manually
      const cachePatterns = ['contact', 'getPaginatedContacts'];
      for (const pattern of cachePatterns) {
        const cacheKey = buildCacheKeyFromSWRKey([pattern]);
        await saveToIndexedDb(cacheKey, null);
      }

      return result;
    } catch (error) {
      debugError(
        'CityArtWalks.Actions.Contact.Hooks.useCreateContact',
        'Failed to create contact',
        {
          error: error.message,
          status: error.status,
          contactData: contactData
            ? contactData instanceof FormData
              ? 'FormData'
              : 'provided'
            : 'missing',
          token: token ? '[REDACTED]' : 'none',
          originalError: error.originalError?.message,
        }
      );
      throw error;
    }
  };
}

/**
 * Hook for updating an existing contact with automatic cache invalidation
 *
 * @memberof CityArtWalks.Actions.Contact.Hooks
 * @function useUpdateContact
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to update a contact
 * @returns {Promise<Object>} returns.result - Updated contact response
 * @throws {Error} When contact data validation fails or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useUpdateContact(token = '') {
  const { mutate } = useSWRConfig();

  return async (id, contactData) => {
    try {
      const result = await requests.updateContact(id, contactData, token);

      // Invalidate SWR cache - target specific keys
      mutate(
        (key) =>
          Array.isArray(key) &&
          (key.includes('contact') ||
            key.includes('getPaginatedContacts') ||
            (key.includes('getContactById') && key.includes(id)))
      );

      // Clear related IndexedDB cache entries manually
      const cachePatterns = ['contact', 'getPaginatedContacts'];
      for (const pattern of cachePatterns) {
        const cacheKey = buildCacheKeyFromSWRKey([pattern]);
        await saveToIndexedDb(cacheKey, null);
      }

      return result;
    } catch (error) {
      debugError(
        'CityArtWalks.Actions.Contact.Hooks.useUpdateContact',
        'Failed to update contact',
        {
          error: error.message,
          contactId: id,
          contactData: contactData
            ? contactData instanceof FormData
              ? 'FormData'
              : 'provided'
            : 'missing',
          token: token ? '[REDACTED]' : 'none',
        }
      );
      throw error;
    }
  };
}

/**
 * Hook for deleting a contact with automatic cache invalidation
 *
 * @memberof CityArtWalks.Actions.Contact.Hooks
 * @function useDeleteContact
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to delete a contact
 * @returns {Promise<Object>} returns.result - Deletion response
 * @throws {Error} When contact ID is invalid or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useDeleteContact(token = '') {
  const { mutate } = useSWRConfig();

  return async (id) => {
    try {
      const result = await requests.deleteContact(id, token);

      // Invalidate SWR cache - comprehensive invalidation
      mutate(
        (key) =>
          Array.isArray(key) &&
          (key.includes('contact') ||
            key.includes('getPaginatedContacts') ||
            (key.includes('getContactById') && key.includes(id)))
      );

      // Clear related IndexedDB cache entries manually
      const cachePatterns = ['contact', 'getPaginatedContacts'];
      for (const pattern of cachePatterns) {
        const cacheKey = buildCacheKeyFromSWRKey([pattern]);
        await saveToIndexedDb(cacheKey, null);
      }

      return result;
    } catch (error) {
      debugError(
        'CityArtWalks.Actions.Contact.Hooks.useDeleteContact',
        'Failed to delete contact',
        {
          error: error.message,
          contactId: id,
          token: token ? '[REDACTED]' : 'none',
        }
      );
      throw error;
    }
  };
}

/**
 * Combined hook that provides all contact mutation functions
 *
 * @memberof CityArtWalks.Actions.Contact.Hooks
 * @function useContactMutations
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Object} Object containing all mutation functions
 * @returns {Function} returns.createContact - Function to create contact
 * @returns {Function} returns.updateContact - Function to update contact
 * @returns {Function} returns.deleteContact - Function to delete contact
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useContactMutations(token = '') {
  const createContact = useCreateContact(token);
  const updateContact = useUpdateContact(token);
  const deleteContact = useDeleteContact(token);

  return {
    createContact,
    updateContact,
    deleteContact,
  };
}
