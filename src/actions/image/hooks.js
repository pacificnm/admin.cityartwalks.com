/**
 * @file hooks.js
 * @description React hooks for image data fetching, caching, and mutations
 *
 * This module provides comprehensive SWR-based hooks for image operations including
 * paginated fetching, individual record retrieval, CRUD operations, file uploads,
 * and moderation functionality with IndexedDB caching support.
 * @namespace CityArtWalks.Actions.Image.Hooks
 * @version 2.0.0
 * @author GitHub Copilot
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks patterns documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Image-Model} - Image model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Image} - Database schema reference
 */

import { useMemo, useEffect } from 'react';
import useSWR, { useSWRConfig } from 'swr';

import { debugLog, debugWarn, debugError } from 'src/lib/debug';
import { saveToIndexedDb, loadFromIndexedDb, buildCacheKeyFromSWRKey } from 'src/lib/indexDb';

import * as requests from './requests';

/**
 * SWR configuration options to control revalidation behavior.
 *
 * @memberof CityArtWalks.Actions.Image.Hooks
 * @type {Object}
 * @property {boolean} revalidateIfStale - If false, data will not be revalidated if it is stale.
 * @property {boolean} revalidateOnFocus - If false, data will not be revalidated when the window regains focus.
 * @property {boolean} revalidateOnReconnect - If false, data will not be revalidated when the browser reconnects to the network.
 * @property {boolean} keepPreviousData - If true, keeps previous data while fetching new data.
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Complete documentation
 */
const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  keepPreviousData: true,
};

/**
 * SWR hook for paginated images with IndexedDB caching support.
 *
 * Features:
 * - Comprehensive filtering by user, status, artist, art piece, path, and featured status
 * - SWR-based data fetching with automatic revalidation
 * - IndexedDB caching for offline support and performance
 * - Pagination with configurable page size
 * - Search functionality integration
 * - Automatic cache invalidation and refresh support
 *
 * @function useGetPaginatedImages
 * @memberof CityArtWalks.Actions.Image.Hooks
 *
 * @param {Object} [filters={}] - Filter options
 * @param {string} [filters.createdBy=''] - Filter by user ID who created the image
 * @param {string} [filters.search=''] - Search query
 * @param {string} [filters.status=''] - Filter by status
 * @param {string} [filters.artistId=''] - Filter by artist ID
 * @param {string} [filters.artPieceId=''] - Filter by art piece ID
 * @param {string} [filters.pathId=''] - Filter by path ID
 * @param {boolean} [filters.featured=''] - Filter by featured status
 * @param {number} [page=1] - Page number for pagination
 * @param {number} [rowsPerPage=10] - Number of items per page
 * @param {string} [token=''] - Auth token
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @param {*} [refreshKey] - Key to trigger refresh
 * @returns {Object} Paginated images result with IndexedDB caching
 * @returns {Array} returns.images - Array of image objects
 * @returns {Object} returns.paginationMeta - Pagination metadata with total, page, rowsPerPage, totalPages
 * @returns {boolean} returns.imagesLoading - Loading state indicator
 * @returns {Error} returns.imagesError - Error object if request fails
 * @returns {boolean} returns.imagesEmpty - True if no images found
 * @returns {Function} returns.mutate - SWR mutate function for manual revalidation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Complete documentation
 */
