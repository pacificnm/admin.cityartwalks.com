/**
 * @file hooks.js
 * @description SWR-based data fetching hooks for ArtPieceMaterials.
 * @author Jaimie Garner
 * @version 2.1.0
 * @namespace CityArtWalks.Actions.ArtPieceMaterial.Hooks
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPieceMaterial} - ArtPieceMaterial entity documentation
 */

import { useMemo, useEffect } from "react";

import { useBaseHook } from "src/lib/base-hook";
import {
  artPieceMaterialQuerySchema,
  createArtPieceMaterialSchema,
  updateArtPieceMaterialSchema,
} from "src/validators/art-piece-material";

import { ArtPieceMaterialApiClient } from "./requests";

// Create a single instance to use across all hooks
const artPieceMaterialApiClient = new ArtPieceMaterialApiClient();

/**
 * @memberof CityArtWalks.Actions.ArtPieceMaterial.Hooks
 * @function useGetPaginatedArtPieceMaterials
 * @description Hook to get paginated art piece materials with full filtering, caching via IndexedDB.
 *
 * @param {Object} params - Filter parameters
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=10] - Results per page limit
 * @param {string} [params.search=''] - Search term
 * @param {string} [params.active] - Active status filter
 * @param {string} [params.createdBy] - Creator user ID filter
 * @param {string|null} [params.refreshKey=null] - Key to trigger refresh
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and complete API results
 * @returns {Object} result.results - Complete API results object (data, pagination, performance, query metadata)
 * @returns {boolean} result.artPieceMaterialsLoading - Loading state
 * @returns {Error} result.artPieceMaterialsError - Error state
 * @returns {boolean} result.artPieceMaterialsValidating - Validation state
 * @returns {boolean} result.artPieceMaterialsEmpty - Empty state (no data)
 * @returns {Function} result.mutate - SWR mutate function
 * @throws {Error} When parameter validation fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetPaginatedArtPieceMaterials(params = {}, revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPieceMaterial.Hooks");

  const {
    page = 1,
    limit = 10,
    search = "",
    active,
    createdBy,
    refreshKey = null,
  } = params;

  // Validate parameters using Zod schema
  const validationResult = useMemo(
    () =>
      baseHook.validators.validateWithSchema(
        { page, limit, search, active, createdBy },
        artPieceMaterialQuerySchema,
        "useGetPaginatedArtPieceMaterials"
      ),
    [baseHook.validators, page, limit, search, active, createdBy]
  );

  const { swrKey } = useMemo(() => {
    if (!validationResult.success) {
      return { swrKey: null };
    }

    const key = [
      "getPaginatedArtPieceMaterials",
      page,
      limit,
      search,
      active,
      createdBy,
      revalidate,
    ];
    return baseHook.utils.generateKeys(key);
  }, [
    baseHook.utils,
    validationResult.success,
    page,
    limit,
    search,
    active,
    createdBy,
    revalidate,
  ]);

  const { data, isLoading, error, isValidating, mutate } =
    baseHook.useSWRWithCache(
      swrKey,
      async () => {
        const response = await artPieceMaterialApiClient.getPaginatedArtPieceMaterials(
          { page, limit, search, active, createdBy },
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
      artPieceMaterialsLoading: isLoading,
      artPieceMaterialsError: error,
      artPieceMaterialsValidating: isValidating,
      artPieceMaterialsEmpty: !isLoading && (!results.data || results.data.length === 0),
      mutate,
    };
  }, [data, isLoading, error, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.ArtPieceMaterial.Hooks
 * @function useGetArtPieceMaterials
 * @description Hook to get all art piece materials (non-paginated), with IndexedDB caching.
 *
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and list of materials
 * @throws {Error} When API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetArtPieceMaterials(revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPieceMaterial.Hooks");

  const { swrKey } = useMemo(() => {
    const key = ["getArtPieceMaterials", revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, revalidate]);

  const { data, isLoading, error, isValidating } = baseHook.useSWRWithCache(
    swrKey,
    async () => {
      const response = await artPieceMaterialApiClient.getArtPieceMaterials(revalidate);
      return response;
    },
    revalidate
  );

  return useMemo(() => {
    const artPieceMaterials = data?.results?.data || [];
    return {
      artPieceMaterials,
      artPieceMaterialsLoading: isLoading,
      artPieceMaterialsError: error,
      artPieceMaterialsValidating: isValidating,
      artPieceMaterialsEmpty: !isLoading && artPieceMaterials.length === 0,
    };
  }, [data, isLoading, error, isValidating]);
}

/**
 * @memberof CityArtWalks.Actions.ArtPieceMaterial.Hooks
 * @function useGetArtPieceMaterial
 * @description Hook to get art piece material by ID with IndexedDB caching.
 *
 * @param {string|number} artPieceMaterialId - The art piece material ID
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and material data
 * @throws {Error} When artPieceMaterialId is invalid or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetArtPieceMaterial(artPieceMaterialId, revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPieceMaterial.Hooks");

  // Validate artPieceMaterialId parameter
  useEffect(() => {
    if (
      artPieceMaterialId &&
      !baseHook.validators.validateWithSchema(
        ["string", "number"],
        artPieceMaterialId,
        "artPieceMaterialId",
        "useGetArtPieceMaterial"
      )
    ) {
      // Validation handled by base hook
    }
  }, [baseHook.validators, artPieceMaterialId]);

  const { swrKey } = useMemo(() => {
    if (!artPieceMaterialId) return { swrKey: null };
    const key = ["getArtPieceMaterial", artPieceMaterialId, revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, artPieceMaterialId, revalidate]);

  const { data, isLoading, error, isValidating, mutate } =
    baseHook.useSWRWithCache(
      swrKey,
      async () => {
        const response = await artPieceMaterialApiClient.getArtPieceMaterial(artPieceMaterialId, revalidate);
        return response;
      },
      revalidate
    );

  return useMemo(() => {
    const artPieceMaterial = data?.results?.data || null;
    return {
      artPieceMaterial,
      artPieceMaterialLoading: isLoading,
      artPieceMaterialError: error,
      artPieceMaterialValidating: isValidating,
      artPieceMaterialEmpty: !isLoading && !artPieceMaterial,
      mutate,
    };
  }, [data, isLoading, error, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.ArtPieceMaterial.Hooks
 * @function useCreateArtPieceMaterial
 * @description Hook to create a new art piece material with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (artPieceMaterial) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When art piece material data validation fails or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const createArtPieceMaterial = useCreateArtPieceMaterial();
 * await createArtPieceMaterial.mutate(artPieceMaterialData);
 */
