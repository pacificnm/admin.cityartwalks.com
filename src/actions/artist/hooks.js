/**
 * @file hooks.js
 * @description SWR-based data fetching hooks for Artist.
 * @author Jaimie Garner
 * @version 2.1.0
 * @namespace CityArtWalks.Actions.Artist.Hooks
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Artist} - Artist entity documentation
 */

import { useMemo, useEffect } from "react";

import { useBaseHook } from "src/lib/base-hook";

import { ArtistApiClient } from "./requests";

// Create a single instance to use across all hooks
const artistApiClient = new ArtistApiClient();

/**
 * @memberof CityArtWalks.Actions.Artist.Hooks
 * @function useGetPaginatedArtists
 * @description Hook to get paginated artists with full filtering, caching via IndexedDB.
 *
 * @param {Object} params - Filter parameters
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=10] - Results per page limit
 * @param {string} [params.search=''] - Search term
 * @param {string} [params.status=''] - Status filter (ACTIVE, DELETED, etc.)
 * @param {string} [params.createdBy=''] - Creator user ID filter
 * @param {string} [params.cityId=''] - City ID filter
 * @param {string} [params.stateId=''] - State ID filter
 * @param {string} [params.countryId=''] - Country ID filter
 * @param {string} [params.featured=''] - Featured filter
 * @param {string|null} [params.refreshKey=null] - Key to trigger refresh
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and complete API results
 * @returns {Object} result.results - Complete API results object (data, pagination, performance, query metadata)
 * @returns {boolean} result.artistsLoading - Loading state
 * @returns {Error} result.artistsError - Error state
 * @returns {boolean} result.artistsValidating - Validation state
 * @returns {boolean} result.artistsEmpty - Empty state (no data)
 * @returns {Function} result.mutate - SWR mutate function
 * @throws {Error} When parameter validation fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetPaginatedArtists(params = {}, revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.Artist.Hooks");

  const {
    page = 1,
    limit = 10,
    search = "",
    status = "",
    createdBy = "",
    cityId = "",
    stateId = "",
    countryId = "",
    featured = "",
    refreshKey = null,
  } = params;

  const { swrKey } = useMemo(() => {
    const key = [
      "getPaginatedArtists",
      page,
      limit,
      search,
      status,
      createdBy,
      cityId,
      stateId,
      countryId,
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
    cityId,
    stateId,
    countryId,
    featured,
    revalidate,
  ]);

  const { data, isLoading, error, isValidating, mutate } =
    baseHook.useSWRWithCache(
      swrKey,
      async () => {
        const response = await artistApiClient.getPaginatedArtists(
          { page, limit, search, status, createdBy, cityId, stateId, countryId, featured },
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
      artistsLoading: isLoading,
      artistsError: error,
      artistsValidating: isValidating,
      artistsEmpty: !isLoading && (!results.data || results.data.length === 0),
      mutate,
    };
  }, [data, isLoading, error, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.Artist.Hooks
 * @function useGetArtist
 * @description Hook to get artist by ID with IndexedDB caching.
 *
 * @param {string|number} artistId - The artist ID
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and artist data
 * @throws {Error} When artistId is invalid or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetArtist(artistId, revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.Artist.Hooks");

  const { swrKey } = useMemo(() => {
    if (!artistId) return { swrKey: null };
    const key = ["getArtist", artistId, revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, artistId, revalidate]);

  const { data, isLoading, error, isValidating, mutate } =
    baseHook.useSWRWithCache(
      swrKey,
      async () => {
        const response = await artistApiClient.getArtist(artistId, revalidate);
        return response;
      },
      revalidate
    );

  return useMemo(() => {
    const artist = data?.results?.data || null;
    return {
      artist,
      artistLoading: isLoading,
      artistError: error,
      artistValidating: isValidating,
      artistEmpty: !isLoading && !artist,
      mutate,
    };
  }, [data, isLoading, error, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.Artist.Hooks
 * @function useGetArtistBySlug
 * @description Hook to get artist by slug with IndexedDB caching.
 *
 * @param {string} slug - The artist slug
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and artist data
 * @throws {Error} When slug is invalid or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetArtistBySlug(slug, revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.Artist.Hooks");

  const { swrKey } = useMemo(() => {
    if (!slug) return { swrKey: null };
    const key = ["getArtistBySlug", slug, revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, slug, revalidate]);

  const { data, isLoading, error, isValidating, mutate } =
    baseHook.useSWRWithCache(
      swrKey,
      async () => {
        const response = await artistApiClient.getArtistBySlug(slug, revalidate);
        return response;
      },
      revalidate
    );

  return useMemo(() => {
    const artist = data?.results?.data || null;
    return {
      artist,
      artistLoading: isLoading,
      artistError: error,
      artistValidating: isValidating,
      artistEmpty: !isLoading && !artist,
      mutate,
    };
  }, [data, isLoading, error, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.Artist.Hooks
 * @function useCreateArtist
 * @description Hook to create a new artist with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (artist) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When artist data validation fails or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const createArtist = useCreateArtist();
 * await createArtist.mutate(artistData);
 */