export function useGetPaginatedImages(
  filters = {},
  page = 1,
  rowsPerPage = 10,
  token = '',
  revalidate = 600,
  refreshKey
) {
  const {
    createdBy = '',
    search = '',
    status = '',
    artistId = '',
    artPieceId = '',
    pathId = '',
    featured = '',
  } = filters;
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    const key = [
      'getPaginatedImages',
      createdBy,
      search,
      status,
      artistId,
      artPieceId,
      pathId,
      featured,
      page,
      rowsPerPage,
      revalidate,
    ];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [
    createdBy,
    search,
    status,
    artistId,
    artPieceId,
    pathId,
    featured,
    page,
    rowsPerPage,
    revalidate,
  ]);

  const { data, isLoading, error, mutate } = useSWR(
    swrKey,
    async () => {
      const response = await requests.getPaginatedImages(
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
    },
    swrOptions
  );

  useEffect(() => {
    if (!cacheKey || !mutate) return;
    (async () => {
      try {
        const cached = await loadFromIndexedDb(cacheKey, revalidateMs);
        if (cached) {
          debugLog(`[IndexedDB] Cache hit for ${cacheKey}`);
          mutate(cached, false);
        } else {
          debugLog(`[IndexedDB] Cache miss for ${cacheKey}`);
        }
      } catch (cacheError) {
        debugWarn(`[IndexedDB] Error loading cache for ${cacheKey}:`, cacheError);
      }
    })();
  }, [cacheKey, mutate, revalidateMs]);

  useEffect(() => {
    if (refreshKey) mutate();
  }, [refreshKey, mutate]);

  return useMemo(
    () => ({
      images: data?.data?.images || [],
      // FIX: The meta is in data.data.meta, not data.meta!
      paginationMeta: data?.data?.meta || {
        total: 0,
        page: 1,
        rowsPerPage: 10,
        totalPages: 0,
      },
      imagesLoading: isLoading,
      imagesError: error,
      imagesEmpty: !isLoading && (!data?.data?.images || data?.data?.images.length === 0),
      mutate,
    }),
    [data, isLoading, error, mutate]
  );
}

/**
 * Fetches a single image by ID with SWR and IndexedDB caching.
 *
 * Features:
 * - ID validation and sanitization
 * - SWR-based data fetching with automatic revalidation
 * - IndexedDB caching for offline support
 * - Error handling and loading states
 * - Authentication support
 * - Automatic cache invalidation
 *
 * @function useGetImageById
 * @memberof CityArtWalks.Actions.Image.Hooks
 *
 * @param {string|number} id - The unique identifier of the image
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @returns {Object} Image data with loading and error states
 * @returns {Object} returns.image - The fetched image object
 * @returns {boolean} returns.imageLoading - Loading state indicator
 * @returns {Error} returns.imageError - Error object if request fails
 * @returns {boolean} returns.imageValidating - Validation state indicator
 * @returns {Function} returns.mutateImage - SWR mutate function for manual revalidation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Complete documentation
 */
export function useGetImageById(id, token = '', revalidate = 600) {
  // Only create key if ID is valid, otherwise null to disable SWR
  const key = id && !isNaN(parseInt(id)) ? ['getImageById', id, revalidate] : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    key,
    () => requests.getImageById(id, token, revalidate),
    swrOptions
  );

  return useMemo(
    () => ({
      image: data?.data || data, // Extract data property if it exists, fallback to data
      imageLoading: isLoading,
      imageError: error,
      imageValidating: isValidating,
      mutateImage: mutate,
    }),
    [data, isLoading, error, isValidating, mutate]
  );
}

/**
 * Hook for uploading image files to Vercel Blob storage.
 *
 * This hook handles only the file upload process and returns the uploaded image URL
 * and metadata. It does not create database records - use useCreateImage for that.
 *
 * Features:
 * - File upload to Vercel Blob storage
 * - FormData and File object support
 * - Authentication support
 * - Error handling and progress tracking
 * - Metadata extraction and validation
 *
 * @function useUploadImage
 * @memberof CityArtWalks.Actions.Image.Hooks
 *
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to upload an image file
 * @returns {Promise<Object>} The upload response with URL and metadata
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Complete documentation
 */
export function useUploadImage(token = '') {
  return async (fileOrFormData, revalidate = 600) => {
    const result = await requests.uploadImage(fileOrFormData, token, revalidate);
    return result;
  };
}

/**
 * Hook for creating a new image with automatic cache invalidation for both SWR and IndexedDB.
 *
 * Features:
 * - Image record creation with validation
 * - Automatic SWR cache invalidation
 * - IndexedDB cache cleanup
 * - Error handling and debugging
 * - Authentication support
 * - ISR revalidation support
 *
 * @function useCreateImage
 * @memberof CityArtWalks.Actions.Image.Hooks
 *
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to create an image
 * @returns {Promise<Object>} The created image data from the server
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Complete documentation
 */
