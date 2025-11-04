/**
 * @file hooks.js
 * @description SWR-based data fetching hooks for ArtPieceQueue.
 * @author Jaimie Garner
 * @version 2.1.0
 * @namespace CityArtWalks.Actions.ArtPieceQueue.Hooks
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPieceQueue} - ArtPieceQueue entity documentation
 */

import { useMemo, useEffect } from "react";

import { useBaseHook } from "src/lib/base-hook";

import { ArtPieceQueueApiClient } from "./requests";

// Create a single instance to use across all hooks
const artPieceQueueApiClient = new ArtPieceQueueApiClient();

// ==========================================
// CORE CRUD HOOKS (Required Functions)
// ==========================================

/**
 * @memberof CityArtWalks.Actions.ArtPieceQueue.Hooks
 * @function useGetPaginatedArtPieceQueues
 * @description Hook to get paginated art piece queues with full filtering, caching via IndexedDB.
 *
 * @param {Object} params - Filter parameters
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=10] - Results per page limit
 * @param {string} [params.search=''] - Search term
 * @param {string} [params.status=''] - Status filter (PENDING, PROCESSING, REVIEWING, APPROVED, REJECTED, PUBLISHED, ERROR)
 * @param {string} [params.harvestBatchId=''] - Harvest batch ID filter
 * @param {string} [params.createdBy=''] - Creator user ID filter
 * @param {string} [params.updatedBy=''] - Updater user ID filter
 * @param {string} [params.artistName=''] - Artist name filter
 * @param {string} [params.city=''] - City filter
 * @param {string} [params.state=''] - State filter
 * @param {string} [params.country=''] - Country filter
 * @param {string|null} [params.refreshKey=null] - Key to trigger refresh
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and complete API results
 * @returns {Object} result.results - Complete API results object (data, pagination, performance, query metadata)
 * @returns {boolean} result.artPieceQueuesLoading - Loading state
 * @returns {Error} result.artPieceQueuesError - Error state
 * @returns {boolean} result.artPieceQueuesValidating - Validation state
 * @returns {boolean} result.artPieceQueuesEmpty - Empty state (no data)
 * @returns {Function} result.mutate - SWR mutate function
 * @throws {Error} When parameter validation fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetPaginatedArtPieceQueues(params = {}, revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPieceQueue.Hooks");

  const {
    page = 1,
    limit = 10,
    search = "",
    status = "",
    harvestBatchId = "",
    createdBy = "",
    updatedBy = "",
    artistName = "",
    city = "",
    state = "",
    country = "",
    refreshKey = null,
  } = params;

  const { swrKey } = useMemo(() => {
    const key = [
      "getPaginatedArtPieceQueues",
      page,
      limit,
      search,
      status,
      harvestBatchId,
      createdBy,
      updatedBy,
      artistName,
      city,
      state,
      country,
      revalidate,
    ];
    return baseHook.utils.generateKeys(key);
  }, [
    baseHook.utils,
    page,
    limit,
    search,
    status,
    harvestBatchId,
    createdBy,
    updatedBy,
    artistName,
    city,
    state,
    country,
    revalidate,
  ]);

  const { data, isLoading, error, isValidating, mutate } =
    baseHook.useSWRWithCache(
      swrKey,
      async () => {
        const response = await artPieceQueueApiClient.getPaginatedArtPieceQueues(
          { page, limit, search, status, harvestBatchId, createdBy, updatedBy, artistName, city, state, country },
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
      artPieceQueuesLoading: isLoading,
      artPieceQueuesError: error,
      artPieceQueuesValidating: isValidating,
      artPieceQueuesEmpty: !isLoading && (!results.data || results.data.length === 0),
      mutate,
    };
  }, [data, isLoading, error, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.ArtPieceQueue.Hooks
 * @function useGetArtPieceQueue
 * @description Hook to get art piece queue by ID with IndexedDB caching.
 *
 * @param {string|number} artPieceQueueId - The art piece queue ID
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and queue data
 * @throws {Error} When artPieceQueueId is invalid or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetArtPieceQueue(artPieceQueueId, revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPieceQueue.Hooks");

  const { swrKey } = useMemo(() => {
    if (!artPieceQueueId) return { swrKey: null };
    const key = ["getArtPieceQueue", artPieceQueueId, revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, artPieceQueueId, revalidate]);

  const { data, isLoading, error, isValidating, mutate } =
    baseHook.useSWRWithCache(
      swrKey,
      async () => {
        const response = await artPieceQueueApiClient.getArtPieceQueue(artPieceQueueId, revalidate);
        return response;
      },
      revalidate
    );

  return useMemo(() => {
    const artPieceQueue = data?.results?.data || null;
    return {
      artPieceQueue,
      artPieceQueueLoading: isLoading,
      artPieceQueueError: error,
      artPieceQueueValidating: isValidating,
      artPieceQueueEmpty: !isLoading && !artPieceQueue,
      mutate,
    };
  }, [data, isLoading, error, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.ArtPieceQueue.Hooks
 * @function useCreateArtPieceQueue
 * @description Hook to create a new art piece queue with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (artPieceQueue) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When art piece queue data validation fails or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const createQueue = useCreateArtPieceQueue();
 * await createQueue.mutate(queueData);
 */
