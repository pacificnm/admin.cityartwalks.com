/**
 * @file hooks.js
 * @description SWR-based data fetching hooks for ArtPieceTags.
 * @author Jaimie Garner
 * @version 2.1.0
 * @namespace CityArtWalks.Actions.ArtPieceTag.Hooks
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPieceTag} - ArtPieceTag entity documentation
 */

import { useMemo, useEffect } from "react";

import { useBaseHook } from "src/lib/base-hook";
import {
  artPieceTagQuerySchema,
  createArtPieceTagSchema,
  updateArtPieceTagSchema,
} from "src/validators/art-piece-tag";

import { ArtPieceTagApiClient } from "./requests";

// Create a single instance to use across all hooks
const artPieceTagApiClient = new ArtPieceTagApiClient();

/**
 * @memberof CityArtWalks.Actions.ArtPieceTag.Hooks
 * @function useGetPaginatedArtPieceTags
 * @description Hook to get paginated art piece tags with full filtering, caching via IndexedDB.
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
 * @returns {boolean} result.artPieceTagsLoading - Loading state
 * @returns {Error} result.artPieceTagsError - Error state
 * @returns {boolean} result.artPieceTagsValidating - Validation state
 * @returns {boolean} result.artPieceTagsEmpty - Empty state (no data)
 * @returns {Function} result.mutate - SWR mutate function
 * @throws {Error} When parameter validation fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetPaginatedArtPieceTags(params = {}, revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPieceTag.Hooks");

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
        artPieceTagQuerySchema,
        "useGetPaginatedArtPieceTags"
      ),
    [baseHook.validators, page, limit, search, active, createdBy]
  );

  const { swrKey } = useMemo(() => {
    if (!validationResult.success) {
      return { swrKey: null };
    }

    const key = [
      "getPaginatedArtPieceTags",
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
        const response = await artPieceTagApiClient.getPaginatedArtPieceTags(
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
      artPieceTagsLoading: isLoading,
      artPieceTagsError: error,
      artPieceTagsValidating: isValidating,
      artPieceTagsEmpty: !isLoading && (!results.data || results.data.length === 0),
      mutate,
    };
  }, [data, isLoading, error, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.ArtPieceTag.Hooks
 * @function useGetArtPieceTag
 * @description Hook to get art piece tag by ID with IndexedDB caching.
 *
 * @param {string|number} artPieceTagId - The art piece tag ID
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and tag data
 * @throws {Error} When artPieceTagId is invalid or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetArtPieceTag(artPieceTagId, revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPieceTag.Hooks");

  // Validate artPieceTagId parameter
  useEffect(() => {
    if (
      artPieceTagId &&
      !baseHook.validators.validateWithSchema(
        ["string", "number"],
        artPieceTagId,
        "artPieceTagId",
        "useGetArtPieceTag"
      )
    ) {
      // Validation handled by base hook
    }
  }, [baseHook.validators, artPieceTagId]);

  const { swrKey } = useMemo(() => {
    if (!artPieceTagId) return { swrKey: null };
    const key = ["getArtPieceTag", artPieceTagId, revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, artPieceTagId, revalidate]);

  const { data, isLoading, error, isValidating, mutate } =
    baseHook.useSWRWithCache(
      swrKey,
      async () => {
        const response = await artPieceTagApiClient.getArtPieceTag(artPieceTagId, revalidate);
        return response;
      },
      revalidate
    );

  return useMemo(() => {
    const artPieceTag = data?.results?.data || null;
    return {
      artPieceTag,
      artPieceTagLoading: isLoading,
      artPieceTagError: error,
      artPieceTagValidating: isValidating,
      artPieceTagEmpty: !isLoading && !artPieceTag,
      mutate,
    };
  }, [data, isLoading, error, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.ArtPieceTag.Hooks
 * @function useCreateArtPieceTag
 * @description Hook to create a new art piece tag with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (artPieceTag) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When art piece tag data validation fails or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const createArtPieceTag = useCreateArtPieceTag();
 * await createArtPieceTag.mutate(artPieceTagData);
 */
