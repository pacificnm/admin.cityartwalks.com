/**
 * @file hooks.js
 * @description SWR-based data fetching hooks for ArtPieceType.
 * @author Jaimie Garner
 * @version 2.1.0
 * @namespace CityArtWalks.Actions.ArtPieceType.Hooks
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPieceType} - ArtPieceType entity documentation
 */

import { useMemo, useEffect } from "react";

import { useBaseHook } from "src/lib/base-hook";

import { ArtPieceTypeApiClient } from "./requests";

// Create a single instance to use across all hooks
const artPieceTypeApiClient = new ArtPieceTypeApiClient();

/**
 * @memberof CityArtWalks.Actions.ArtPieceType.Hooks
 * @function useGetPaginatedArtPieceTypes
 * @description Hook to get paginated art piece types with full filtering, caching via IndexedDB.
 *
 * @param {Object} params - Filter parameters
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=10] - Results per page limit
 * @param {string} [params.search=''] - Search term
 * @param {string} [params.status=''] - Status filter (ACTIVE, DELETED, etc.)
 * @param {string} [params.createdBy=''] - Creator user ID filter
 * @param {string} [params.featured=''] - Featured filter
 * @param {string|null} [params.refreshKey=null] - Key to trigger refresh
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and complete API results
 * @returns {Object} result.results - Complete API results object (data, pagination, performance, query metadata)
 * @returns {boolean} result.artPieceTypesLoading - Loading state
 * @returns {Error} result.artPieceTypesError - Error state
 * @returns {boolean} result.artPieceTypesValidating - Validation state
 * @returns {boolean} result.artPieceTypesEmpty - Empty state (no data)
 * @returns {Function} result.mutate - SWR mutate function
 * @throws {Error} When parameter validation fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetPaginatedArtPieceTypes(params = {}, revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPieceType.Hooks");

  const {
    page = 1,
    limit = 10,
    search = "",
    status = "",
    createdBy = "",
    featured = "",
    refreshKey = null,
  } = params;

  const { swrKey } = useMemo(() => {
    const key = [
      "getPaginatedArtPieceTypes",
      page,
      limit,
      search,
      status,
      createdBy,
      featured,
      revalidate,
    ];
    return baseHook.utils.generateKeys(key);
  }, [
    baseHook.utils,
    page,
    limit,
    search,
    status,
    createdBy,
    featured,
    revalidate,
  ]);

  const { data, isLoading, error, isValidating, mutate } =
    baseHook.useSWRWithCache(
      swrKey,
      async () => {
        const response = await artPieceTypeApiClient.getPaginatedArtPieceTypes(
          { page, limit, search, status, createdBy, featured },
          revalidate
        );
        return response;
      },
      revalidate
    );

  useEffect(() => {
    if (refreshKey) mutate();
  }, [refreshKey, mutate]);

  return useMemo(() => {
    const results = data?.results || {};
    return {
      results, // Complete API results object with data, pagination, performance, etc.
      artPieceTypesLoading: isLoading,
      artPieceTypesError: error,
      artPieceTypesValidating: isValidating,
      artPieceTypesEmpty: !isLoading && (!results.data || results.data.length === 0),
      mutate,
    };
  }, [data, isLoading, error, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.ArtPieceType.Hooks
 * @function useGetArtPieceType
 * @description Hook to get art piece type by ID with IndexedDB caching.
 *
 * @param {string|number} artPieceTypeId - The art piece type ID
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and type data
 * @throws {Error} When artPieceTypeId is invalid or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetArtPieceType(artPieceTypeId, revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPieceType.Hooks");

  const { swrKey } = useMemo(() => {
    if (!artPieceTypeId) return { swrKey: null };
    const key = ["getArtPieceType", artPieceTypeId, revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, artPieceTypeId, revalidate]);

  const { data, isLoading, error, isValidating, mutate } =
    baseHook.useSWRWithCache(
      swrKey,
      async () => {
        const response = await artPieceTypeApiClient.getArtPieceType(artPieceTypeId, revalidate);
        return response;
      },
      revalidate
    );

  return useMemo(() => {
    const artPieceType = data?.results?.data || null;
    return {
      artPieceType,
      artPieceTypeLoading: isLoading,
      artPieceTypeError: error,
      artPieceTypeValidating: isValidating,
      artPieceTypeEmpty: !isLoading && !artPieceType,
      mutate,
    };
  }, [data, isLoading, error, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.ArtPieceType.Hooks
 * @function useCreateArtPieceType
 * @description Hook to create a new art piece type with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (artPieceType) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When art piece type data validation fails or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const createArtPieceType = useCreateArtPieceType();
 * await createArtPieceType.mutate(artPieceTypeData);
 */
