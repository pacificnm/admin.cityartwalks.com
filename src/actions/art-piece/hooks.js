/**
 * @file hooks.js
 * @description SWR-based data fetching hooks for ArtPiece.
 * @author Jaimie Garner
 * @version 2.1.0
 * @namespace CityArtWalks.Actions.ArtPiece.Hooks
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece} - ArtPiece entity documentation
 */

import { useMemo, useEffect } from "react";

import { useBaseHook } from "src/lib/base-hook";

import { ArtPieceApiClient } from "./requests";

// Create a single instance to use across all hooks
const artPieceApiClient = new ArtPieceApiClient();

// ==========================================
// CORE CRUD HOOKS (Required Functions)
// ==========================================

/**
 * @memberof CityArtWalks.Actions.ArtPiece.Hooks
 * @function useGetPaginatedArtPieces
 * @description Hook to get paginated art pieces with full filtering, caching via IndexedDB.
 *
 * @param {Object} params - Filter parameters
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=10] - Results per page limit
 * @param {string} [params.search=''] - Search term
 * @param {string} [params.status=''] - Status filter
 * @param {number} [params.artistId] - Artist ID filter
 * @param {number} [params.cityId] - City ID filter
 * @param {number} [params.stateId] - State ID filter
 * @param {number} [params.countryId] - Country ID filter
 * @param {boolean} [params.featured] - Featured filter
 * @param {number} [params.createdBy] - Creator ID filter
 * @param {string|null} [params.refreshKey=null] - Key to trigger refresh
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and complete API results
 * @returns {Object} result.results - Complete API results object (data, pagination, performance, query metadata)
 * @returns {boolean} result.artPiecesLoading - Loading state
 * @returns {Error} result.artPiecesError - Error state
 * @returns {boolean} result.artPiecesValidating - Validation state
 * @returns {boolean} result.artPiecesEmpty - Empty state (no data)
 * @returns {Function} result.mutate - SWR mutate function
 * @throws {Error} When parameter validation fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetPaginatedArtPieces(params = {}, revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPiece.Hooks");

  const {
    page = 1,
    limit = 10,
    search = "",
    status = "",
    artistId,
    cityId,
    stateId,
    countryId,
    featured,
    createdBy,
    refreshKey = null,
  } = params;

  const { swrKey } = useMemo(() => {
    const key = [
      "getPaginatedArtPieces",
      page,
      limit,
      search,
      status,
      artistId,
      cityId,
      stateId,
      countryId,
      featured,
      createdBy,
      revalidate,
    ];
    return baseHook.utils.generateKeys(key);
  }, [
    baseHook.utils,
    page,
    limit,
    search,
    status,
    artistId,
    cityId,
    stateId,
    countryId,
    featured,
    createdBy,
    revalidate,
  ]);

  const { data, isLoading, error, isValidating, mutate } =
    baseHook.useSWRWithCache(
      swrKey,
      async () => {
        const response = await artPieceApiClient.getPaginatedArtPieces(
          { page, limit, search, status, artistId, cityId, stateId, countryId, featured, createdBy },
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
      artPiecesLoading: isLoading,
      artPiecesError: error,
      artPiecesValidating: isValidating,
      artPiecesEmpty: !isLoading && (!results.data || results.data.length === 0),
      mutate,
    };
  }, [data, isLoading, error, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.ArtPiece.Hooks
 * @function useGetArtPiece
 * @description Hook to get art piece by ID with IndexedDB caching.
 *
 * @param {string|number} artPieceId - The art piece ID
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and art piece data
 * @throws {Error} When artPieceId is invalid or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetArtPiece(artPieceId, revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPiece.Hooks");

  const { swrKey } = useMemo(() => {
    if (!artPieceId) return { swrKey: null };
    const key = ["getArtPiece", artPieceId, revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, artPieceId, revalidate]);

  const { data, isLoading, error, isValidating, mutate } =
    baseHook.useSWRWithCache(
      swrKey,
      async () => {
        const response = await artPieceApiClient.getArtPiece(artPieceId, revalidate);
        return response;
      },
      revalidate
    );

  return useMemo(() => {
    const artPiece = data?.results?.data || null;
    return {
      artPiece,
      artPieceLoading: isLoading,
      artPieceError: error,
      artPieceValidating: isValidating,
      artPieceEmpty: !isLoading && !artPiece,
      mutate,
    };
  }, [data, isLoading, error, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.ArtPiece.Hooks
 * @function useGetArtPieceBySlug
 * @description Hook to get art piece by artist slug and art piece slug with IndexedDB caching.
 *
 * @param {string} artistSlug - The artist slug
 * @param {string} artPieceSlug - The art piece slug
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and art piece data
 * @throws {Error} When slugs are invalid or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetArtPieceBySlug(artistSlug, artPieceSlug, revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPiece.Hooks");

  const { swrKey } = useMemo(() => {
    if (!artistSlug || !artPieceSlug) return { swrKey: null };
    const key = ["getArtPieceBySlug", artistSlug, artPieceSlug, revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, artistSlug, artPieceSlug, revalidate]);

  const { data, isLoading, error, isValidating, mutate } =
    baseHook.useSWRWithCache(
      swrKey,
      async () => {
        const response = await artPieceApiClient.getArtPieceBySlug(artistSlug, artPieceSlug, revalidate);
        return response;
      },
      revalidate
    );

  return useMemo(() => {
    const artPiece = data?.results?.data || null;
    return {
      artPiece,
      artPieceLoading: isLoading,
      artPieceError: error,
      artPieceValidating: isValidating,
      artPieceEmpty: !isLoading && !artPiece,
      mutate,
    };
  }, [data, isLoading, error, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.ArtPiece.Hooks
 * @function useCreateArtPiece
 * @description Hook to create a new art piece with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (artPiece) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When art piece data validation fails or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const createArtPiece = useCreateArtPiece();
 * await createArtPiece.mutate(artPieceData);
 */