export function useCreateArtPieceQueue() {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPieceQueue.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (artPieceQueue) => {
      const result = await artPieceQueueApiClient.createArtPieceQueue(artPieceQueue);
      return result;
    },
    ["artPieceQueue", "getPaginatedArtPieceQueues"]
  );
}

/**
 * @memberof CityArtWalks.Actions.ArtPieceQueue.Hooks
 * @function useUpdateArtPieceQueue
 * @description Hook to update an existing art piece queue with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (id, artPieceQueueData) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When art piece queue ID is missing, data validation fails, or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const updateQueue = useUpdateArtPieceQueue();
 * await updateQueue.mutate(queueId, updatedData);
 */
export function useUpdateArtPieceQueue() {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPieceQueue.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (id, artPieceQueue) => {
      // Validate parameters
      if (!id) {
        baseHook.logger.error("useUpdateArtPieceQueue", "ArtPieceQueue ID is required");
        throw new Error("ArtPieceQueue ID is required");
      }

      const result = await artPieceQueueApiClient.updateArtPieceQueue(id, artPieceQueue);
      return result;
    },
    ["artPieceQueue", "getPaginatedArtPieceQueues"]
  );
}

/**
 * @memberof CityArtWalks.Actions.ArtPieceQueue.Hooks
 * @function useDeleteArtPieceQueue
 * @description Hook to delete an art piece queue with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (id) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When art piece queue ID is missing or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const deleteQueue = useDeleteArtPieceQueue();
 * await deleteQueue.mutate(queueId);
 */
export function useDeleteArtPieceQueue() {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPieceQueue.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (id) => {
      // Validate parameters
      if (!id) {
        baseHook.logger.error("useDeleteArtPieceQueue", "ArtPieceQueue ID is required");
        throw new Error("ArtPieceQueue ID is required");
      }

      const result = await artPieceQueueApiClient.deleteArtPieceQueue(id);
      return result;
    },
    ["artPieceQueue", "getPaginatedArtPieceQueues"]
  );
}

// ==========================================
// SPECIALIZED QUERY HOOKS
// ==========================================

