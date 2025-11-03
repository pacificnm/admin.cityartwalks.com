/**
 * @file optimistic-hooks.js
 * @description Optimistic UI update hooks for review operations
 * @author Jaimie Garner
 * @version 1.0.0
 * @namespace CityArtWalks.Actions.Review.OptimisticHooks
 */

import { useSWRConfig } from 'swr';
import { useMemo, useCallback } from 'react';

import { debugLog } from 'src/lib/debug';

import { useAuthContext } from 'src/auth/hooks';

/**
 * @memberof CityArtWalks.Actions.Review.OptimisticHooks
 * @description Hook that provides optimistic UI actions for review lists
 * @function useOptimisticReviewActions
 * @returns {Object} Object containing optimistic action functions
 */
export function useOptimisticReviewActions() {
  const { mutate } = useSWRConfig();
  const { user } = useAuthContext();

  /**
   * Add a review optimistically to all relevant caches
   */
  const optimisticallyAddReview = useCallback(
    (reviewData) => {
      const optimisticReview = {
        reviewId: `temp-${Date.now()}`,
        ...reviewData,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        User: {
          userId: user?.userId,
          name: user?.name || 'You',
          image: user?.image || null,
        },
        _optimistic: true,
        _optimisticType: 'create',
      };

      // Update paginated reviews
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

      // Update review stats
      mutate(
        (key) => Array.isArray(key) && key[0] === 'getReviewStats',
        (data) => {
          if (!data?.data) return data;

          const newTotal = (data.data.totalReviews || 0) + 1;
          const currentTotal = data.data.totalReviews || 0;
          const newAverage =
            currentTotal > 0
              ? (data.data.averageRating * currentTotal + reviewData.rating) / newTotal
              : reviewData.rating;

          return {
            ...data,
            data: {
              ...data.data,
              totalReviews: newTotal,
              averageRating: newAverage,
              ratingDistribution: {
                ...data.data.ratingDistribution,
                [reviewData.rating]: (data.data.ratingDistribution?.[reviewData.rating] || 0) + 1,
              },
            },
          };
        },
        { revalidate: false }
      );

      debugLog(
        'OptimisticReviewActions.optimisticallyAddReview',
        'Applied optimistic add',
        optimisticReview
      );
      return optimisticReview;
    },
    [mutate, user]
  );

  /**
   * Update a review optimistically in all relevant caches
   */
  const optimisticallyUpdateReview = useCallback(
    (reviewId, updateData) => {
      // Update paginated reviews
      mutate(
        (key) => Array.isArray(key) && key[0] === 'getPaginatedReviews',
        (data) => {
          if (!data?.data?.reviews) return data;

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
                      _optimisticType: 'update',
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
              _optimisticType: 'update',
            },
          };
        },
        { revalidate: false }
      );

      debugLog('OptimisticReviewActions.optimisticallyUpdateReview', 'Applied optimistic update', {
        reviewId,
        updateData,
      });
    },
    [mutate]
  );

  /**
   * Remove a review optimistically from all relevant caches
   */
  const optimisticallyRemoveReview = useCallback(
    (reviewId) => {
      let removedReview = null;

      // Update paginated reviews
      mutate(
        (key) => Array.isArray(key) && key[0] === 'getPaginatedReviews',
        (data) => {
          if (!data?.data?.reviews) return data;

          removedReview = data.data.reviews.find((r) => r.reviewId === reviewId);

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

      // Update stats if we found the removed review
      if (removedReview) {
        mutate(
          (key) => Array.isArray(key) && key[0] === 'getReviewStats',
          (data) => {
            if (!data?.data) return data;

            const newTotal = Math.max(0, (data.data.totalReviews || 1) - 1);
            const newAverage =
              newTotal > 0
                ? (data.data.averageRating * data.data.totalReviews - removedReview.rating) /
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
                  [removedReview.rating]: Math.max(
                    0,
                    (data.data.ratingDistribution?.[removedReview.rating] || 0) - 1
                  ),
                },
              },
            };
          },
          { revalidate: false }
        );
      }

      debugLog('OptimisticReviewActions.optimisticallyRemoveReview', 'Applied optimistic removal', {
        reviewId,
        removedReview,
      });
      return removedReview;
    },
    [mutate]
  );

  /**
   * Mark a review as optimistically loading
   */
  const markReviewAsLoading = useCallback(
    (reviewId, loadingType = 'update') => {
      mutate(
        (key) => Array.isArray(key) && key[0] === 'getPaginatedReviews',
        (data) => {
          if (!data?.data?.reviews) return data;

          return {
            ...data,
            data: {
              ...data.data,
              reviews: data.data.reviews.map((review) =>
                review.reviewId === reviewId
                  ? {
                      ...review,
                      _loading: true,
                      _loadingType: loadingType,
                    }
                  : review
              ),
            },
          };
        },
        { revalidate: false }
      );

      debugLog('OptimisticReviewActions.markReviewAsLoading', 'Marked review as loading', {
        reviewId,
        loadingType,
      });
    },
    [mutate]
  );

  /**
   * Clear loading state from a review
   */
  const clearReviewLoading = useCallback(
    (reviewId) => {
      mutate(
        (key) => Array.isArray(key) && key[0] === 'getPaginatedReviews',
        (data) => {
          if (!data?.data?.reviews) return data;

          return {
            ...data,
            data: {
              ...data.data,
              reviews: data.data.reviews.map((review) =>
                review.reviewId === reviewId
                  ? {
                      ...review,
                      _loading: false,
                      _loadingType: undefined,
                      _optimistic: false,
                      _optimisticType: undefined,
                    }
                  : review
              ),
            },
          };
        },
        { revalidate: false }
      );

      debugLog('OptimisticReviewActions.clearReviewLoading', 'Cleared review loading state', {
        reviewId,
      });
    },
    [mutate]
  );

  /**
   * Invalidate all review caches (force refresh)
   */
  const invalidateReviewCaches = useCallback(() => {
    mutate((key) => Array.isArray(key) && key[0] === 'getPaginatedReviews');
    mutate((key) => Array.isArray(key) && key[0] === 'getReview');
    mutate((key) => Array.isArray(key) && key[0] === 'getReviewStats');

    debugLog('OptimisticReviewActions.invalidateReviewCaches', 'Invalidated all review caches');
  }, [mutate]);

  return useMemo(
    () => ({
      optimisticallyAddReview,
      optimisticallyUpdateReview,
      optimisticallyRemoveReview,
      markReviewAsLoading,
      clearReviewLoading,
      invalidateReviewCaches,
    }),
    [
      optimisticallyAddReview,
      optimisticallyUpdateReview,
      optimisticallyRemoveReview,
      markReviewAsLoading,
      clearReviewLoading,
      invalidateReviewCaches,
    ]
  );
}

/**
 * @memberof CityArtWalks.Actions.Review.OptimisticHooks
 * @description Hook that provides enhanced SWR data with optimistic state indicators
 * @function useOptimisticReviewData
 * @param {Object} reviewsData - Original SWR reviews data
 * @returns {Object} Enhanced data with optimistic state information
 */
export function useOptimisticReviewData(reviewsData) {
  return useMemo(() => {
    if (!reviewsData?.reviews) return reviewsData;

    const enhancedReviews = reviewsData.reviews.map((review) => ({
      ...review,
      isOptimistic: Boolean(review._optimistic),
      optimisticType: review._optimisticType || null,
      isLoading: Boolean(review._loading),
      loadingType: review._loadingType || null,
    }));

    return {
      ...reviewsData,
      reviews: enhancedReviews,
      hasOptimisticUpdates: enhancedReviews.some((r) => r.isOptimistic),
      hasLoadingItems: enhancedReviews.some((r) => r.isLoading),
    };
  }, [reviewsData]);
}