export function useCreateArtPiece() {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPiece.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (artPiece) => {
      const result = await artPieceApiClient.createArtPiece(artPiece);
      return result;
    },
    ["artPiece", "getPaginatedArtPieces"]
  );
}

/**
 * @memberof CityArtWalks.Actions.ArtPiece.Hooks
 * @function useUpdateArtPiece
 * @description Hook to update an existing art piece with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (id, artPieceData) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When art piece ID is missing, data validation fails, or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const updateArtPiece = useUpdateArtPiece();
 * await updateArtPiece.mutate(artPieceId, updatedData);
 */
export function useUpdateArtPiece() {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPiece.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (id, artPiece) => {
      // Validate parameters
      if (!id) {
        baseHook.logger.error("useUpdateArtPiece", "ArtPiece ID is required");
        throw new Error("ArtPiece ID is required");
      }

      const result = await artPieceApiClient.updateArtPiece(id, artPiece);
      return result;
    },
    ["artPiece", "getPaginatedArtPieces"]
  );
}

/**
 * @memberof CityArtWalks.Actions.ArtPiece.Hooks
 * @function useDeleteArtPiece
 * @description Hook to delete an art piece with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (id) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When art piece ID is missing or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const deleteArtPiece = useDeleteArtPiece();
 * await deleteArtPiece.mutate(artPieceId);
 */
export function useDeleteArtPiece() {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPiece.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (id) => {
      // Validate parameters
      if (!id) {
        baseHook.logger.error("useDeleteArtPiece", "ArtPiece ID is required");
        throw new Error("ArtPiece ID is required");
      }

      const result = await artPieceApiClient.deleteArtPiece(id);
      return result;
    },
    ["artPiece", "getPaginatedArtPieces"]
  );
}

// ==========================================
// SPECIALIZED QUERY HOOKS
// ==========================================