export function useCreateImage(token = '') {
  const { mutate } = useSWRConfig();

  return async (image, revalidate = 600) => {
    const result = await requests.createImage(image, token, revalidate);

    // Clear SWR cache
    mutate(
      (key) => Array.isArray(key) && (key.includes('image') || key.includes('getPaginatedImages'))
    );

    // Clear related IndexedDB cache entries
    try {
      const cacheKeysToDelete = ['getPaginatedImages'];
      for (const keyPrefix of cacheKeysToDelete) {
        const cacheKey = buildCacheKeyFromSWRKey([keyPrefix]);
        await saveToIndexedDb(cacheKey, null); // Clear by setting to null
        debugLog(`[IndexedDB] Cleared cache for ${cacheKey}`);
      }
    } catch (cacheError) {
      debugWarn('[IndexedDB] Error clearing cache after create?:', cacheError);
    }

    return result;
  };
}

/**
 * Hook for updating an existing image with automatic cache invalidation for both SWR and IndexedDB.
 *
 * Features:
 * - Image record updates with validation
 * - Partial update support
 * - Automatic SWR cache invalidation
 * - IndexedDB cache cleanup
 * - Error handling and debugging
 * - Authentication support
 *
 * @function useUpdateImage
 * @memberof CityArtWalks.Actions.Image.Hooks
 *
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to update an image
 * @returns {Promise<Object>} The updated image data from the server
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Complete documentation
 */
export function useUpdateImage(token = '') {
  const { mutate } = useSWRConfig();

  return async (id, image, revalidate = 600) => {
    const result = await requests.updateImage(id, image, token, revalidate);

    // Clear SWR cache
    mutate(
      (key) => Array.isArray(key) && (key.includes('image') || key.includes('getPaginatedImages'))
    );

    // Clear related IndexedDB cache entries
    try {
      const cacheKeysToDelete = ['getPaginatedImages', ['getImageById', id].join('_')];
      for (const keyPrefix of cacheKeysToDelete) {
        const cacheKey = buildCacheKeyFromSWRKey(
          Array.isArray(keyPrefix) ? keyPrefix : [keyPrefix]
        );
        await saveToIndexedDb(cacheKey, null); // Clear by setting to null
        debugLog(`[IndexedDB] Cleared cache for ${cacheKey}`);
      }
    } catch (cacheError) {
      debugWarn('[IndexedDB] Error clearing cache after update?:', cacheError);
    }

    return result;
  };
}

/**
 * Hook for deleting an image with automatic cache invalidation for both SWR and IndexedDB.
 *
 * Features:
 * - Image record deletion with validation
 * - Automatic SWR cache invalidation
 * - IndexedDB cache cleanup
 * - Error handling and debugging
 * - Authentication support
 * - Cascade deletion support
 *
 * @function useDeleteImage
 * @memberof CityArtWalks.Actions.Image.Hooks
 *
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to delete an image
 * @returns {Promise<Object>} The deletion response from the server
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Complete documentation
 */
export function useDeleteImage(token = '') {
  const { mutate } = useSWRConfig();

  return async (id, revalidate = 600) => {
    const result = await requests.deleteImage(id, token, revalidate);

    // Clear SWR cache
    mutate(
      (key) => Array.isArray(key) && (key.includes('image') || key.includes('getPaginatedImages'))
    );

    // Clear related IndexedDB cache entries
    try {
      const cacheKeysToDelete = ['getPaginatedImages', ['getImageById', id].join('_')];
      for (const keyPrefix of cacheKeysToDelete) {
        const cacheKey = buildCacheKeyFromSWRKey(
          Array.isArray(keyPrefix) ? keyPrefix : [keyPrefix]
        );
        await saveToIndexedDb(cacheKey, null); // Clear by setting to null
        debugLog(`[IndexedDB] Cleared cache for ${cacheKey}`);
      }
    } catch (cacheError) {
      debugWarn('[IndexedDB] Error clearing cache after delete?:', cacheError);
    }

    return result;
  };
}