export function useCreateArtPieceTag() {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPieceTag.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (artPieceTag) => {
      // Validate art piece tag data if not FormData
      if (!(artPieceTag instanceof FormData)) {
        baseHook.validators.validateWithSchema(
          artPieceTag,
          createArtPieceTagSchema,
          "useCreateArtPieceTag",
          true // throw on error
        );
      }

      const result = await artPieceTagApiClient.createArtPieceTag(artPieceTag);
      return result;
    },
    ["artPieceTag", "getPaginatedArtPieceTags"]
  );
}

/**
 * @memberof CityArtWalks.Actions.ArtPieceTag.Hooks
 * @function useUpdateArtPieceTag
 * @description Hook to update an existing art piece tag with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (id, artPieceTagData) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When art piece tag ID is missing, data validation fails, or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const updateArtPieceTag = useUpdateArtPieceTag();
 * await updateArtPieceTag.mutate(artPieceTagId, updatedData);
 */
export function useUpdateArtPieceTag() {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPieceTag.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (id, artPieceTag) => {
      // Validate parameters
      if (!id) {
        baseHook.logger.error("useUpdateArtPieceTag", "ArtPieceTag ID is required");
        throw new Error("ArtPieceTag ID is required");
      }

      // Validate art piece tag data if not FormData
      if (!(artPieceTag instanceof FormData)) {
        baseHook.validators.validateWithSchema(
          artPieceTag,
          updateArtPieceTagSchema,
          "useUpdateArtPieceTag",
          true // throw on error
        );
      }

      const result = await artPieceTagApiClient.updateArtPieceTag(id, artPieceTag);
      return result;
    },
    ["artPieceTag", "getPaginatedArtPieceTags"]
  );
}

/**
 * @memberof CityArtWalks.Actions.ArtPieceTag.Hooks
 * @function useDeleteArtPieceTag
 * @description Hook to delete an art piece tag with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (id) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When art piece tag ID is missing or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const deleteArtPieceTag = useDeleteArtPieceTag();
 * await deleteArtPieceTag.mutate(artPieceTagId);
 */
export function useDeleteArtPieceTag() {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPieceTag.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (id) => {
      // Validate parameters
      if (!id) {
        baseHook.logger.error("useDeleteArtPieceTag", "ArtPieceTag ID is required");
        throw new Error("ArtPieceTag ID is required");
      }

      const result = await artPieceTagApiClient.deleteArtPieceTag(id);
      return result;
    },
    ["artPieceTag", "getPaginatedArtPieceTags"]
  );
}

/**
 * @memberof CityArtWalks.Actions.ArtPieceTag.Hooks
 * @function useArtPieceTagMutations
 * @description Hook that returns all art piece tag mutation functions for convenient access.
 *
 * @returns {Object} Collection of all art piece tag mutation functions
 * @returns {Function} result.createArtPieceTag - Create art piece tag mutation function
 * @returns {Function} result.updateArtPieceTag - Update art piece tag mutation function
 * @returns {Function} result.deleteArtPieceTag - Delete art piece tag mutation function
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const { createArtPieceTag, updateArtPieceTag, deleteArtPieceTag } = useArtPieceTagMutations();
 * await createArtPieceTag.mutate(artPieceTagData);
 * await updateArtPieceTag.mutate(artPieceTagId, updatedData);
 * await deleteArtPieceTag.mutate(artPieceTagId);
 */
export function useArtPieceTagMutations() {
  const createArtPieceTag = useCreateArtPieceTag();
  const updateArtPieceTag = useUpdateArtPieceTag();
  const deleteArtPieceTag = useDeleteArtPieceTag();

  return {
    createArtPieceTag,
    updateArtPieceTag,
    deleteArtPieceTag,
  };
}
