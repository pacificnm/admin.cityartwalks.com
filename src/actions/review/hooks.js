/**
 * @file hooks.js
 * @description SWR-based data fetchin  const revalidate = 600,
  refreshKey = null,
}) {
  const { swrKey, cacheKey } = useMemo(() => {s for Reviews.
 * @author Jaimie Garner 
 * @version 2.0.0
 * @namespace CityArtWalks.Actions.Review.Hooks
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */

import useSWR, { useSWRConfig } from 'swr';
import { useMemo, useState, useEffect, useCallback } from 'react';

import { debugLog, debugWarn, debugError } from 'src/lib/debug';
import { saveToIndexedDb, loadFromIndexedDb, buildCacheKeyFromSWRKey } from 'src/lib/indexDb';

import { useAuthContext } from 'src/auth/hooks';

import * as requests from './requests';

/**
 * @memberof CityArtWalks.Actions.Review.Hooks
 * @description SWR configuration options to control revalidation behavior.
 * @constant {Object} swrOptions
 */
const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  keepPreviousData: true,
};

/**
 * @memberof CityArtWalks.Actions.Review.Hooks
 * @description Hook to fetch paginated reviews with comprehensive filtering and IndexedDB caching.
 * @function useGetPaginatedReviews
 * @param {Object} params - Parameters object
 * @param {number} [params.page=1] - Page number (1-based)
 * @param {number} [params.rowsPerPage=10] - Number of items per page
 * @param {string} [params.search=''] - Search query
 * @param {number} [params.rating=null] - Filter by rating
 * @param {string} [params.artistId=null] - Filter by artist ID
 * @param {string} [params.artPieceId=null] - Filter by art piece ID
 * @param {string} [params.imageId=null] - Filter by image ID
 * @param {string} [params.pathId=null] - Filter by path ID
 * @param {string} [params.createdBy=''] - Filter by creator
 * @param {string} [params.token=''] - Authentication token
 * @param {number} [params.revalidate=600] - Revalidation time in seconds
 * @param {*} [params.refreshKey=null] - Key to trigger refresh
 * @returns {Object} Result including loading states, errors, and paginated reviews data
 * @function useGetPaginatedReviews
 */