/**
 * @memberof CityArtWalks.Actions.ArtPiece.Hooks
 * @function useGetAllArtPieces
 * @description Hook to get all art pieces (non-paginated) with IndexedDB caching.
 *
 * @param {number} [limit=100] - Maximum number of art pieces
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and list of art pieces
 * @throws {Error} When API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetAllArtPieces(limit = 100, revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPiece.Hooks");

  const { swrKey } = useMemo(() => {
    const key = ["getAllArtPieces", limit, revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, limit, revalidate]);

  const { data, isLoading, error, isValidating } = baseHook.useSWRWithCache(
    swrKey,
    async () => {
      const response = await artPieceApiClient.getAllArtPieces(limit, revalidate);
      return response;
    },
    revalidate
  );

  return useMemo(() => {
    const artPieces = data?.results?.data || [];
    return {
      artPieces,
      artPiecesLoading: isLoading,
      artPiecesError: error,
      artPiecesValidating: isValidating,
      artPiecesEmpty: !isLoading && artPieces.length === 0,
    };
  }, [data, isLoading, error, isValidating]);
}

/**
 * @memberof CityArtWalks.Actions.ArtPiece.Hooks
 * @function useGetArtPieceByArtist
 * @description Hook to get art pieces by artist ID with IndexedDB caching.
 *
 * @param {string|number} artistId - The artist ID
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and list of art pieces
 * @throws {Error} When API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetArtPieceByArtist(artistId, revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPiece.Hooks");

  const { swrKey } = useMemo(() => {
    if (!artistId) return { swrKey: null };
    const key = ["getArtPieceByArtist", artistId, revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, artistId, revalidate]);

  const { data, isLoading, error, isValidating } = baseHook.useSWRWithCache(
    swrKey,
    async () => {
      const response = await artPieceApiClient.getArtPieceByArtist(artistId, revalidate);
      return response;
    },
    revalidate
  );

  return useMemo(() => {
    const artPieces = Array.isArray(data) ? data : [];
    return {
      artPieces,
      artPiecesLoading: isLoading,
      artPiecesError: error,
      artPiecesValidating: isValidating,
      artPiecesEmpty: !isLoading && artPieces.length === 0,
    };
  }, [data, isLoading, error, isValidating]);
}

/**
 * @memberof CityArtWalks.Actions.ArtPiece.Hooks
 * @function useGetArtPieceByCountry
 * @description Hook to get art pieces by country with optional search and featured filter.
 *
 * @param {string} country - Country identifier
 * @param {string} [search=''] - Optional search query
 * @param {boolean|null} [featured=null] - Optional featured filter
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and list of art pieces
 * @throws {Error} When API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetArtPieceByCountry(country, search = "", featured = null, revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPiece.Hooks");

  const { swrKey } = useMemo(() => {
    if (!country) return { swrKey: null };
    const key = ["getArtPieceByCountry", country, search, featured, revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, country, search, featured, revalidate]);

  const { data, isLoading, error, isValidating } = baseHook.useSWRWithCache(
    swrKey,
    async () => {
      const response = await artPieceApiClient.getArtPieceByCountry(country, search, featured, revalidate);
      return response;
    },
    revalidate
  );

  return useMemo(() => {
    const artPieces = Array.isArray(data) ? data : [];
    return {
      artPieces,
      artPiecesLoading: isLoading,
      artPiecesError: error,
      artPiecesValidating: isValidating,
      artPiecesEmpty: !isLoading && artPieces.length === 0,
    };
  }, [data, isLoading, error, isValidating]);
}

/**
 * @memberof CityArtWalks.Actions.ArtPiece.Hooks
 * @function useGetArtPieceByState
 * @description Hook to get art pieces by state within a country.
 *
 * @param {string} country - Country identifier
 * @param {string} state - State identifier
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and list of art pieces
 * @throws {Error} When API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetArtPieceByState(country, state, revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPiece.Hooks");

  const { swrKey } = useMemo(() => {
    if (!country || !state) return { swrKey: null };
    const key = ["getArtPieceByState", country, state, revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, country, state, revalidate]);

  const { data, isLoading, error, isValidating } = baseHook.useSWRWithCache(
    swrKey,
    async () => {
      const response = await artPieceApiClient.getArtPieceByState(country, state, revalidate);
      return response;
    },
    revalidate
  );

  return useMemo(() => {
    const artPieces = Array.isArray(data?.results?.data) ? data.results.data : [];
    return {
      artPieces,
      artPiecesLoading: isLoading,
      artPiecesError: error,
      artPiecesValidating: isValidating,
      artPiecesEmpty: !isLoading && artPieces.length === 0,
    };
  }, [data, isLoading, error, isValidating]);
}

/**
 * @memberof CityArtWalks.Actions.ArtPiece.Hooks
 * @function useGetArtPieceByCity
 * @description Hook to get art pieces by city with optional search.
 *
 * @param {string} country - Country identifier
 * @param {string} state - State identifier
 * @param {string} city - City identifier
 * @param {string} [search=''] - Optional search query
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and list of art pieces
 * @throws {Error} When API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetArtPieceByCity(country, state, city, search = "", revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPiece.Hooks");

  const { swrKey } = useMemo(() => {
    if (!country || !state || !city) return { swrKey: null };
    const key = ["getArtPieceByCity", country, state, city, search, revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, country, state, city, search, revalidate]);

  const { data, isLoading, error, isValidating } = baseHook.useSWRWithCache(
    swrKey,
    async () => {
      const response = await artPieceApiClient.getArtPieceByCity(country, state, city, search, revalidate);
      return response;
    },
    revalidate
  );

  return useMemo(() => {
    const artPieces = Array.isArray(data?.results?.data) ? data.results.data : [];
    return {
      artPieces,
      artPiecesLoading: isLoading,
      artPiecesError: error,
      artPiecesValidating: isValidating,
      artPiecesEmpty: !isLoading && artPieces.length === 0,
    };
  }, [data, isLoading, error, isValidating]);
}

/**
 * @memberof CityArtWalks.Actions.ArtPiece.Hooks
 * @function useGetArtPieceByViewport
 * @description Hook to get art pieces within a geographic viewport.
 *
 * @param {Object} viewport - Bounding box with swLat, swLng, neLat, neLng, zoom
 * @param {string} [search=''] - Optional search query
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and list of art pieces
 * @throws {Error} When API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetArtPieceByViewport(viewport = {}, search = "", revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPiece.Hooks");
  const { swLat, swLng, neLat, neLng, zoom } = viewport;
  const hasValidViewport = swLat && swLng && neLat && neLng;

  const { swrKey } = useMemo(() => {
    if (!hasValidViewport) return { swrKey: null };
    const key = ["getArtPieceByViewport", swLat, swLng, neLat, neLng, zoom, search, revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, swLat, swLng, neLat, neLng, zoom, search, revalidate, hasValidViewport]);

  const { data, isLoading, error, isValidating } = baseHook.useSWRWithCache(
    swrKey,
    async () => {
      const response = await artPieceApiClient.getArtPieceByViewport(viewport, search, revalidate);
      return response;
    },
    revalidate
  );

  return useMemo(() => {
    const artPieces = Array.isArray(data?.results?.data) ? data.results.data : [];
    return {
      artPieces,
      artPiecesLoading: isLoading,
      artPiecesError: error,
      artPiecesValidating: isValidating,
      artPiecesEmpty: !isLoading && artPieces.length === 0,
      artPiecesCount: data?.results?.count || 0,
    };
  }, [data, isLoading, error, isValidating]);
}

/**
 * @memberof CityArtWalks.Actions.ArtPiece.Hooks
 * @function useGetArtPieceByRadius
 * @description Hook to get art pieces within a geographic radius.
 *
 * @param {Object} center - Object with lat and lng properties
 * @param {number} radius - Radius in kilometers
 * @param {string} [search=''] - Optional search query
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and list of art pieces
 * @throws {Error} When API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetArtPieceByRadius(center = {}, radius, search = "", revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPiece.Hooks");
  const { lat, lng } = center;
  const hasValidCenter = lat && lng && radius;

  const { swrKey } = useMemo(() => {
    if (!hasValidCenter) return { swrKey: null };
    const key = ["getArtPieceByRadius", lat, lng, radius, search, revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, lat, lng, radius, search, revalidate, hasValidCenter]);

  const { data, isLoading, error, isValidating } = baseHook.useSWRWithCache(
    swrKey,
    async () => {
      const response = await artPieceApiClient.getArtPieceByRadius(center, radius, search, revalidate);
      return response;
    },
    revalidate
  );

  return useMemo(() => {
    const artPieces = Array.isArray(data?.results?.data) ? data.results.data : [];
    return {
      artPieces,
      artPiecesLoading: isLoading,
      artPiecesError: error,
      artPiecesValidating: isValidating,
      artPiecesEmpty: !isLoading && artPieces.length === 0,
      artPiecesCount: data?.results?.count || 0,
    };
  }, [data, isLoading, error, isValidating]);
}

/**
 * @memberof CityArtWalks.Actions.ArtPiece.Hooks
 * @function useGetArtPieceCounts
 * @description Hook to get count statistics for an art piece.
 *
 * @param {string|number} artPieceId - The art piece ID
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and counts data
 * @throws {Error} When API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetArtPieceCounts(artPieceId, revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPiece.Hooks");

  const { swrKey } = useMemo(() => {
    if (!artPieceId) return { swrKey: null };
    const key = ["getArtPieceCounts", artPieceId, revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, artPieceId, revalidate]);

  const { data, isLoading, error, isValidating } = baseHook.useSWRWithCache(
    swrKey,
    async () => {
      const response = await artPieceApiClient.getArtPieceCounts(artPieceId, revalidate);
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
    };
  }, [data, isLoading, error, isValidating]);
}

/**
 * @memberof CityArtWalks.Actions.ArtPiece.Hooks
 * @function useIncrementArtPieceViewCount
 * @description Hook to increment art piece view count with cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (id) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When art piece ID is missing or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const incrementViewCount = useIncrementArtPieceViewCount();
 * await incrementViewCount.mutate(artPieceId);
 */