export function useCreateArtist() {
  const baseHook = useBaseHook("CityArtWalks.Actions.Artist.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (artist) => {
      const result = await artistApiClient.createArtist(artist);
      return result;
    },
    ["artist", "getPaginatedArtists"]
  );
}

/**
 * @memberof CityArtWalks.Actions.Artist.Hooks
 * @function useUpdateArtist
 * @description Hook to update an existing artist with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (id, artistData) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When artist ID is missing, data validation fails, or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const updateArtist = useUpdateArtist();
 * await updateArtist.mutate(artistId, updatedData);
 */
export function useUpdateArtist() {
  const baseHook = useBaseHook("CityArtWalks.Actions.Artist.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (id, artist) => {
      if (!id) {
        baseHook.logger.error("useUpdateArtist", "Artist ID is required");
        throw new Error("Artist ID is required");
      }

      const result = await artistApiClient.updateArtist(id, artist);
      return result;
    },
    ["artist", "getPaginatedArtists"]
  );
}

/**
 * @memberof CityArtWalks.Actions.Artist.Hooks
 * @function useDeleteArtist
 * @description Hook to delete an artist with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (id) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When artist ID is missing or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const deleteArtist = useDeleteArtist();
 * await deleteArtist.mutate(artistId);
 */
export function useDeleteArtist() {
  const baseHook = useBaseHook("CityArtWalks.Actions.Artist.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (id) => {
      // Validate parameters
      if (!id) {
        baseHook.logger.error("useDeleteArtist", "Artist ID is required");
        throw new Error("Artist ID is required");
      }

      const result = await artistApiClient.deleteArtist(id);
      return result;
    },
    ["artist", "getPaginatedArtists"]
  );
}

/**
 * @memberof CityArtWalks.Actions.Artist.Hooks
 * @function useGetActiveArtists
 * @description Hook to get active artists filtered by location and status with caching.
 *
 * @param {Object} params - Filter parameters
 * @param {string} [params.city=''] - City filter
 * @param {string} [params.status=''] - Status filter
 * @param {string} [params.search=''] - Search term
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=10] - Results per page limit
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and artists data
 * @throws {Error} When API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetActiveArtists(params = {}, revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.Artist.Hooks");

  const {
    city = "",
    status = "",
    search = "",
    page = 1,
    limit = 10,
  } = params;

  const { swrKey } = useMemo(() => {
    const key = ["getActiveArtists", city, status, search, page, limit, revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, city, status, search, page, limit, revalidate]);

  const { data, isLoading, error, isValidating, mutate } =
    baseHook.useSWRWithCache(
      swrKey,
      async () => {
        const response = await artistApiClient.getActiveArtists(
          { city, status, search, page, limit },
          revalidate
        );
        return response;
      },
      revalidate
    );

  return useMemo(() => {
    const results = data?.results || {};
    return {
      results,
      artistsLoading: isLoading,
      artistsError: error,
      artistsValidating: isValidating,
      artistsEmpty: !isLoading && (!results.data || results.data.length === 0),
      mutate,
    };
  }, [data, isLoading, error, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.Artist.Hooks
 * @function useGetArtistCounts
 * @description Hook to get artist statistics/counts by artist ID.
 *
 * @param {string|number} artistId - The artist ID
 * @param {number} [revalidate=300] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and counts data
 * @throws {Error} When artistId is invalid or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetArtistCounts(artistId, revalidate = 300) {
  const baseHook = useBaseHook("CityArtWalks.Actions.Artist.Hooks");

  const { swrKey } = useMemo(() => {
    if (!artistId) return { swrKey: null };
    const key = ["getArtistCounts", artistId, revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, artistId, revalidate]);

  const { data, isLoading, error, isValidating } = baseHook.useSWRWithCache(
    swrKey,
    async () => {
      const response = await artistApiClient.getArtistCounts(artistId, revalidate);
      return response;
    },
    revalidate
  );

  return useMemo(() => {
    const counts = data?.results?.data || {};
    return {
      counts,
      countsLoading: isLoading,
      countsError: error,
      countsValidating: isValidating,
      countsEmpty: !isLoading && Object.keys(counts).length === 0,
    };
  }, [data, isLoading, error, isValidating]);
}

/**
 * @memberof CityArtWalks.Actions.Artist.Hooks
 * @function useGetFeaturedArtists
 * @description Hook to get featured artists by geographic location with caching.
 *
 * @param {Object} params - Filter parameters
 * @param {string} [params.country=''] - Country filter
 * @param {string} [params.state=''] - State filter
 * @param {string} [params.city=''] - City filter
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=10] - Results per page limit
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and featured artists data
 * @throws {Error} When API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetFeaturedArtists(params = {}, revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.Artist.Hooks");

  const {
    country = "",
    state = "",
    city = "",
    page = 1,
    limit = 10,
  } = params;

  const { swrKey } = useMemo(() => {
    const key = ["getFeaturedArtists", country, state, city, page, limit, revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, country, state, city, page, limit, revalidate]);

  const { data, isLoading, error, isValidating } = baseHook.useSWRWithCache(
    swrKey,
    async () => {
      const response = await artistApiClient.getFeaturedArtists(
        { country, state, city, page, limit },
        revalidate
      );
      return response;
    },
    revalidate
  );

  return useMemo(() => {
    const results = data?.results || {};
    return {
      results,
      artistsLoading: isLoading,
      artistsError: error,
      artistsValidating: isValidating,
      artistsEmpty: !isLoading && (!results.data || results.data.length === 0),
    };
  }, [data, isLoading, error, isValidating]);
}

/**
 * @memberof CityArtWalks.Actions.Artist.Hooks
 * @function useIncrementArtistViewCount
 * @description Hook to increment artist view count with cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (artistId) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When artistId is invalid or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const incrementViewCount = useIncrementArtistViewCount();
 * await incrementViewCount.mutate(artistId);
 */