export function useGetPaginatedReviews({
  page = 1,
  rowsPerPage = 10,
  search = '',
  status = '',
  rating = null,
  entityType = '',
  artistId = null,
  artPieceId = null,
  imageId = null,
  pathId = null,
  pathMapId = null,
  startDate = null,
  endDate = null,
  priority = '',
  flagged = null,
  aiDecision = null,
  createdBy = '',
  token = '',
  revalidate = 600,
  refreshKey = null,
}) {
  const { swrKey, cacheKey } = useMemo(() => {
    const key = [
      'getPaginatedReviews',
      page,
      rowsPerPage,
      search,
      status,
      rating,
      entityType,
      artistId,
      artPieceId,
      imageId,
      pathId,
      pathMapId,
      startDate,
      endDate,
      priority,
      flagged,
      aiDecision,
      createdBy,
      revalidate,
    ];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [
    page,
    rowsPerPage,
    search,
    status,
    rating,
    entityType,
    artistId,
    artPieceId,
    imageId,
    pathId,
    pathMapId,
    startDate,
    endDate,
    priority,
    flagged,
    aiDecision,
    createdBy,
    revalidate,
  ]);

  const { data, isLoading, error, mutate } = useSWR(
    swrKey,
    async () => {
      const filters = {
        search,
        status,
        rating,
        entityType,
        artistId,
        artPieceId,
        imageId,
        pathId,
        pathMapId,
        startDate,
        endDate,
        priority,
        flagged,
        aiDecision,
        createdBy,
      };
      const response = await requests.getPaginatedReviews(
        page,
        rowsPerPage,
        filters,
        token,
        revalidate
      );
      await saveToIndexedDb(cacheKey, response?.data);
      return response;
    },
    swrOptions
  );

  useEffect(() => {
    if (refreshKey) {
      debugLog('Refreshing reviews data due to refreshKey change');
      mutate();
    }
  }, [refreshKey, mutate]);

  // Load from IndexedDB on mount
  useEffect(() => {
    const loadCachedData = async () => {
      try {
        const cachedData = await loadFromIndexedDb(cacheKey);
        if (cachedData && !data) {
          debugLog('Loaded reviews from IndexedDB cache');
          // Note: This doesn't trigger a re-render, it's just for immediate availability
        }
      } catch (cacheError) {
        debugWarn('Failed to load reviews from IndexedDB?:', cacheError);
      }
    };
    loadCachedData();
  }, [cacheKey, data]);

  return useMemo(() => {
    const reviews = data?.data?.reviews || [];
    const reviewsLoading = isLoading;
    const reviewsError = error;
    const paginationMeta = data?.data?.meta || {
      total: 0,
      page,
      rowsPerPage,
      totalPages: 0,
    };

    return {
      reviews,
      reviewsLoading,
      reviewsError,
      paginationMeta,
      mutate,
    };
  }, [data, isLoading, error, page, rowsPerPage, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.Review.Hooks
 * @description Hook for creating a new review with optimistic updates and cache invalidation.
 * @function useCreateReview
 * @param {string} [token=''] - Authentication token
 * @returns {Object} Object with mutateAsync function and optimistic update capability
 */
export function useCreateReview(token = '') {
  const { mutate } = useSWRConfig();

  const mutateAsync = async (review, options = {}) => {
    const { optimistic = true, rollbackOnError = true } = options;

    // Generate optimistic data
    const optimisticReview = {
      reviewId: `temp-${Date.now()}`,
      ...review,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      User: {
        name: 'You', // Placeholder for current user
      },
      _optimistic: true,
    };

    if (optimistic) {
      // Optimistically update all matching caches
      mutate(
        (key) => Array.isArray(key) && key[0] === 'getPaginatedReviews',
        (data) => {
          if (!data?.data?.reviews) return data;

          return {
            ...data,
            data: {
              ...data.data,
              reviews: [optimisticReview, ...data.data.reviews],
              meta: {
                ...data.data.meta,
                total: data.data.meta.total + 1,
              },
            },
          };
        },
        { revalidate: false }
      );

      // Update review stats optimistically
      mutate(
        (key) => Array.isArray(key) && key[0] === 'getReviewStats',
        (data) => {
          if (!data?.data) return data;

          return {
            ...data,
            data: {
              ...data.data,
              totalReviews: (data.data.totalReviews || 0) + 1,
              averageRating:
                data.data.totalReviews > 0
                  ? (data.data.averageRating * data.data.totalReviews + review.rating) /
                    (data.data.totalReviews + 1)
                  : review.rating,
              ratingDistribution: {
                ...data.data.ratingDistribution,
                [review.rating]: (data.data.ratingDistribution?.[review.rating] || 0) + 1,
              },
            },
          };
        },
        { revalidate: false }
      );

      debugLog('Applied optimistic update for review creation');
    }

    try {
      const result = await requests.createReview(review, token);

      // Replace optimistic data with real data
      mutate(
        (key) => Array.isArray(key) && key[0] === 'getPaginatedReviews',
        (data) => {
          if (!data?.data?.reviews) return data;

          return {
            ...data,
            data: {
              ...data.data,
              reviews: data.data.reviews.map((r) =>
                r.reviewId === optimisticReview.reviewId ? result.data : r
              ),
            },
          };
        },
        { revalidate: false }
      );

      // Revalidate stats to get accurate aggregations
      mutate((key) => Array.isArray(key) && key[0] === 'getReviewStats');

      debugLog('Review created successfully with optimistic update');
      return result;
    } catch (error) {
      debugWarn('Failed to create review?:', error);

      if (optimistic && rollbackOnError) {
        // Rollback optimistic updates
        mutate(
          (key) => Array.isArray(key) && key[0] === 'getPaginatedReviews',
          (data) => {
            if (!data?.data?.reviews) return data;

            return {
              ...data,
              data: {
                ...data.data,
                reviews: data.data.reviews.filter((r) => r.reviewId !== optimisticReview.reviewId),
                meta: {
                  ...data.data.meta,
                  total: Math.max(0, data.data.meta.total - 1),
                },
              },
            };
          },
          { revalidate: false }
        );

        mutate((key) => Array.isArray(key) && key[0] === 'getReviewStats');
        debugLog('Rolled back optimistic update after error');
      }

      throw error;
    }
  };

  return { mutateAsync };
}

/**
 * @memberof CityArtWalks.Actions.Review.Hooks
 * @description Hook for updating an existing review with optimistic updates and cache invalidation.
 * @function useUpdateReview
 * @param {string} [token=''] - Authentication token
 * @returns {Object} Object with mutateAsync function and optimistic update capability
 */
export function useUpdateReview(token = '') {
  const { mutate } = useSWRConfig();

  const mutateAsync = async (reviewData, options = {}) => {
    const { optimistic = true, rollbackOnError = true } = options;
    const { reviewId, ...updateData } = reviewData;

    let originalData = null;
    let originalStats = null;

    if (optimistic) {
      // Store original data for potential rollback
      await mutate((key) => Array.isArray(key) && key[0] === 'getPaginatedReviews', undefined, {
        revalidate: false,
      });

      // Optimistically update review in lists
      mutate(
        (key) => Array.isArray(key) && key[0] === 'getPaginatedReviews',
        (data) => {
          if (!data?.data?.reviews) return data;

          originalData = data;

          return {
            ...data,
            data: {
              ...data.data,
              reviews: data.data.reviews.map((review) =>
                review.reviewId === reviewId
                  ? {
                      ...review,
                      ...updateData,
                      updatedAt: new Date().toISOString(),
                      _optimistic: true,
                    }
                  : review
              ),
            },
          };
        },
        { revalidate: false }
      );

      // Update single review cache
      mutate(
        (key) => Array.isArray(key) && key[0] === 'getReview' && key[1] === reviewId,
        (data) => {
          if (!data?.data) return data;

          return {
            ...data,
            data: {
              ...data.data,
              ...updateData,
              updatedAt: new Date().toISOString(),
              _optimistic: true,
            },
          };
        },
        { revalidate: false }
      );

      // Update stats if rating changed
      if (updateData.rating !== undefined) {
        mutate(
          (key) => Array.isArray(key) && key[0] === 'getReviewStats',
          (data) => {
            if (!data?.data) return data;

            originalStats = data;
            const oldRating = originalData?.data?.reviews?.find(
              (r) => r.reviewId === reviewId
            )?.rating;

            if (oldRating && oldRating !== updateData.rating) {
              const oldTotal = data.data.totalReviews || 1;
              const newAverage =
                oldTotal > 1
                  ? (data.data.averageRating * oldTotal - oldRating + updateData.rating) / oldTotal
                  : updateData.rating;

              return {
                ...data,
                data: {
                  ...data.data,
                  averageRating: newAverage,
                  ratingDistribution: {
                    ...data.data.ratingDistribution,
                    [oldRating]: Math.max(0, (data.data.ratingDistribution?.[oldRating] || 0) - 1),
                    [updateData.rating]:
                      (data.data.ratingDistribution?.[updateData.rating] || 0) + 1,
                  },
                },
              };
            }

            return data;
          },
          { revalidate: false }
        );
      }

      debugLog('Applied optimistic update for review edit');
    }

    try {
      const result = await requests.updateReview(reviewId, updateData, token);

      // Replace optimistic data with real data
      mutate(
        (key) => Array.isArray(key) && key[0] === 'getPaginatedReviews',
        (data) => {
          if (!data?.data?.reviews) return data;

          return {
            ...data,
            data: {
              ...data.data,
              reviews: data.data.reviews.map((review) =>
                review.reviewId === reviewId ? result.data : review
              ),
            },
          };
        },
        { revalidate: false }
      );

      // Update single review cache with real data
      mutate((key) => Array.isArray(key) && key[0] === 'getReview' && key[1] === reviewId, result, {
        revalidate: false,
      });

      // Revalidate stats to get accurate aggregations
      mutate((key) => Array.isArray(key) && key[0] === 'getReviewStats');

      debugLog('Review updated successfully with optimistic update');
      return result;
    } catch (error) {
      debugWarn('Failed to update review?:', error);

      if (optimistic && rollbackOnError) {
        // Rollback optimistic updates
        if (originalData) {
          mutate((key) => Array.isArray(key) && key[0] === 'getPaginatedReviews', originalData, {
            revalidate: false,
          });
        }

        if (originalStats) {
          mutate((key) => Array.isArray(key) && key[0] === 'getReviewStats', originalStats, {
            revalidate: false,
          });
        }

        // Revalidate single review
        mutate((key) => Array.isArray(key) && key[0] === 'getReview' && key[1] === reviewId);

        debugLog('Rolled back optimistic update after error');
      }

      throw error;
    }
  };

  return { mutateAsync };
}

/**
 * @memberof CityArtWalks.Actions.Review.Hooks
 * @description Hook for deleting a review with optimistic updates and cache invalidation.
 * @function useDeleteReview
 * @param {string} [token=''] - Authentication token
 * @returns {Object} Object with mutateAsync function and optimistic update capability
 */
export function useDeleteReview(token = '') {
  const { mutate } = useSWRConfig();

  const mutateAsync = async (reviewId, options = {}) => {
    const { optimistic = true, rollbackOnError = true } = options;

    let originalData = null;
    let deletedReview = null;

    if (optimistic) {
      // Store original data for potential rollback
      mutate(
        (key) => Array.isArray(key) && key[0] === 'getPaginatedReviews',
        (data) => {
          if (!data?.data?.reviews) return data;

          originalData = data;
          deletedReview = data.data.reviews.find((r) => r.reviewId === reviewId);

          return {
            ...data,
            data: {
              ...data.data,
              reviews: data.data.reviews.filter((review) => review.reviewId !== reviewId),
              meta: {
                ...data.data.meta,
                total: Math.max(0, data.data.meta.total - 1),
              },
            },
          };
        },
        { revalidate: false }
      );

      // Update stats optimistically
      if (deletedReview) {
        mutate(
          (key) => Array.isArray(key) && key[0] === 'getReviewStats',
          (data) => {
            if (!data?.data) return data;

            const newTotal = Math.max(0, (data.data.totalReviews || 1) - 1);
            const newAverage =
              newTotal > 0
                ? (data.data.averageRating * data.data.totalReviews - deletedReview.rating) /
                  newTotal
                : 0;

            return {
              ...data,
              data: {
                ...data.data,
                totalReviews: newTotal,
                averageRating: newAverage,
                ratingDistribution: {
                  ...data.data.ratingDistribution,
                  [deletedReview.rating]: Math.max(
                    0,
                    (data.data.ratingDistribution?.[deletedReview.rating] || 0) - 1
                  ),
                },
              },
            };
          },
          { revalidate: false }
        );
      }

      debugLog('Applied optimistic update for review deletion');
    }

    try {
      const result = await requests.deleteReview(reviewId, token);

      // Confirm deletion in caches (data should already be removed optimistically)
      mutate((key) => Array.isArray(key) && key[0] === 'getPaginatedReviews');
      mutate((key) => Array.isArray(key) && key[0] === 'getReview' && key[1] === reviewId);
      mutate((key) => Array.isArray(key) && key[0] === 'getReviewStats');

      debugLog('Review deleted successfully with optimistic update');
      return result;
    } catch (error) {
      debugWarn('Failed to delete review?:', error);

      if (optimistic && rollbackOnError && originalData) {
        // Rollback optimistic updates
        mutate((key) => Array.isArray(key) && key[0] === 'getPaginatedReviews', originalData, {
          revalidate: false,
        });

        mutate((key) => Array.isArray(key) && key[0] === 'getReviewStats');

        debugLog('Rolled back optimistic update after error');
      }

      throw error;
    }
  };

  return { mutateAsync };
}

/**
 * @memberof CityArtWalks.Actions.Review.Hooks
 * @description Combined hook for all review mutations with consistent token handling and optimistic updates.
 * @function useReviewMutations
 * @param {string} [token=''] - Authentication token
 * @returns {Object} Object containing all mutation functions with optimistic update capabilities
 */
export function useReviewMutations(token = '') {
  const { mutateAsync: createReview } = useCreateReview(token);
  const { mutateAsync: updateReview } = useUpdateReview(token);
  const { mutateAsync: deleteReview } = useDeleteReview(token);
  const flagReview = useFlagReview(token);
  const moderateReview = useModerateReview(token);

  return {
    createReview,
    updateReview,
    deleteReview,
    flagReview,
    moderateReview,
  };
}

/**
 * @memberof CityArtWalks.Actions.Review.Hooks
 * @description Hook to fetch a single review by ID with IndexedDB caching.
 * @function useGetReview
 * @param {string|number} id - Review ID
 * @param {string} [token=''] - Authentication token
 * @param {number} [revalidate=600] - Revalidation time in seconds
 * @returns {Object} Result including loading states, errors, and review data
 */
export function useGetReview(id, token = '', revalidate = 600) {
  const { swrKey, cacheKey } = useMemo(() => {
    if (!id) return { swrKey: null, cacheKey: null };

    const key = ['getReview', id, revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [id, revalidate]);

  const { data, isLoading, error, mutate } = useSWR(
    swrKey,
    async () => {
      if (!id) return null;

      const response = await requests.getReview(id, token, revalidate);
      await saveToIndexedDb(cacheKey, response?.data);
      return response;
    },
    swrOptions
  );

  // Load from IndexedDB on mount
  useEffect(() => {
    const loadCachedData = async () => {
      try {
        if (cacheKey) {
          const cachedData = await loadFromIndexedDb(cacheKey);
          if (cachedData && !data) {
            debugLog('Loaded review from IndexedDB cache');
          }
        }
      } catch (cacheError) {
        debugWarn('Failed to load review from IndexedDB?:', cacheError);
      }
    };
    loadCachedData();
  }, [cacheKey, data]);

  return useMemo(() => {
    const review = data?.data || null;
    const reviewLoading = isLoading;
    const reviewError = error;

    return {
      review,
      reviewLoading,
      reviewError,
      mutate,
    };
  }, [data, isLoading, error, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.Review.Hooks
 * @description Hook to fetch review statistics for an entity with caching.
 * @function useGetReviewStats
 * @param {string} entityType - Entity type (ARTIST, ART_PIECE, IMAGE, PATH, PATH_MAP)
 * @param {string|number} entityId - Entity ID
 * @param {Object} options - Statistics options
 * @param {string} [token=''] - Authentication token
 * @param {number} [revalidate=300] - Revalidation time in seconds
 * @returns {Object} Result including loading states, errors, and statistics data
 */
export function useGetReviewStats(
  entityType,
  entityId,
  options = {},
  token = '',
  revalidate = 300
) {
  const { swrKey, cacheKey } = useMemo(() => {
    if (!entityType || !entityId) return { swrKey: null, cacheKey: null };

    const key = ['getReviewStats', entityType, entityId, options, revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [entityType, entityId, options, revalidate]);

  const { data, isLoading, error, mutate } = useSWR(
    swrKey,
    async () => {
      if (!entityType || !entityId) return null;

      const response = await requests.getReviewStats(
        entityType,
        entityId,
        options,
        token,
        revalidate
      );
      await saveToIndexedDb(cacheKey, response?.data);
      return response;
    },
    swrOptions
  );

  // Load from IndexedDB on mount
  useEffect(() => {
    const loadCachedData = async () => {
      try {
        if (cacheKey) {
          const cachedData = await loadFromIndexedDb(cacheKey);
          if (cachedData && !data) {
            debugLog('Loaded review stats from IndexedDB cache');
          }
        }
      } catch (cacheError) {
        debugWarn('Failed to load review stats from IndexedDB?:', cacheError);
      }
    };
    loadCachedData();
  }, [cacheKey, data]);

  return useMemo(() => {
    const stats = data?.data || null;
    const statsLoading = isLoading;
    const statsError = error;

    return {
      stats,
      statsLoading,
      statsError,
      mutate,
    };
  }, [data, isLoading, error, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.Review.Hooks
 * @description Hook for flagging a review with cache invalidation.
 * @function useFlagReview
 * @param {string} [token=''] - Authentication token
 * @returns {Function} Async function to flag a review
 */
export function useFlagReview(token = '') {
  const { mutate } = useSWRConfig();

  return async (reviewId, flagData) => {
    try {
      const result = await requests.flagReview(reviewId, flagData, token);
      // Invalidate review-related caches
      mutate((key) => Array.isArray(key) && key[0] === 'getPaginatedReviews');
      mutate((key) => Array.isArray(key) && key[0] === 'getReview');
      mutate((key) => Array.isArray(key) && key[0] === 'getReviewsForModeration');
      debugLog('Review flagged successfully');
      return result;
    } catch (error) {
      debugWarn('Failed to flag review?:', error);
      throw error;
    }
  };
}

/**
 * @memberof CityArtWalks.Actions.Review.Hooks
 * @description Hook to fetch reviews requiring moderation (admin only).
 * @function useGetReviewsForModeration
 * @param {Object} options - Query options
 * @param {string} [token=''] - Authentication token
 * @param {number} [revalidate=60] - Revalidation time in seconds (short for admin queue)
 * @returns {Object} Result including loading states, errors, and moderation queue data
 */
export function useGetReviewsForModeration(options = {}, token = '', revalidate = 60) {
  const { swrKey, cacheKey } = useMemo(() => {
    const key = ['getReviewsForModeration', options, revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [options, revalidate]);

  const { data, isLoading, error, mutate } = useSWR(
    swrKey,
    async () => {
      const response = await requests.getReviewsForModeration(options, token, revalidate);
      await saveToIndexedDb(cacheKey, response?.data);
      return response;
    },
    {
      ...swrOptions,
      refreshInterval: 30000, // Auto-refresh every 30 seconds for admin queue
    }
  );

  // Load from IndexedDB on mount
  useEffect(() => {
    const loadCachedData = async () => {
      try {
        if (cacheKey) {
          const cachedData = await loadFromIndexedDb(cacheKey);
          if (cachedData && !data) {
            debugLog('Loaded moderation queue from IndexedDB cache');
          }
        }
      } catch (cacheError) {
        debugWarn('Failed to load moderation queue from IndexedDB?:', cacheError);
      }
    };
    loadCachedData();
  }, [cacheKey, data]);

  return useMemo(() => {
    const reviews = data?.data?.reviews || [];
    const moderationLoading = isLoading;
    const moderationError = error;
    const paginationMeta = data?.data?.meta || {
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
    };

    return {
      reviews,
      moderationLoading,
      moderationError,
      paginationMeta,
      mutate,
    };
  }, [data, isLoading, error, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.Review.Hooks
 * @description Hook for making admin moderation decisions with cache invalidation.
 * @function useModerateReview
 * @param {string} [token=''] - Authentication token
 * @returns {Function} Async function to moderate a review
 */
export function useModerateReview(token = '') {
  const { mutate } = useSWRConfig();

  return async (reviewId, decision) => {
    try {
      const result = await requests.moderateReview(reviewId, decision, token);
      // Invalidate all review-related caches
      mutate((key) => Array.isArray(key) && key[0] === 'getPaginatedReviews');
      mutate((key) => Array.isArray(key) && key[0] === 'getReview');
      mutate((key) => Array.isArray(key) && key[0] === 'getReviewsForModeration');
      mutate((key) => Array.isArray(key) && key[0] === 'getReviewStats');
      debugLog('Review moderation decision completed');
      return result;
    } catch (error) {
      debugWarn('Failed to moderate review?:', error);
      throw error;
    }
  };
}

/**
 * @memberof CityArtWalks.Actions.Review.Hooks
 * @description Hook for recording manual overrides of AI moderation decisions with cache invalidation.
 * @function useRecordManualOverride
 * @param {string} [token=''] - Authentication token
 * @returns {Function} Async function to record a manual override
 */
export function useRecordManualOverride(token = '') {
  const { mutate } = useSWRConfig();

  return async (reviewId, overrideData) => {
    try {
      const result = await requests.recordManualOverride(reviewId, overrideData, token);
      // Invalidate all review-related caches
      mutate((key) => Array.isArray(key) && key[0] === 'getPaginatedReviews');
      mutate((key) => Array.isArray(key) && key[0] === 'getReview');
      mutate((key) => Array.isArray(key) && key[0] === 'getReviewsForModeration');
      mutate((key) => Array.isArray(key) && key[0] === 'getReviewStats');
      debugLog('Manual override recorded successfully');
      return result;
    } catch (error) {
      debugWarn('Failed to record manual override?:', error);
      throw error;
    }
  };
}

/**
 * @memberof CityArtWalks.Actions.Review.Hooks
 * @description Hook to retry AI moderation for a review
 * @function useRetryAIModeration
 * @param {string} [token=''] - Authentication token
 * @returns {Function} Async function to retry AI moderation
 */
export function useRetryAIModeration(token = '') {
  const { mutate } = useSWRConfig();

  return async (reviewId) => {
    try {
      const result = await requests.retryAIModeration(reviewId, token);
      // Invalidate all review-related caches to show updated AI results
      mutate((key) => Array.isArray(key) && key[0] === 'getPaginatedReviews');
      mutate((key) => Array.isArray(key) && key[0] === 'getReview');
      mutate((key) => Array.isArray(key) && key[0] === 'getReviewsForModeration');
      mutate((key) => Array.isArray(key) && key[0] === 'getReviewStats');
      debugLog('AI moderation retry completed successfully');
      return result;
    } catch (error) {
      debugWarn('Failed to retry AI moderation?:', error);
      throw error;
    }
  };
}

/**
 * @memberof CityArtWalks.Actions.Review.Hooks
 * @description Hook to fetch moderation history with comprehensive filtering and caching.
 * @function useGetModerationHistory
 * @param {Object} options - Query options
 * @param {string} [token=''] - Authentication token
 * @param {number} [revalidate=300] - Revalidation time in seconds
 * @returns {Object} Result including loading states, errors, and moderation history data
 */
export function useGetModerationHistory(options = {}, token = '', revalidate = 300) {
  const { swrKey, cacheKey } = useMemo(() => {
    const key = ['getModerationHistory', options, revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [options, revalidate]);

  const { data, isLoading, error, mutate } = useSWR(
    swrKey,
    async () => {
      const response = await requests.getModerationHistory(options, token, revalidate);
      await saveToIndexedDb(cacheKey, response?.data);
      return response;
    },
    {
      ...swrOptions,
      refreshInterval: 60000, // Auto-refresh every minute for history updates
    }
  );

  // Load from IndexedDB on mount
  useEffect(() => {
    const loadCachedData = async () => {
      try {
        if (cacheKey) {
          const cachedData = await loadFromIndexedDb(cacheKey);
          if (cachedData && !data) {
            debugLog('Loaded moderation history from IndexedDB cache');
          }
        }
      } catch (cacheError) {
        debugWarn('Failed to load moderation history from IndexedDB?:', cacheError);
      }
    };
    loadCachedData();
  }, [cacheKey, data]);

  return useMemo(() => {
    const history = data?.data?.history || [];
    const historyLoading = isLoading;
    const historyError = error;
    const paginationMeta = data?.data?.meta || {
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    };
    const filters = data?.data?.filters || {};

    return {
      history,
      historyLoading,
      historyError,
      paginationMeta,
      filters,
      mutate,
    };
  }, [data, isLoading, error, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.Review.Hooks
 * @description Hook to fetch moderation statistics with caching and real-time updates.
 * @function useGetModerationStatistics
 * @param {Object} options - Query options
 * @param {string} [token=''] - Authentication token
 * @param {number} [revalidate=300] - Revalidation time in seconds
 * @returns {Object} Result including loading states, errors, and statistics data
 */
export function useGetModerationStatistics(options = {}, token = '', revalidate = 300) {
  const { swrKey, cacheKey } = useMemo(() => {
    const key = ['getModerationStatistics', options, revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [options, revalidate]);

  const { data, isLoading, error, mutate } = useSWR(
    swrKey,
    async () => {
      const response = await requests.getModerationStatistics(options, token, revalidate);
      await saveToIndexedDb(cacheKey, response?.data);
      return response;
    },
    {
      ...swrOptions,
      refreshInterval: 300000, // Auto-refresh every 5 minutes for live dashboard
    }
  );

  // Load from IndexedDB on mount
  useEffect(() => {
    const loadCachedData = async () => {
      try {
        if (cacheKey) {
          const cachedData = await loadFromIndexedDb(cacheKey);
          if (cachedData && !data) {
            debugLog('Loaded moderation statistics from IndexedDB cache');
          }
        }
      } catch (cacheError) {
        debugWarn('Failed to load moderation statistics from IndexedDB?:', cacheError);
      }
    };
    loadCachedData();
  }, [cacheKey, data]);

  return useMemo(() => {
    const statistics = data?.data || null;
    const statisticsLoading = isLoading;
    const statisticsError = error;

    // Extract sections from statistics if available
    const overview = statistics?.overview || {};
    const moderation = statistics?.moderation || {};
    const distributions = statistics?.distributions || {};
    const topReviewers = statistics?.topReviewers || [];
    const recentActivity = statistics?.recentActivity || [];
    const trends = statistics?.trends || [];
    const insights = statistics?.insights || {};
    const metadata = statistics?.metadata || {};

    return {
      statistics,
      overview,
      moderation,
      distributions,
      topReviewers,
      recentActivity,
      trends,
      insights,
      metadata,
      statisticsLoading,
      statisticsError,
      mutate,
    };
  }, [data, isLoading, error, mutate]);
}

// ==================== OWNER DASHBOARD HOOKS ====================

/**
 * Hook for fetching content owned by authenticated user
 *
 * @memberof CityArtWalks.Actions.Review.Hooks
 * @function useOwnerContent
 * @param {Object} options - Query options
 * @param {string} [options.entityType] - Filter by entity type
 * @param {boolean} [options.enabled=true] - Whether to fetch data
 * @param {number} [options.revalidateOnStale=300] - Revalidation time in seconds
 * @returns {Object} SWR response with owner content data
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useOwnerContent(options = {}) {
  const { user } = useAuthContext();
  const { entityType, enabled = true, revalidateOnStale = 300 } = options;

  // Generate cache key based on user and options
  const cacheKey = user?.userId ? `owner_content_${user.userId}_${entityType || 'all'}` : null;

  const { data, error, isLoading, mutate } = useSWR(
    enabled && user?.userId ? ['owner-content', { entityType }] : null,
    () => requests.getOwnerContent({ entityType }, user.accessToken, revalidateOnStale),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
      dedupingInterval: 30000,
      errorRetryCount: 2,
      errorRetryInterval: 5000,
      onError: (err) => {
        debugError('CityArtWalks.Actions.Review.Hooks.useOwnerContent', err);
      },
      onSuccess: async (responseData) => {
        // Cache successful response in IndexedDB
        if (cacheKey && responseData?.data) {
          try {
            await saveToIndexedDb(cacheKey, responseData, revalidateOnStale);
          } catch (cacheError) {
            debugWarn('Failed to cache owner content in IndexedDB?:', cacheError);
          }
        }
      },
    }
  );

  // Load from IndexedDB on mount
  useEffect(() => {
    const loadCachedData = async () => {
      try {
        if (cacheKey) {
          const cachedData = await loadFromIndexedDb(cacheKey);
          if (cachedData && !data) {
            debugLog('Loaded owner content from IndexedDB cache');
          }
        }
      } catch (cacheError) {
        debugWarn('Failed to load owner content from IndexedDB?:', cacheError);
      }
    };
    loadCachedData();
  }, [cacheKey, data]);

  return useMemo(() => {
    const ownerContent = data?.data || null;
    const content = ownerContent?.content || {};
    const summary = ownerContent?.summary || {};

    return {
      ownerContent,
      content,
      summary,
      artists: content.artists || [],
      artPieces: content.artPieces || [],
      images: content.images || [],
      paths: content.paths || [],
      pathMaps: content.pathMaps || [],
      isLoading,
      error,
      mutate,
    };
  }, [data, isLoading, error, mutate]);
}

/**
 * Hook for fetching reviews of content owned by authenticated user
 *
 * @memberof CityArtWalks.Actions.Review.Hooks
 * @function useOwnerReviews
 * @param {Object} options - Query options
 * @param {number} [options.page=1] - Page number
 * @param {number} [options.limit=20] - Items per page
 * @param {string} [options.status] - Filter by review status
 * @param {string} [options.entityType] - Filter by entity type
 * @param {number} [options.minRating] - Minimum rating filter
 * @param {number} [options.maxRating] - Maximum rating filter
 * @param {boolean} [options.enabled=true] - Whether to fetch data
 * @param {number} [options.revalidateOnStale=60] - Revalidation time in seconds
 * @returns {Object} SWR response with paginated reviews data
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useOwnerReviews(options = {}) {
  const { user } = useAuthContext();
  const {
    page = 1,
    limit = 20,
    status,
    entityType,
    minRating,
    maxRating,
    enabled = true,
    revalidateOnStale = 60,
  } = options;

  // Generate cache key based on user and filters
  const cacheKey = user?.userId
    ? `owner_reviews_${user.userId}_${page}_${limit}_${status || 'all'}_${entityType || 'all'}_${minRating || 'min'}_${maxRating || 'max'}`
    : null;

  const queryOptions = {
    page,
    limit,
    status,
    entityType,
    minRating,
    maxRating,
  };

  const { data, error, isLoading, mutate } = useSWR(
    enabled && user?.userId ? ['owner-reviews', queryOptions] : null,
    () => requests.getOwnerReviews(queryOptions, user.accessToken, revalidateOnStale),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      revalidateOnMount: true,
      dedupingInterval: 10000,
      errorRetryCount: 2,
      errorRetryInterval: 3000,
      onError: (err) => {
        debugError('CityArtWalks.Actions.Review.Hooks.useOwnerReviews', err);
      },
      onSuccess: async (responseData) => {
        // Cache successful response in IndexedDB
        if (cacheKey && responseData?.data) {
          try {
            await saveToIndexedDb(cacheKey, responseData, revalidateOnStale);
          } catch (cacheError) {
            debugWarn('Failed to cache owner reviews in IndexedDB?:', cacheError);
          }
        }
      },
    }
  );

  // Load from IndexedDB on mount
  useEffect(() => {
    const loadCachedData = async () => {
      try {
        if (cacheKey) {
          const cachedData = await loadFromIndexedDb(cacheKey);
          if (cachedData && !data) {
            debugLog('Loaded owner reviews from IndexedDB cache');
          }
        }
      } catch (cacheError) {
        debugWarn('Failed to load owner reviews from IndexedDB?:', cacheError);
      }
    };
    loadCachedData();
  }, [cacheKey, data]);

  return useMemo(() => {
    const ownerReviews = data?.data || null;
    const reviews = ownerReviews?.reviews || [];
    const pagination = ownerReviews?.pagination || {};
    const summary = ownerReviews?.summary || {};

    return {
      ownerReviews,
      reviews,
      pagination,
      summary,
      totalReviews: pagination.total || 0,
      totalPages: pagination.totalPages || 0,
      hasNext: pagination.hasNext || false,
      hasPrev: pagination.hasPrev || false,
      isLoading,
      error,
      mutate,
    };
  }, [data, isLoading, error, mutate]);
}

/**
 * Hook for fetching review statistics for content owned by authenticated user
 *
 * @memberof CityArtWalks.Actions.Review.Hooks
 * @function useOwnerStats
 * @param {Object} options - Query options
 * @param {string} [options.startDate] - Start date for statistics
 * @param {string} [options.endDate] - End date for statistics
 * @param {boolean} [options.enabled=true] - Whether to fetch data
 * @param {number} [options.revalidateOnStale=300] - Revalidation time in seconds
 * @returns {Object} SWR response with comprehensive statistics data
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useOwnerStats(options = {}) {
  const { user } = useAuthContext();
  const { startDate, endDate, enabled = true, revalidateOnStale = 300 } = options;

  // Generate cache key based on user and date range
  const cacheKey = user?.userId
    ? `owner_stats_${user.userId}_${startDate || 'start'}_${endDate || 'end'}`
    : null;

  const queryOptions = { startDate, endDate };

  const { data, error, isLoading, mutate } = useSWR(
    enabled && user?.userId ? ['owner-stats', queryOptions] : null,
    () => requests.getOwnerReviewStats(queryOptions, user.accessToken, revalidateOnStale),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
      dedupingInterval: 60000, // Stats don't change frequently
      errorRetryCount: 2,
      errorRetryInterval: 5000,
      onError: (err) => {
        debugError('CityArtWalks.Actions.Review.Hooks.useOwnerStats', err);
      },
      onSuccess: async (responseData) => {
        // Cache successful response in IndexedDB
        if (cacheKey && responseData?.data) {
          try {
            await saveToIndexedDb(cacheKey, responseData, revalidateOnStale);
          } catch (cacheError) {
            debugWarn('Failed to cache owner stats in IndexedDB?:', cacheError);
          }
        }
      },
    }
  );

  // Load from IndexedDB on mount
  useEffect(() => {
    const loadCachedData = async () => {
      try {
        if (cacheKey) {
          const cachedData = await loadFromIndexedDb(cacheKey);
          if (cachedData && !data) {
            debugLog('Loaded owner stats from IndexedDB cache');
          }
        }
      } catch (cacheError) {
        debugWarn('Failed to load owner stats from IndexedDB?:', cacheError);
      }
    };
    loadCachedData();
  }, [cacheKey, data]);

  return useMemo(() => {
    const stats = data?.data || null;
    const performance = stats?.performance || {};
    const quality = stats?.quality || {};
    const moderation = stats?.moderation || {};
    const widgets = stats?.widgets || {};

    return {
      stats,
      performance,
      quality,
      moderation,
      widgets,
      totalReviews: stats?.totalReviews || 0,
      activeReviews: stats?.activeReviews || 0,
      averageRating: stats?.averageRating || 0,
      flaggedCount: stats?.flaggedCount || 0,
      ratingDistribution: stats?.ratingDistribution || {},
      statusDistribution: stats?.statusDistribution || {},
      recentReviews: stats?.recentReviews || [],
      isLoading,
      error,
      mutate,
    };
  }, [data, isLoading, error, mutate]);
}

/**
 * Hook for bulk flagging reviews
 *
 * @memberof CityArtWalks.Actions.Review.Hooks
 * @function useBulkFlagReviews
 * @returns {Object} Mutation function and state
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useBulkFlagReviews() {
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const bulkFlag = useCallback(
    async (reviewIds, reason, details = '') => {
      if (!user?.accessToken) {
        throw new Error('Authentication required');
      }

      setIsLoading(true);
      setError(null);

      try {
        debugLog(
          'CityArtWalks.Actions.Review.Hooks.useBulkFlagReviews',
          `Bulk flagging ${reviewIds.length} reviews`
        );

        const result = await requests.bulkFlagReviews(
          {
            reviewIds,
            reason,
            details,
          },
          user.accessToken
        );

        debugLog(
          'CityArtWalks.Actions.Review.Hooks.useBulkFlagReviews',
          `Bulk flag completed: ${result.data?.results?.successful?.length || 0} successful`
        );

        return result.data;
      } catch (err) {
        debugError('CityArtWalks.Actions.Review.Hooks.useBulkFlagReviews', err);
        setError(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  return useMemo(
    () => ({
      bulkFlag,
      isLoading,
      error,
    }),
    [bulkFlag, isLoading, error]
  );
}