/**
 * @memberof CityArtWalks.Actions.ArtPieceQueue.Hooks
 * @function useGetArtPieceQueueStats
 * @description Hook to get art piece queue statistics with IndexedDB caching.
 *
 * @param {number} [revalidate=300] - Optional ISR revalidate time in seconds (5 minutes default for stats)
 * @returns {Object} Result including loading states, errors, and stats data
 * @throws {Error} When API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetArtPieceQueueStats(revalidate = 300) {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPieceQueue.Hooks");

  const { swrKey } = useMemo(() => {
    const key = ["getArtPieceQueueStats", revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, revalidate]);

  const { data, isLoading, error, isValidating } = baseHook.useSWRWithCache(
    swrKey,
    async () => {
      const response = await artPieceQueueApiClient.getArtPieceQueueStats(revalidate);
      return response;
    },
    revalidate
  );

  return useMemo(() => {
    const stats = data?.results?.data || {};
    return {
      stats,
      statsLoading: isLoading,
      statsError: error,
      statsValidating: isValidating,
      statsEmpty: !isLoading && Object.keys(stats).length === 0,
    };
  }, [data, isLoading, error, isValidating]);
}

/**
 * @memberof CityArtWalks.Actions.ArtPieceQueue.Hooks
 * @function useFetchHtmlForExtraction
 * @description Hook to fetch HTML content from URL for AI extraction.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (sourceUrl, queueId) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When parameters are invalid or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const fetchHtml = useFetchHtmlForExtraction();
 * await fetchHtml.mutate(sourceUrl, queueId);
 */
export function useFetchHtmlForExtraction() {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPieceQueue.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (sourceUrl, queueId) => {
      // Validate parameters
      if (!sourceUrl || !queueId) {
        baseHook.logger.error("useFetchHtmlForExtraction", "sourceUrl and queueId are required");
        throw new Error("sourceUrl and queueId are required");
      }

      const result = await artPieceQueueApiClient.fetchHtmlForExtraction(sourceUrl, queueId);
      return result;
    },
    ["artPieceQueue", "getArtPieceQueue"]
  );
}

/**
 * @memberof CityArtWalks.Actions.ArtPieceQueue.Hooks
 * @function useExtractDataFromHtml
 * @description Hook to extract art piece data from HTML using AI.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (queueId, htmlFilePath) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When parameters are invalid or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const extractData = useExtractDataFromHtml();
 * await extractData.mutate(queueId, htmlFilePath);
 */
export function useExtractDataFromHtml() {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPieceQueue.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (queueId, htmlFilePath) => {
      // Validate parameters
      if (!queueId || !htmlFilePath) {
        baseHook.logger.error("useExtractDataFromHtml", "queueId and htmlFilePath are required");
        throw new Error("queueId and htmlFilePath are required");
      }

      const result = await artPieceQueueApiClient.extractDataFromHtml(queueId, htmlFilePath);
      return result;
    },
    ["artPieceQueue", "getArtPieceQueue"]
  );
}

/**
 * @memberof CityArtWalks.Actions.ArtPieceQueue.Hooks
 * @function useArtPieceQueueMutations
 * @description Hook that returns all art piece queue mutation functions for convenient access.
 *
 * @returns {Object} Collection of all art piece queue mutation functions
 * @returns {Function} result.createArtPieceQueue - Create art piece queue mutation function
 * @returns {Function} result.updateArtPieceQueue - Update art piece queue mutation function
 * @returns {Function} result.deleteArtPieceQueue - Delete art piece queue mutation function
 * @returns {Function} result.fetchHtmlForExtraction - Fetch HTML for extraction mutation function
 * @returns {Function} result.extractDataFromHtml - Extract data from HTML mutation function
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const { createArtPieceQueue, updateArtPieceQueue, deleteArtPieceQueue, fetchHtmlForExtraction, extractDataFromHtml } = useArtPieceQueueMutations();
 * await createArtPieceQueue.mutate(queueData);
 * await updateArtPieceQueue.mutate(queueId, updatedData);
 * await deleteArtPieceQueue.mutate(queueId);
 * await fetchHtmlForExtraction.mutate(sourceUrl, queueId);
 * await extractDataFromHtml.mutate(queueId, htmlFilePath);
 */
export function useArtPieceQueueMutations() {
  const createArtPieceQueue = useCreateArtPieceQueue();
  const updateArtPieceQueue = useUpdateArtPieceQueue();
  const deleteArtPieceQueue = useDeleteArtPieceQueue();
  const fetchHtmlForExtraction = useFetchHtmlForExtraction();
  const extractDataFromHtml = useExtractDataFromHtml();

  return {
    createArtPieceQueue,
    updateArtPieceQueue,
    deleteArtPieceQueue,
    fetchHtmlForExtraction,
    extractDataFromHtml,
  };
}
