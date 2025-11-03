/**
 * @file hooks.js
 * @description React hooks for comment operations using SWR
 * @namespace CityArtWalks.Actions.Comment.Hooks
 * @version 1.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Comment-Model} - Comment model documentation
 */

import useSWR, { useSWRConfig } from 'swr';
import { useMemo, useEffect } from 'react';

import { debugLog, debugWarn, debugError } from 'src/lib/debug';
import { saveToIndexedDb, loadFromIndexedDb, buildCacheKeyFromSWRKey } from 'src/lib/indexDb';

import * as requests from './requests.js';

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  keepPreviousData: true,
};

/**
 * SWR hook for paginated comments with IndexedDB caching support
 *
 * @memberof CityArtWalks.Actions.Comment.Hooks
 * @function useGetPaginatedComments
 * @param {Object} [filters={}] - Filter parameters object
 * @param {string} [filters.search=''] - Search term for comment content
 * @param {string} [filters.status=''] - Status filter (ACTIVE, MODERATED, DELETED, etc.)
 * @param {number} [filters.postId] - Post ID filter
 * @param {number} [filters.parentId] - Parent comment ID filter for replies
 * @param {number} [filters.createdBy] - Creator user ID filter
 * @param {string} [filters.sortBy='createdAt'] - Sort field
 * @param {string} [filters.sortOrder='desc'] - Sort order
 * @param {boolean} [filters.includeDeleted=false] - Include deleted comments
 * @param {boolean} [filters.includeModerated=false] - Include moderated comments
 * @param {number} [page=1] - Page number for pagination
 * @param {number} [rowsPerPage=10] - Number of items per page
 * @param {string} [token=''] - Auth token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @param {*} [refreshKey] - Key to trigger manual refresh
 * @returns {Object} Paginated comments result with IndexedDB caching
 * @returns {Array} returns.comments - Array of comment objects
 * @returns {Object} returns.paginationMeta - Pagination metadata
 * @returns {boolean} returns.commentsLoading - Loading state
 * @returns {Error} returns.commentsError - Error state
 * @returns {boolean} returns.commentsEmpty - Empty state
 * @returns {Function} returns.mutate - SWR mutate function
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useGetPaginatedComments(
  filters = {},
  page = 1,
  rowsPerPage = 10,
  token = '',
  revalidate = 600,
  refreshKey
) {
  const {
    search = '',
    status = '',
    postId,
    parentId,
    createdBy,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    includeDeleted = false,
    includeModerated = false,
  } = filters;
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    const key = [
      'getPaginatedComments',
      search,
      status,
      postId,
      parentId,
      createdBy,
      sortBy,
      sortOrder,
      includeDeleted,
      includeModerated,
      page,
      rowsPerPage,
      revalidate,
    ];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [
    search,
    status,
    postId,
    parentId,
    createdBy,
    sortBy,
    sortOrder,
    includeDeleted,
    includeModerated,
    page,
    rowsPerPage,
    revalidate,
  ]);

  const { data, isLoading, error, mutate } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getPaginatedComments(
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
      } catch (err) {
        debugError(
          'CityArtWalks.Actions.Comment.Hooks.useGetPaginatedComments',
          'Failed to fetch paginated comments',
          {
            error: err.message,
            filters,
            page,
            rowsPerPage,
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
          debugLog(`[IndexedDB] Cache hit for ${cacheKey}`);
          mutate(cached, false);
        }
      } catch (cacheError) {
        debugError(
          'CityArtWalks.Actions.Comment.Hooks.useGetPaginatedComments',
          'IndexedDB cache operation failed',
          {
            error: cacheError.message,
            cacheKey,
          }
        );
      }
    })();
  }, [cacheKey, mutate, revalidateMs]);

  // Manual refresh trigger
  useEffect(() => {
    if (refreshKey) mutate();
  }, [refreshKey, mutate]);

  return useMemo(
    () => ({
      comments: data?.comments || [],
      paginationMeta: data?.meta || {
        total: 0,
        page: 1,
        rowsPerPage: 10,
        totalPages: 0,
      },
      commentsLoading: isLoading,
      commentsError: error,
      commentsEmpty: !isLoading && (!data?.comments || data.comments.length === 0),
      mutate,
    }),
    [data, isLoading, error, mutate]
  );
}

/**
 * SWR hook for fetching a single comment by ID with IndexedDB caching
 *
 * @memberof CityArtWalks.Actions.Comment.Hooks
 * @function useGetCommentById
 * @param {string|number} id - The unique identifier of the comment
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @returns {Object} Comment data with loading and error states
 * @returns {Object} returns.comment - Comment object or null
 * @returns {boolean} returns.commentLoading - Loading state
 * @returns {Error} returns.commentError - Error state
 * @returns {boolean} returns.commentValidating - Revalidation state
 * @returns {boolean} returns.commentEmpty - Empty state
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useGetCommentById(id, token = '', revalidate = 600) {
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    if (!id) return { swrKey: null, cacheKey: null };
    const key = ['getCommentById', id, revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [id, revalidate]);

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getCommentById(id, token, revalidate);
        if (response && cacheKey) {
          await saveToIndexedDb(cacheKey, response);
          debugLog(`[IndexedDB] Saved data for ${cacheKey}`);
        }
        return response;
      } catch (err) {
        debugError(
          'CityArtWalks.Actions.Comment.Hooks.useGetCommentById',
          'Failed to fetch comment by ID',
          {
            error: err.message,
            id,
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
          debugLog(`[IndexedDB] Cache hit for ${cacheKey}`);
          mutate(cached, false);
        }
      } catch (cacheError) {
        debugWarn(
          'CityArtWalks.Actions.Comment.Hooks.useGetCommentById',
          'IndexedDB cache operation failed',
          {
            error: cacheError.message,
            cacheKey,
            id,
          }
        );
      }
    })();
  }, [cacheKey, mutate, revalidateMs, id]);

  return useMemo(
    () => ({
      comment: data || null,
      commentLoading: isLoading,
      commentError: error,
      commentValidating: isValidating,
      commentEmpty: !isLoading && !data,
    }),
    [data, isLoading, error, isValidating]
  );
}

/**
 * SWR hook for fetching comments by post ID with IndexedDB caching
 *
 * @memberof CityArtWalks.Actions.Comment.Hooks
 * @function useGetCommentsByPostId
 * @param {string|number} postId - The post ID to fetch comments for
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @returns {Object} Comments data with loading and error states
 * @returns {Array} returns.comments - Array of comment objects
 * @returns {boolean} returns.commentsLoading - Loading state
 * @returns {Error} returns.commentsError - Error state
 * @returns {boolean} returns.commentsValidating - Revalidation state
 * @returns {boolean} returns.commentsEmpty - Empty state
 * @returns {Function} returns.mutate - SWR mutate function
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useGetCommentsByPostId(postId, token = '', revalidate = 600) {
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    if (!postId) return { swrKey: null, cacheKey: null };
    const key = ['getCommentsByPostId', postId, revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [postId, revalidate]);

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getCommentsByPostId(postId, token, revalidate);
        if (response && cacheKey) {
          await saveToIndexedDb(cacheKey, response);
          debugLog(`[IndexedDB] Saved data for ${cacheKey}`);
        }
        return response;
      } catch (err) {
        debugError(
          'CityArtWalks.Actions.Comment.Hooks.useGetCommentsByPostId',
          'Failed to fetch comments by post ID',
          {
            error: err.message,
            postId,
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
          debugLog(`[IndexedDB] Cache hit for ${cacheKey}`);
          mutate(cached, false);
        }
      } catch (cacheError) {
        debugWarn(
          'CityArtWalks.Actions.Comment.Hooks.useGetCommentsByPostId',
          'IndexedDB cache operation failed',
          {
            error: cacheError.message,
            cacheKey,
            postId,
          }
        );
      }
    })();
  }, [cacheKey, mutate, revalidateMs, postId]);

  return useMemo(
    () => ({
      comments: data?.comments || [],
      commentsLoading: isLoading,
      commentsError: error,
      commentsValidating: isValidating,
      commentsEmpty: !isLoading && (!data?.comments || data.comments.length === 0),
      mutate,
    }),
    [data, isLoading, error, isValidating, mutate]
  );
}

/**
 * SWR hook for fetching comment replies with IndexedDB caching
 *
 * @memberof CityArtWalks.Actions.Comment.Hooks
 * @function useGetCommentReplies
 * @param {string|number} commentId - The comment ID to fetch replies for
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @returns {Object} Replies data with loading and error states
 * @returns {Array} returns.replies - Array of reply comment objects
 * @returns {boolean} returns.repliesLoading - Loading state
 * @returns {Error} returns.repliesError - Error state
 * @returns {boolean} returns.repliesValidating - Revalidation state
 * @returns {boolean} returns.repliesEmpty - Empty state
 * @returns {Function} returns.mutate - SWR mutate function
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useGetCommentReplies(commentId, token = '', revalidate = 600) {
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    if (!commentId) return { swrKey: null, cacheKey: null };
    const key = ['getCommentReplies', commentId, revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [commentId, revalidate]);

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getCommentReplies(commentId, token, revalidate);
        if (response && cacheKey) {
          await saveToIndexedDb(cacheKey, response);
          debugLog(`[IndexedDB] Saved data for ${cacheKey}`);
        }
        return response;
      } catch (err) {
        debugError(
          'CityArtWalks.Actions.Comment.Hooks.useGetCommentReplies',
          'Failed to fetch comment replies',
          {
            error: err.message,
            commentId,
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
          debugLog(`[IndexedDB] Cache hit for ${cacheKey}`);
          mutate(cached, false);
        }
      } catch (cacheError) {
        debugWarn(
          'CityArtWalks.Actions.Comment.Hooks.useGetCommentReplies',
          'IndexedDB cache operation failed',
          {
            error: cacheError.message,
            cacheKey,
            commentId,
          }
        );
      }
    })();
  }, [cacheKey, mutate, revalidateMs, commentId]);

  return useMemo(
    () => ({
      replies: data?.replies || [],
      repliesLoading: isLoading,
      repliesError: error,
      repliesValidating: isValidating,
      repliesEmpty: !isLoading && (!data?.replies || data.replies.length === 0),
      mutate,
    }),
    [data, isLoading, error, isValidating, mutate]
  );
}

/**
 * Hook for creating a new comment with automatic cache invalidation
 *
 * @memberof CityArtWalks.Actions.Comment.Hooks
 * @function useCreateComment
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to create a comment
 * @returns {Promise<Object>} returns.result - Created comment response
 * @throws {Error} When comment data validation fails or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useCreateComment(token = '') {
  const { mutate } = useSWRConfig();

  return async (commentData) => {
    try {
      const result = await requests.createComment(commentData, token);

      // Invalidate SWR cache
      mutate(
        (key) =>
          Array.isArray(key) &&
          (key.includes('comment') ||
            key.includes('getPaginatedComments') ||
            key.includes('getCommentsByPostId') ||
            key.includes('getCommentReplies'))
      );

      // Clear related IndexedDB cache entries manually
      const cachePatterns = [
        'comment',
        'getPaginatedComments',
        'getCommentsByPostId',
        'getCommentReplies',
      ];
      for (const pattern of cachePatterns) {
        const cacheKey = buildCacheKeyFromSWRKey([pattern]);
        await saveToIndexedDb(cacheKey, null);
      }

      debugLog(
        'CityArtWalks.Actions.Comment.Hooks.useCreateComment',
        'Successfully created comment and invalidated caches',
        {
          commentId: result?.commentId,
          postId: result?.postId,
          parentId: result?.parentId || 'None',
        }
      );

      return result;
    } catch (error) {
      debugError(
        'CityArtWalks.Actions.Comment.Hooks.useCreateComment',
        'Failed to create comment',
        {
          error: error.message,
          commentData: {
            postId: commentData?.postId || 'Missing',
            contentLength: commentData?.content?.length || 0,
            parentId: commentData?.parentId || 'None',
          },
          token: token ? '[REDACTED]' : 'none',
        }
      );
      throw error;
    }
  };
}

/**
 * Hook for updating an existing comment with automatic cache invalidation
 *
 * @memberof CityArtWalks.Actions.Comment.Hooks
 * @function useUpdateComment
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to update a comment
 * @returns {Promise<Object>} returns.result - Updated comment response
 * @throws {Error} When comment data validation fails or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useUpdateComment(token = '') {
  const { mutate } = useSWRConfig();

  return async (id, commentData) => {
    try {
      const result = await requests.updateComment(id, commentData, token);

      // Invalidate SWR cache
      mutate(
        (key) =>
          Array.isArray(key) &&
          (key.includes('comment') ||
            key.includes('getPaginatedComments') ||
            key.includes('getCommentsByPostId') ||
            key.includes('getCommentReplies') ||
            (key.includes('getCommentById') && key.includes(id)))
      );

      // Clear related IndexedDB cache entries manually
      const cachePatterns = [
        'comment',
        'getPaginatedComments',
        'getCommentsByPostId',
        'getCommentReplies',
        'getCommentById',
      ];
      for (const pattern of cachePatterns) {
        const cacheKey = buildCacheKeyFromSWRKey([pattern]);
        await saveToIndexedDb(cacheKey, null);
      }

      debugLog(
        'CityArtWalks.Actions.Comment.Hooks.useUpdateComment',
        'Successfully updated comment and invalidated caches',
        {
          commentId: id,
          postId: result?.postId,
          status: result?.status,
        }
      );

      return result;
    } catch (error) {
      debugError(
        'CityArtWalks.Actions.Comment.Hooks.useUpdateComment',
        'Failed to update comment',
        {
          error: error.message,
          id,
          commentData: {
            hasContent: !!commentData?.content,
            status: commentData?.status || 'Unknown',
          },
          token: token ? '[REDACTED]' : 'none',
        }
      );
      throw error;
    }
  };
}

/**
 * Hook for deleting a comment with automatic cache invalidation
 *
 * @memberof CityArtWalks.Actions.Comment.Hooks
 * @function useDeleteComment
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to delete a comment
 * @returns {Promise<Object>} returns.result - Deletion response
 * @throws {Error} When API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useDeleteComment(token = '') {
  const { mutate } = useSWRConfig();

  return async (id) => {
    try {
      const result = await requests.deleteComment(id, token);

      // Invalidate SWR cache
      mutate(
        (key) =>
          Array.isArray(key) &&
          (key.includes('comment') ||
            key.includes('getPaginatedComments') ||
            key.includes('getCommentsByPostId') ||
            key.includes('getCommentReplies') ||
            (key.includes('getCommentById') && key.includes(id)))
      );

      // Clear related IndexedDB cache entries manually
      const cachePatterns = [
        'comment',
        'getPaginatedComments',
        'getCommentsByPostId',
        'getCommentReplies',
        'getCommentById',
      ];
      for (const pattern of cachePatterns) {
        const cacheKey = buildCacheKeyFromSWRKey([pattern]);
        await saveToIndexedDb(cacheKey, null);
      }

      debugLog(
        'CityArtWalks.Actions.Comment.Hooks.useDeleteComment',
        'Successfully deleted comment and invalidated caches',
        {
          commentId: id,
        }
      );

      return result;
    } catch (error) {
      debugError(
        'CityArtWalks.Actions.Comment.Hooks.useDeleteComment',
        'Failed to delete comment',
        {
          error: error.message,
          id,
          token: token ? '[REDACTED]' : 'none',
        }
      );
      throw error;
    }
  };
}

/**
 * Combined hook that provides all comment mutation functions
 *
 * @memberof CityArtWalks.Actions.Comment.Hooks
 * @function useCommentMutations
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Object} Object containing all comment mutation functions
 * @returns {Function} returns.createComment - Create comment function
 * @returns {Function} returns.updateComment - Update comment function
 * @returns {Function} returns.deleteComment - Delete comment function
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useCommentMutations(token = '') {
  const createComment = useCreateComment(token);
  const updateComment = useUpdateComment(token);
  const deleteComment = useDeleteComment(token);

  return useMemo(
    () => ({
      createComment,
      updateComment,
      deleteComment,
    }),
    [createComment, updateComment, deleteComment]
  );
}