/**
 * Combined hook that provides all image operation functions including upload, create, update, and delete.
 *
 * Features:
 * - Complete CRUD operations for images
 * - File upload functionality
 * - Combined upload and create workflow
 * - Automatic cache management
 * - Error handling and debugging
 * - Authentication support
 *
 * @function useImageMutations
 * @memberof CityArtWalks.Actions.Image.Hooks
 *
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Object} Object containing all operation functions
 * @returns {Function} returns.uploadImage - Function to upload an image file to Vercel Blob storage
 * @returns {Function} returns.createImage - Function to create a new image record
 * @returns {Function} returns.updateImage - Function to update an existing image
 * @returns {Function} returns.deleteImage - Function to delete an image
 * @returns {Function} returns.uploadAndCreateImage - Combined function to upload file and create record
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Complete documentation
 */
export function useImageMutations(token = '') {
  const uploadImage = useUploadImage(token);
  const createImage = useCreateImage(token);
  const updateImage = useUpdateImage(token);
  const deleteImage = useDeleteImage(token);

  // Combined upload and create function
  const uploadAndCreateImage = async (file, imageData = {}, revalidate = 600) => {
    try {
      // Step 1: Upload the file
      const uploadResult = await uploadImage(file, revalidate);

      if (!uploadResult?.data?.url) {
        throw new Error('Upload failed - no URL returned');
      }

      // Step 2: Create the image record with the uploaded URL
      const createData = {
        url: uploadResult.data.url,
        ...imageData, // Merge any additional image metadata
      };

      const createResult = await createImage(createData, revalidate);

      // Return the created image record with upload metadata
      return {
        ...createResult,
        uploadMetadata: uploadResult.data,
      };
    } catch (error) {
      // Re-throw with enhanced context
      throw new Error(`Upload and create failed: ${error.message}`);
    }
  };

  return {
    uploadImage,
    createImage,
    updateImage,
    deleteImage,
    uploadAndCreateImage,
  };
}

/**
 * SWR hook for fetching paginated flagged images for moderation dashboard.
 * Only accessible by admin users with proper authorization.
 *
 * Features:
 * - Admin-only access with authentication
 * - Paginated flagged image retrieval
 * - Search functionality for moderation queue
 * - IndexedDB caching with shorter revalidation interval
 * - Error handling and debugging
 * - Automatic cache management
 *
 * @function useGetPaginatedFlaggedImages
 * @memberof CityArtWalks.Actions.Image.Hooks
 *
 * @param {number} [page=1] - Page number for pagination
 * @param {number} [limit=10] - Number of items per page
 * @param {string} [search=''] - Search query for flagged images
 * @param {string} [token=''] - Auth token for admin verification
 * @param {number} [revalidate=300] - Revalidate interval in seconds (5 minutes for moderation queue)
 * @returns {Object} Paginated flagged images result for moderation
 * @returns {Array} returns.flaggedImages - Array of flagged image objects
 * @returns {Object} returns.paginationMeta - Pagination metadata
 * @returns {boolean} returns.flaggedImagesLoading - Loading state indicator
 * @returns {Error} returns.flaggedImagesError - Error object if request fails
 * @returns {boolean} returns.flaggedImagesEmpty - True if no flagged images found
 * @returns {Function} returns.mutateFlaggedImages - SWR mutate function for manual revalidation
 */