export function useIncrementArtistViewCount() {
  const baseHook = useBaseHook("CityArtWalks.Actions.Artist.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (artistId) => {
      // Validate parameters
      if (!artistId) {
        baseHook.logger.error("useIncrementArtistViewCount", "Artist ID is required");
        throw new Error("Artist ID is required");
      }

      const result = await artistApiClient.incrementArtistViewCount(artistId);
      return result;
    },
    ["artist", "getArtistCounts"]
  );
}

/**
 * @memberof CityArtWalks.Actions.Artist.Hooks
 * @function useGenerateArtistAIMetaDescription
 * @description Hook for generating AI-powered artist meta descriptions.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (artistId, artistName, biography) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When parameters are invalid or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const generateDescription = useGenerateArtistAIMetaDescription();
 * await generateDescription.mutate(artistId, artistName, biography);
 */
export function useGenerateArtistAIMetaDescription() {
  const baseHook = useBaseHook("CityArtWalks.Actions.Artist.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (artistId, artistName, biography) => {
      // Validate parameters
      if (!artistId || !artistName || !biography) {
        baseHook.logger.error("useGenerateArtistAIMetaDescription", "artistId, artistName, and biography are required");
        throw new Error("artistId, artistName, and biography are required");
      }

      const result = await artistApiClient.generateArtistAIMetaDescription(artistId, artistName, biography);
      return result;
    },
    ["artist", "getArtist"]
  );
}

/**
 * @memberof CityArtWalks.Actions.Artist.Hooks
 * @function useGenerateArtistAIMetaKeywords
 * @description Hook for generating AI-powered artist meta keywords.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (artistId, artistName, biography) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When parameters are invalid or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const generateKeywords = useGenerateArtistAIMetaKeywords();
 * await generateKeywords.mutate(artistId, artistName, biography);
 */
export function useGenerateArtistAIMetaKeywords() {
  const baseHook = useBaseHook("CityArtWalks.Actions.Artist.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (artistId, artistName, biography) => {
      // Validate parameters
      if (!artistId || !artistName || !biography) {
        baseHook.logger.error("useGenerateArtistAIMetaKeywords", "artistId, artistName, and biography are required");
        throw new Error("artistId, artistName, and biography are required");
      }

      const result = await artistApiClient.generateArtistAIMetaKeywords(artistId, artistName, biography);
      return result;
    },
    ["artist", "getArtist"]
  );
}

/**
 * @memberof CityArtWalks.Actions.Artist.Hooks
 * @function useArtistMutations
 * @description Hook that returns all artist mutation functions for convenient access.
 *
 * @returns {Object} Collection of all artist mutation functions
 * @returns {Function} result.createArtist - Create artist mutation function
 * @returns {Function} result.updateArtist - Update artist mutation function
 * @returns {Function} result.deleteArtist - Delete artist mutation function
 * @returns {Function} result.incrementViewCount - Increment view count mutation function
 * @returns {Function} result.generateMetaDescription - Generate AI meta description mutation function
 * @returns {Function} result.generateMetaKeywords - Generate AI meta keywords mutation function
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const { createArtist, updateArtist, deleteArtist, incrementViewCount, generateMetaDescription, generateMetaKeywords } = useArtistMutations();
 * await createArtist.mutate(artistData);
 * await updateArtist.mutate(artistId, updatedData);
 * await deleteArtist.mutate(artistId);
 * await incrementViewCount.mutate(artistId);
 * await generateMetaDescription.mutate(artistId, artistName, biography);
 * await generateMetaKeywords.mutate(artistId, artistName, biography);
 */
export function useArtistMutations() {
  const createArtist = useCreateArtist();
  const updateArtist = useUpdateArtist();
  const deleteArtist = useDeleteArtist();
  const incrementViewCount = useIncrementArtistViewCount();
  const generateMetaDescription = useGenerateArtistAIMetaDescription();
  const generateMetaKeywords = useGenerateArtistAIMetaKeywords();

  return {
    createArtist,
    updateArtist,
    deleteArtist,
    incrementViewCount,
    generateMetaDescription,
    generateMetaKeywords,
  };
}