export function useIncrementArtPieceViewCount() {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPiece.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (id) => {
      // Validate parameters
      if (!id) {
        baseHook.logger.error("useIncrementArtPieceViewCount", "ArtPiece ID is required");
        throw new Error("ArtPiece ID is required");
      }

      const result = await artPieceApiClient.incrementArtPieceViewCount(id);
      return result;
    },
    ["artPiece", "artPieceCounts"]
  );
}

/**
 * @memberof CityArtWalks.Actions.ArtPiece.Hooks
 * @function useGenerateArtPieceAIDescription
 * @description Hook to generate AI-powered description for an art piece.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (artPieceId, artistName, title) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Generated description
 * @throws {Error} When parameters are invalid or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const generateDescription = useGenerateArtPieceAIDescription();
 * await generateDescription.mutate(artPieceId, artistName, title);
 */
export function useGenerateArtPieceAIDescription() {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPiece.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (artPieceId, artistName, title) => {
      // Validate parameters
      if (!artPieceId || !artistName || !title) {
        baseHook.logger.error("useGenerateArtPieceAIDescription", "ArtPieceId, artistName, and title are required");
        throw new Error("ArtPieceId, artistName, and title are required");
      }

      const result = await artPieceApiClient.generateArtPieceAIDescription(artPieceId, artistName, title);
      return result;
    },
    ["artPiece"]
  );
}

