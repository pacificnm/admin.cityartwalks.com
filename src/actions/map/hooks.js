/**
 * @file hooks.js
 * @description React hooks for Map operations using SWR for data fetching
 *
 * This module provides React hooks for managing static map data operations including
 * retrieval, creation, updates, and deletion. Uses SWR for efficient data caching
 * and state management with comprehensive error handling and loading states.
 * @namespace CityArtWalks.Actions.Map.Hooks
 * @version 1.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks patterns documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Map-Model} - Map model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Map} - Database schema reference
 */

import useSWR from 'swr';
import { useMemo, useState, useCallback } from 'react';

import { debugError } from 'src/lib/debug';

import * as requests from './requests';

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  keepPreviousData: true,
};

/**
 * Retrieves static map data by ID with SWR caching and comprehensive state management.
 * Provides optimized data fetching for static map resources with built-in loading states,
 * error handling, and cache management for enhanced performance.
 *
 * Features:
 * - SWR-based caching with optimized revalidation settings
 * - Comprehensive loading and error states
 * - Authentication support via Bearer token
 * - Automatic data transformation and validation
 * - Empty state detection for conditional rendering
 * - Performance optimized with memoization
 *
 * @function useGetStaticMap
 * @memberof CityArtWalks.Actions.Map.Hooks
 *
 * @example
 * // Basic static map retrieval
 * const { staticMap, staticMapLoading, staticMapError } = useGetStaticMap(123);
 *
 * @example
 * // With authentication
 * const { staticMap, staticMapLoading, staticMapValidating } = useGetStaticMap(123, accessToken);
 *
 * @example
 * // Conditional rendering based on states
 * const { staticMap, staticMapLoading, staticMapEmpty, staticMapError } = useGetStaticMap(mapId);
 *
 * if (staticMapLoading) return <LoadingSpinner />;
 * if (staticMapError) return <ErrorMessage error={staticMapError} />;
 * if (staticMapEmpty) return <NoDataMessage />;
 * return <MapDisplay map={staticMap} />;
 *
 * @param {string|number} id - The static map ID to fetch
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Object} Static map data and loading states
 * @returns {Object|null} returns.staticMap - The static map data
 * @returns {boolean} returns.staticMapLoading - Loading state
 * @returns {Error|null} returns.staticMapError - Error state
 * @returns {boolean} returns.staticMapValidating - Revalidation state
 * @returns {boolean} returns.staticMapEmpty - Empty state (no data and not loading)
 */
export function useGetStaticMap(id, token = '') {
  const key = id ? ['getStaticMap', id, token] : null;
  const { data, isLoading, error, isValidating } = useSWR(
    key,
    () => requests.getStaticMap(id, token),
    swrOptions
  );

  return useMemo(() => {
    const staticMap = data?.data || null;

    return {
      staticMap,
      staticMapLoading: isLoading,
      staticMapError: error,
      staticMapValidating: isValidating,
      staticMapEmpty: !isLoading && !staticMap,
    };
  }, [data, isLoading, error, isValidating]);
}

/**
 * Creates new static map data with comprehensive state management and error handling.
 * Provides a streamlined interface for creating static map resources with built-in
 * loading states, error handling, and success tracking.
 *
 * Features:
 * - Async creation with state management
 * - Comprehensive error handling and logging
 * - Success state tracking with created data
 * - Authentication support via Bearer token
 * - Loading state management
 * - Error state management and recovery
 *
 * @function useCreateStaticMap
 * @memberof CityArtWalks.Actions.Map.Hooks
 *
 * @example
 * // Basic map creation
 * const { createStaticMap, creatingStaticMap, createStaticMapError } = useCreateStaticMap(accessToken);
 *
 * const handleCreate = async () => {
 *   try {
 *     const newMap = await createStaticMap({
 *       title: 'Downtown Art Walk',
 *       coordinates: { lat: 40.7128, lng: -74.0060 },
 *       zoom: 15
 *     });
 *     console.log('Created map:', newMap);
 *   } catch (error) {
 *     console.error('Creation failed:', error);
 *   }
 * };
 *
 * @example
 * // With loading state handling
 * const { createStaticMap, creatingStaticMap, createdStaticMap } = useCreateStaticMap(token);
 *
 * return (
 *   <form onSubmit={handleSubmit}>
 *     <input name="title" placeholder="Map title" />
 *     <button disabled={creatingStaticMap}>
 *       {creatingStaticMap ? 'Creating...' : 'Create Map'}
 *     </button>
 *     {createdStaticMap && <p>Map created successfully!</p>}
 *   </form>
 * );
 *
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Object} Create static map functions and states
 * @returns {Function} returns.createStaticMap - Function to create static map
 * @returns {boolean} returns.creatingStaticMap - Creating state
 * @returns {Error|null} returns.createStaticMapError - Error state
 * @returns {Object|null} returns.createdStaticMap - Created static map data
 */
export function useCreateStaticMap(token = '') {
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [createdMap, setCreatedMap] = useState(null);

  const create = useCallback(
    async (payload) => {
      setCreating(true);
      setCreateError(null);

      try {
        const res = await requests.createStaticMap(payload, token);
        const createdData = res?.data || null;
        setCreatedMap(createdData);
        return createdData;
      } catch (err) {
        debugError('CityArtWalks.Actions.Map.Hooks.useCreateStaticMap', err);
        setCreateError(err);
        throw err;
      } finally {
        setCreating(false);
      }
    },
    [token]
  );

  return {
    createStaticMap: create,
    creatingStaticMap: creating,
    createStaticMapError: createError,
    createdStaticMap: createdMap,
  };
}