export function useGetPaginatedFlaggedImages(
  page = 1,
  limit = 10,
  search = '',
  token = '',
  revalidate = 300
) {
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    const key = ['getPaginatedFlaggedImages', search, page, limit, revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [search, page, limit, revalidate]);

  const { data, isLoading, error, mutate } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getPaginatedFlaggedImages(page, limit, search, token);
        if (response && cacheKey) {
          await saveToIndexedDb(cacheKey, response);
          debugLog(
            'CityArtWalks.Actions.Image.Hooks.useGetPaginatedFlaggedImages',
            `[IndexedDB] Saved data for ${cacheKey}`
          );
        }
        return response;
      } catch (err) {
        debugError(
          'CityArtWalks.Actions.Image.Hooks.useGetPaginatedFlaggedImages',
          'Failed to fetch flagged images',
          {
            error: err.message,
            page,
            limit,
            search,
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
          debugLog(
            'CityArtWalks.Actions.Image.Hooks.useGetPaginatedFlaggedImages',
            `[IndexedDB] Cache hit for ${cacheKey}`
          );
          mutate(cached, false);
        }
      } catch (cacheError) {
        debugError(
          'CityArtWalks.Actions.Image.Hooks.useGetPaginatedFlaggedImages',
          'IndexedDB cache operation failed',
          {
            error: cacheError.message,
            cacheKey,
          }
        );
      }
    })();
  }, [cacheKey, mutate, revalidateMs]);

  return useMemo(
    () => ({
      flaggedImages: data?.flaggedImages || [],
      paginationMeta: data?.meta || {
        total: 0,
        page: 1,
        rowsPerPage: 10,
        totalPages: 0,
      },
      flaggedImagesLoading: isLoading,
      flaggedImagesError: error,
      flaggedImagesEmpty: !isLoading && (!data?.flaggedImages || data.flaggedImages.length === 0),
      mutateFlaggedImages: mutate,
    }),
    [data, isLoading, error, mutate]
  );
}

/**
 * Hook for image moderation actions (approve, remove, bulk operations).
 * Provides functions for moderating flagged images with proper error handling.
 *
 * Features:
 * - Single image moderation (approve/remove)
 * - Bulk moderation operations
 * - Moderation notes support
 * - Automatic cache invalidation
 * - Error handling and debugging
 * - Admin authentication support
 *
 * @function useImageModeration
 * @memberof CityArtWalks.Actions.Image.Hooks
 *
 * @param {string} [token=''] - Auth token for admin verification
 * @returns {Object} Image moderation functions
 * @returns {Function} returns.moderateImage - Function to moderate a single image
 * @returns {Function} returns.bulkModerateImages - Function to moderate multiple images
 */
export function useImageModeration(token = '') {
  const { mutate } = useSWRConfig();

  /**
   * Moderate a single image (approve or remove)
   */
  const moderateImage = async (imageId, action, moderationNotes = '') => {
    try {
      debugLog(
        'CityArtWalks.Actions.Image.Hooks.useImageModeration.moderateImage',
        'Starting image moderation',
        {
          imageId,
          action,
          hasNotes: !!moderationNotes,
        }
      );

      const result = await requests.moderateImage(imageId, action, moderationNotes, token);

      // Invalidate flagged images cache
      mutate((key) => Array.isArray(key) && key[0] === 'flagged-images');

      debugLog(
        'CityArtWalks.Actions.Image.Hooks.useImageModeration.moderateImage',
        'Image moderation completed',
        {
          imageId,
          action,
          success: result.success,
        }
      );

      return result;
    } catch (error) {
      debugWarn(
        'CityArtWalks.Actions.Image.Hooks.useImageModeration.moderateImage',
        'Image moderation failed',
        { error }
      );
      throw error;
    }
  };

  /**
   * Moderate multiple images in bulk (approve or remove)
   */
  const bulkModerateImages = async (imageIds, action, moderationNotes = '') => {
    try {
      debugLog(
        'CityArtWalks.Actions.Image.Hooks.useImageModeration.bulkModerateImages',
        'Starting bulk image moderation',
        {
          imageCount: imageIds.length,
          action,
          hasNotes: !!moderationNotes,
        }
      );

      const result = await requests.bulkModerateImages(imageIds, action, moderationNotes, token);

      // Invalidate flagged images cache
      mutate((key) => Array.isArray(key) && key[0] === 'flagged-images');

      debugLog(
        'CityArtWalks.Actions.Image.Hooks.useImageModeration.bulkModerateImages',
        'Bulk image moderation completed',
        {
          imageCount: imageIds.length,
          action,
          successCount: result.data?.successCount || 0,
          failureCount: result.data?.failureCount || 0,
        }
      );

      return result;
    } catch (error) {
      debugWarn(
        'CityArtWalks.Actions.Image.Hooks.useImageModeration.bulkModerateImages',
        'Bulk image moderation failed',
        { error }
      );
      throw error;
    }
  };

  return {
    moderateImage,
    bulkModerateImages,
  };
}