/**
 * @memberof CityArtWalks.Actions.ArtPiece.Hooks
 * @function useGenerateArtPieceAIMetaDescription
 * @description Hook to generate AI-powered SEO meta description for an art piece.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (artPieceId, artistName, title, description) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Generated meta description
 * @throws {Error} When parameters are invalid or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const generateMetaDesc = useGenerateArtPieceAIMetaDescription();
 * await generateMetaDesc.mutate(artPieceId, artistName, title, description);
 */
export function useGenerateArtPieceAIMetaDescription() {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPiece.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (artPieceId, artistName, title, description) => {
      // Validate parameters
      if (!artPieceId || !artistName || !title || !description) {
        baseHook.logger.error("useGenerateArtPieceAIMetaDescription", "All parameters are required");
        throw new Error("All parameters (artPieceId, artistName, title, description) are required");
      }

      const result = await artPieceApiClient.generateArtPieceAIMetaDescription(artPieceId, artistName, title, description);
      return result;
    },
    ["artPiece"]
  );
}

/**
 * @memberof CityArtWalks.Actions.ArtPiece.Hooks
 * @function useGenerateArtPieceAIMetaKeywords
 * @description Hook to generate AI-powered SEO meta keywords for an art piece.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (artPieceId, artistName, title, description, metadata) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Generated meta keywords
 * @throws {Error} When parameters are invalid or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const generateKeywords = useGenerateArtPieceAIMetaKeywords();
 * await generateKeywords.mutate(artPieceId, artistName, title, description, { city, state });
 */
export function useGenerateArtPieceAIMetaKeywords() {
  const baseHook = useBaseHook("CityArtWalks.Actions.ArtPiece.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (artPieceId, artistName, title, description, metadata = {}) => {
      // Validate parameters
      if (!artPieceId || !artistName || !title || !description) {
        baseHook.logger.error("useGenerateArtPieceAIMetaKeywords", "Core parameters are required");
        throw new Error("Core parameters (artPieceId, artistName, title, description) are required");
      }

      const result = await artPieceApiClient.generateArtPieceAIMetaKeywords(artPieceId, artistName, title, description, metadata);
      return result;
    },
    ["artPiece"]
  );
}

/**
 * @memberof CityArtWalks.Actions.ArtPiece.Hooks
 * @function useArtPieceMutations
 * @description Hook that returns all art piece mutation functions for convenient access.
 *
 * @returns {Object} Collection of all art piece mutation functions
 * @returns {Function} result.createArtPiece - Create art piece mutation function
 * @returns {Function} result.updateArtPiece - Update art piece mutation function
 * @returns {Function} result.deleteArtPiece - Delete art piece mutation function
 * @returns {Function} result.incrementViewCount - Increment view count mutation function
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const { createArtPiece, updateArtPiece, deleteArtPiece, incrementViewCount } = useArtPieceMutations();
 * await createArtPiece.mutate(artPieceData);
 * await updateArtPiece.mutate(artPieceId, updatedData);
 * await deleteArtPiece.mutate(artPieceId);
 * await incrementViewCount.mutate(artPieceId);
 */
export function useArtPieceMutations() {
  const createArtPiece = useCreateArtPiece();
  const updateArtPiece = useUpdateArtPiece();
  const deleteArtPiece = useDeleteArtPiece();
  const incrementViewCount = useIncrementArtPieceViewCount();

  return {
    createArtPiece,
    updateArtPiece,
    deleteArtPiece,
    incrementViewCount,
  };
}