/**
 * Updates existing static map data with comprehensive state management and error handling.
 * Provides a streamlined interface for updating static map resources with built-in
 * loading states, error handling, and optimistic updates.
 *
 * Features:
 * - Async update with state management
 * - Comprehensive error handling and logging
 * - Loading state management
 * - Authentication support via Bearer token
 * - Error state management and recovery
 * - Partial update support
 *
 * @function useUpdateStaticMap
 * @memberof CityArtWalks.Actions.Map.Hooks
 *
 * @example
 * // Basic map update
 * const { updateStaticMap, updatingStaticMap, updateStaticMapError } = useUpdateStaticMap(accessToken);
 *
 * const handleUpdate = async () => {
 *   try {
 *     const updatedMap = await updateStaticMap({
 *       id: 123,
 *       title: 'Updated Downtown Art Walk',
 *       zoom: 16
 *     });
 *     console.log('Updated map:', updatedMap);
 *   } catch (error) {
 *     console.error('Update failed:', error);
 *   }
 * };
 *
 * @example
 * // With loading state and error handling
 * const { updateStaticMap, updatingStaticMap, updateStaticMapError } = useUpdateStaticMap(token);
 *
 * return (
 *   <form onSubmit={handleSubmit}>
 *     <input name="title" defaultValue={map.title} />
 *     <button disabled={updatingStaticMap}>
 *       {updatingStaticMap ? 'Updating...' : 'Update Map'}
 *     </button>
 *     {updateStaticMapError && <ErrorAlert error={updateStaticMapError} />}
 *   </form>
 * );
 *
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Object} Update static map functions and states
 * @returns {Function} returns.updateStaticMap - Function to update static map
 * @returns {boolean} returns.updatingStaticMap - Updating state
 * @returns {Error|null} returns.updateStaticMapError - Error state
 */
export function useUpdateStaticMap(token = '') {
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const update = useCallback(
    async (payload) => {
      setUpdating(true);
      setUpdateError(null);

      try {
        const res = await requests.updateStaticMap(payload, token);
        return res?.data;
      } catch (err) {
        debugError('CityArtWalks.Actions.Map.Hooks.useUpdateStaticMap', err);
        setUpdateError(err);
        throw err;
      } finally {
        setUpdating(false);
      }
    },
    [token]
  );

  return {
    updateStaticMap: update,
    updatingStaticMap: updating,
    updateStaticMapError: updateError,
  };
}

/**
 * Deletes static map data with comprehensive state management and error handling.
 * Provides a streamlined interface for deleting static map resources with built-in
 * loading states, error handling, and confirmation patterns.
 *
 * Features:
 * - Async deletion with state management
 * - Comprehensive error handling and logging
 * - Loading state management
 * - Authentication support via Bearer token
 * - Error state management and recovery
 * - Safe deletion patterns
 *
 * @function useDeleteStaticMap
 * @memberof CityArtWalks.Actions.Map.Hooks
 *
 * @example
 * // Basic map deletion
 * const { deleteStaticMap, deletingStaticMap, deleteStaticMapError } = useDeleteStaticMap(accessToken);
 *
 * const handleDelete = async () => {
 *   if (confirm('Are you sure you want to delete this map?')) {
 *     try {
 *       await deleteStaticMap(123);
 *       console.log('Map deleted successfully');
 *       // Navigate away or refresh data
 *     } catch (error) {
 *       console.error('Deletion failed:', error);
 *     }
 *   }
 * };
 *
 * @example
 * // With loading state and error handling
 * const { deleteStaticMap, deletingStaticMap, deleteStaticMapError } = useDeleteStaticMap(token);
 *
 * return (
 *   <div>
 *     <button
 *       onClick={() => deleteStaticMap(mapId)}
 *       disabled={deletingStaticMap}
 *       className="danger-button"
 *     >
 *       {deletingStaticMap ? 'Deleting...' : 'Delete Map'}
 *     </button>
 *     {deleteStaticMapError && <ErrorAlert error={deleteStaticMapError} />}
 *   </div>
 * );
 *
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Object} Delete static map functions and states
 * @returns {Function} returns.deleteStaticMap - Function to delete static map
 * @returns {boolean} returns.deletingStaticMap - Deleting state
 * @returns {Error|null} returns.deleteStaticMapError - Error state
 */
export function useDeleteStaticMap(token = '') {
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const remove = useCallback(
    async (id) => {
      setDeleting(true);
      setDeleteError(null);

      try {
        const res = await requests.deleteStaticMap(id, token);
        return res?.data;
      } catch (err) {
        debugError('CityArtWalks.Actions.Map.Hooks.useDeleteStaticMap', err);
        setDeleteError(err);
        throw err;
      } finally {
        setDeleting(false);
      }
    },
    [token]
  );

  return {
    deleteStaticMap: remove,
    deletingStaticMap: deleting,
    deleteStaticMapError: deleteError,
  };
}