export function useCreateArtPieceMaterial() {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPieceMaterial.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (artPieceMaterial) => {
      // Validate art piece material data if not FormData
      if (!(artPieceMaterial instanceof FormData)) {
        baseHook.validators.validateWithSchema(
          artPieceMaterial,
          createArtPieceMaterialSchema,
          "useCreateArtPieceMaterial",
          true // throw on error
        );
      }

      const result = await artPieceMaterialApiClient.createArtPieceMaterial(artPieceMaterial);
      return result;
    },
    ["artPieceMaterial", "getPaginatedArtPieceMaterials"]
  );
}

/**
 * @memberof CityArtWalks.Actions.ArtPieceMaterial.Hooks
 * @function useUpdateArtPieceMaterial
 * @description Hook to update an existing art piece material with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (id, artPieceMaterialData) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When art piece material ID is missing, data validation fails, or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const updateArtPieceMaterial = useUpdateArtPieceMaterial();
 * await updateArtPieceMaterial.mutate(artPieceMaterialId, updatedData);
 */
export function useUpdateArtPieceMaterial() {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPieceMaterial.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (id, artPieceMaterial) => {
      // Validate parameters
      if (!id) {
        baseHook.logger.error("useUpdateArtPieceMaterial", "ArtPieceMaterial ID is required");
        throw new Error("ArtPieceMaterial ID is required");
      }

      // Validate art piece material data if not FormData
      if (!(artPieceMaterial instanceof FormData)) {
        baseHook.validators.validateWithSchema(
          artPieceMaterial,
          updateArtPieceMaterialSchema,
          "useUpdateArtPieceMaterial",
          true // throw on error
        );
      }

      const result = await artPieceMaterialApiClient.updateArtPieceMaterial(id, artPieceMaterial);
      return result;
    },
    ["artPieceMaterial", "getPaginatedArtPieceMaterials"]
  );
}

/**
 * @memberof CityArtWalks.Actions.ArtPieceMaterial.Hooks
 * @function useDeleteArtPieceMaterial
 * @description Hook to delete an art piece material with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (id) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When art piece material ID is missing or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const deleteArtPieceMaterial = useDeleteArtPieceMaterial();
 * await deleteArtPieceMaterial.mutate(artPieceMaterialId);
 */
export function useDeleteArtPieceMaterial() {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPieceMaterial.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (id) => {
      // Validate parameters
      if (!id) {
        baseHook.logger.error("useDeleteArtPieceMaterial", "ArtPieceMaterial ID is required");
        throw new Error("ArtPieceMaterial ID is required");
      }

      const result = await artPieceMaterialApiClient.deleteArtPieceMaterial(id);
      return result;
    },
    ["artPieceMaterial", "getPaginatedArtPieceMaterials"]
  );
}

/**
 * @memberof CityArtWalks.Actions.ArtPieceMaterial.Hooks
 * @function useArtPieceMaterialMutations
 * @description Hook that returns all art piece material mutation functions for convenient access.
 *
 * @returns {Object} Collection of all art piece material mutation functions
 * @returns {Function} result.createArtPieceMaterial - Create art piece material mutation function
 * @returns {Function} result.updateArtPieceMaterial - Update art piece material mutation function
 * @returns {Function} result.deleteArtPieceMaterial - Delete art piece material mutation function
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const { createArtPieceMaterial, updateArtPieceMaterial, deleteArtPieceMaterial } = useArtPieceMaterialMutations();
 * await createArtPieceMaterial.mutate(artPieceMaterialData);
 * await updateArtPieceMaterial.mutate(artPieceMaterialId, updatedData);
 * await deleteArtPieceMaterial.mutate(artPieceMaterialId);
 */
export function useArtPieceMaterialMutations() {
  const createArtPieceMaterial = useCreateArtPieceMaterial();
  const updateArtPieceMaterial = useUpdateArtPieceMaterial();
  const deleteArtPieceMaterial = useDeleteArtPieceMaterial();

  return {
    createArtPieceMaterial,
    updateArtPieceMaterial,
    deleteArtPieceMaterial,
  };
}