export function useCreateArtPieceType() {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPieceType.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (artPieceType) => {
      const result = await artPieceTypeApiClient.createArtPieceType(artPieceType);
      return result;
    },
    ["artPieceType", "getPaginatedArtPieceTypes"]
  );
}

/**
 * @memberof CityArtWalks.Actions.ArtPieceType.Hooks
 * @function useUpdateArtPieceType
 * @description Hook to update an existing art piece type with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (id, artPieceTypeData) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When art piece type ID is missing, data validation fails, or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const updateArtPieceType = useUpdateArtPieceType();
 * await updateArtPieceType.mutate(artPieceTypeId, updatedData);
 */
export function useUpdateArtPieceType() {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPieceType.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (id, artPieceType) => {
      // Validate parameters
      if (!id) {
        baseHook.logger.error("useUpdateArtPieceType", "ArtPieceType ID is required");
        throw new Error("ArtPieceType ID is required");
      }

      const result = await artPieceTypeApiClient.updateArtPieceType(id, artPieceType);
      return result;
    },
    ["artPieceType", "getPaginatedArtPieceTypes"]
  );
}

/**
 * @memberof CityArtWalks.Actions.ArtPieceType.Hooks
 * @function useDeleteArtPieceType
 * @description Hook to delete an art piece type with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (id) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When art piece type ID is missing or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const deleteArtPieceType = useDeleteArtPieceType();
 * await deleteArtPieceType.mutate(artPieceTypeId);
 */
export function useDeleteArtPieceType() {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPieceType.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (id) => {
      // Validate parameters
      if (!id) {
        baseHook.logger.error("useDeleteArtPieceType", "ArtPieceType ID is required");
        throw new Error("ArtPieceType ID is required");
      }

      const result = await artPieceTypeApiClient.deleteArtPieceType(id);
      return result;
    },
    ["artPieceType", "getPaginatedArtPieceTypes"]
  );
}

/**
 * @memberof CityArtWalks.Actions.ArtPieceType.Hooks
 * @function useArtPieceTypeMutations
 * @description Hook that returns all art piece type mutation functions for convenient access.
 *
 * @returns {Object} Collection of all art piece type mutation functions
 * @returns {Function} result.createArtPieceType - Create art piece type mutation function
 * @returns {Function} result.updateArtPieceType - Update art piece type mutation function
 * @returns {Function} result.deleteArtPieceType - Delete art piece type mutation function
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const { createArtPieceType, updateArtPieceType, deleteArtPieceType } = useArtPieceTypeMutations();
 * await createArtPieceType.mutate(artPieceTypeData);
 * await updateArtPieceType.mutate(artPieceTypeId, updatedData);
 * await deleteArtPieceType.mutate(artPieceTypeId);
 */
export function useArtPieceTypeMutations() {
  const createArtPieceType = useCreateArtPieceType();
  const updateArtPieceType = useUpdateArtPieceType();
  const deleteArtPieceType = useDeleteArtPieceType();

  return {
    createArtPieceType,
    updateArtPieceType,
    deleteArtPieceType,
  };
}
