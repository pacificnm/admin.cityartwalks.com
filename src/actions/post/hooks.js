/**
 * @file hooks.js
 * @description React hooks for post operations using SWR
 * @namespace CityArtWalks.Actions.Post.Hooks
 * @version 1.1.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Post-Model} - Post model documentation
 */

import useSWR, { useSWRConfig } from 'swr';
import { useMemo, useEffect } from 'react';

import { debugLog, debugError } from 'src/lib/debug';
import { saveToIndexedDb, loadFromIndexedDb, buildCacheKeyFromSWRKey } from 'src/lib/indexDb';

import * as requests from './requests.js';

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  keepPreviousData: true,
  dedupingInterval: 30000, // 30 seconds deduplication
};

/**
 * SWR hook for paginated posts with IndexedDB caching support
 *
 * @memberof CityArtWalks.Actions.Post.Hooks
 * @function useGetPaginatedPosts
 * @param {Object} [filters={}] - Filter parameters object
 * @param {string} [filters.search=''] - Search term for title/content fields
 * @param {string} [filters.status=''] - Status filter (DRAFT, PUBLISHED, etc.)
 * @param {string} [filters.category=''] - Category filter
 * @param {Array} [filters.tags=[]] - Tags filter array
 * @param {string} [filters.featured=''] - Featured filter
 * @param {string} [filters.createdBy=''] - Creator user ID filter
 * @param {number} [page=1] - Page number for pagination
 * @param {number} [rowsPerPage=10] - Number of items per page
 * @param {string} [token=''] - Auth token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @param {*} [refreshKey] - Key to trigger manual refresh
 * @returns {Object} Paginated posts result with IndexedDB caching
 * @returns {Array} returns.posts - Array of post objects
 * @returns {Object} returns.paginationMeta - Pagination metadata
 * @returns {boolean} returns.postsLoading - Loading state
 * @returns {Error} returns.postsError - Error state
 * @returns {boolean} returns.postsEmpty - Empty state
 * @returns {Function} returns.mutate - SWR mutate function
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useGetPaginatedPosts(
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
    category = '',
    tags = [],
    featured = '',
    createdBy = '',
  } = filters;
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    const key = [
      'getPaginatedPosts',
      search,
      status,
      category,
      tags,
      featured,
      createdBy,
      page,
      rowsPerPage,
      revalidate,
    ];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [search, status, category, tags, featured, createdBy, page, rowsPerPage, revalidate]);

  const { data, isLoading, error, mutate } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getPaginatedPosts(
          page,
          rowsPerPage,
          filters,
          token,
          revalidate
        );
        if (response && cacheKey) {
          await saveToIndexedDb(cacheKey, response);
          debugLog(
            'CityArtWalks.Actions.Post.Hooks.useGetPaginatedPosts',
            `[IndexedDB] Saved data for ${cacheKey}`
          );
        }
        return response;
      } catch (err) {
        debugError(
          'CityArtWalks.Actions.Post.Hooks.useGetPaginatedPosts',
          'Failed to fetch paginated posts',
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
          debugLog(
            'CityArtWalks.Actions.Post.Hooks.useGetPaginatedPosts',
            `[IndexedDB] Cache hit for ${cacheKey}`
          );
          mutate(cached, false);
        }
      } catch (cacheError) {
        debugError(
          'CityArtWalks.Actions.Post.Hooks.useGetPaginatedPosts',
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
      posts: data?.data?.posts || data?.posts || [],
      paginationMeta: data?.data?.meta ||
        data?.meta || {
          total: 0,
          page: 1,
          rowsPerPage: 10,
          totalPages: 0,
        },
      postsLoading: isLoading,
      postsError: error,
      postsEmpty:
        !isLoading &&
        ((!data?.data?.posts && !data?.posts) ||
          (data?.data?.posts || data?.posts || []).length === 0),
      mutate,
    }),
    [data, isLoading, error, mutate]
  );
}

/**
 * SWR hook for fetching a single post by ID with IndexedDB caching
 *
 * @memberof CityArtWalks.Actions.Post.Hooks
 * @function useGetPostById
 * @param {string|number} id - The unique identifier of the post
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @returns {Object} Post data with loading and error states
 * @returns {Object} returns.post - Post object or null
 * @returns {boolean} returns.postLoading - Loading state
 * @returns {Error} returns.postError - Error state
 * @returns {boolean} returns.postValidating - Revalidation state
 * @returns {boolean} returns.postEmpty - Empty state
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useGetPostById(id, token = '', revalidate = 600) {
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    if (!id) return { swrKey: null, cacheKey: null };
    const key = ['getPostById', id, revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [id, revalidate]);

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getPostById(id, token, revalidate);
        if (response && cacheKey) {
          await saveToIndexedDb(cacheKey, response);
          debugLog(
            'CityArtWalks.Actions.Post.Hooks.useGetPostById',
            `[IndexedDB] Saved data for ${cacheKey}`
          );
        }
        return response;
      } catch (err) {
        debugError('CityArtWalks.Actions.Post.Hooks.useGetPostById', 'Failed to fetch post by ID', {
          error: err.message,
          id,
          token: token ? '[REDACTED]' : 'none',
        });
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
            'CityArtWalks.Actions.Post.Hooks.useGetPostById',
            `[IndexedDB] Cache hit for ${cacheKey}`
          );
          mutate(cached, false);
        }
      } catch (cacheError) {
        debugError(
          'CityArtWalks.Actions.Post.Hooks.useGetPostById',
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
      post: data || null,
      postLoading: isLoading,
      postError: error,
      postValidating: isValidating,
      postEmpty: !isLoading && !data,
    }),
    [data, isLoading, error, isValidating]
  );
}

/**
 * SWR hook for fetching a single post by slug with IndexedDB caching
 *
 * @memberof CityArtWalks.Actions.Post.Hooks
 * @function useGetPostBySlug
 * @param {string} slug - The unique slug identifier for the post
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @returns {Object} Post data with loading and error states
 * @returns {Object} returns.post - Post object or null
 * @returns {boolean} returns.postLoading - Loading state
 * @returns {Error} returns.postError - Error state
 * @returns {boolean} returns.postValidating - Revalidation state
 * @returns {boolean} returns.postEmpty - Empty state
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useGetPostBySlug(slug, token = '', revalidate = 600) {
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    if (!slug) return { swrKey: null, cacheKey: null };
    const key = ['getPostBySlug', slug, revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [slug, revalidate]);

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getPostBySlug(slug, token, revalidate);
        if (response && cacheKey) {
          await saveToIndexedDb(cacheKey, response);
          debugLog(
            'CityArtWalks.Actions.Post.Hooks.useGetPostBySlug',
            `[IndexedDB] Saved data for ${cacheKey}`
          );
        }
        return response;
      } catch (err) {
        debugError(
          'CityArtWalks.Actions.Post.Hooks.useGetPostBySlug',
          'Failed to fetch post by slug',
          {
            error: err.message,
            slug: slug ? '[REDACTED]' : 'none',
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
            'CityArtWalks.Actions.Post.Hooks.useGetPostBySlug',
            `[IndexedDB] Cache hit for ${cacheKey}`
          );
          mutate(cached, false);
        }
      } catch (cacheError) {
        debugError(
          'CityArtWalks.Actions.Post.Hooks.useGetPostBySlug',
          'IndexedDB cache operation failed',
          {
            error: cacheError.message,
            cacheKey,
            slug: slug ? '[REDACTED]' : 'none',
          }
        );
      }
    })();
  }, [cacheKey, mutate, revalidateMs, slug]);

  return useMemo(
    () => ({
      post: data || null,
      postLoading: isLoading,
      postError: error,
      postValidating: isValidating,
      postEmpty: !isLoading && !data,
    }),
    [data, isLoading, error, isValidating]
  );
}

/**
 * Hook for creating a new post with automatic cache invalidation
 *
 * @memberof CityArtWalks.Actions.Post.Hooks
 * @function useCreatePost
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to create a post
 * @returns {Promise<Object>} returns.result - Created post response
 * @throws {Error} When post data validation fails or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useCreatePost(token = '') {
  const { mutate } = useSWRConfig();

  return async (postData) => {
    try {
      const result = await requests.createPost(postData, token);

      // Invalidate SWR cache
      mutate(
        (key) => Array.isArray(key) && (key.includes('post') || key.includes('getPaginatedPosts'))
      );

      // Clear related IndexedDB cache entries manually
      const cachePatterns = ['post', 'getPaginatedPosts'];
      for (const pattern of cachePatterns) {
        const cacheKey = buildCacheKeyFromSWRKey([pattern]);
        await saveToIndexedDb(cacheKey, null);
      }

      debugLog(
        'CityArtWalks.Actions.Post.Hooks.useCreatePost',
        'Successfully created post and invalidated caches',
        {
          postId: result?.postId,
          title: result?.title,
        }
      );

      return result;
    } catch (error) {
      debugError('CityArtWalks.Actions.Post.Hooks.useCreatePost', 'Failed to create post', {
        error: error.message,
        postData: {
          title: postData?.title || 'Missing',
          category: postData?.category || 'None',
        },
        token: token ? '[REDACTED]' : 'none',
      });
      throw error;
    }
  };
}

/**
 * Hook for updating an existing post with automatic cache invalidation
 *
 * @memberof CityArtWalks.Actions.Post.Hooks
 * @function useUpdatePost
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to update a post
 * @returns {Promise<Object>} returns.result - Updated post response
 * @throws {Error} When post data validation fails or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useUpdatePost(token = '') {
  const { mutate } = useSWRConfig();

  return async (id, postData) => {
    try {
      const result = await requests.updatePost(id, postData, token);

      // Invalidate SWR cache - target specific keys
      mutate(
        (key) =>
          Array.isArray(key) &&
          (key.includes('post') ||
            key.includes('getPaginatedPosts') ||
            (key.includes('getPostById') && key.includes(id)) ||
            key.includes('getPostBySlug'))
      );

      // Clear related IndexedDB cache entries manually
      const cachePatterns = ['post', 'getPaginatedPosts', 'getPostById', 'getPostBySlug'];
      for (const pattern of cachePatterns) {
        const cacheKey = buildCacheKeyFromSWRKey([pattern]);
        await saveToIndexedDb(cacheKey, null);
      }

      debugLog(
        'CityArtWalks.Actions.Post.Hooks.useUpdatePost',
        'Successfully updated post and invalidated caches',
        {
          postId: id,
          title: result?.title,
        }
      );

      return result;
    } catch (error) {
      debugError('CityArtWalks.Actions.Post.Hooks.useUpdatePost', 'Failed to update post', {
        error: error.message,
        id,
        postData: {
          title: postData?.title || 'Unknown',
        },
        token: token ? '[REDACTED]' : 'none',
      });
      throw error;
    }
  };
}

/**
 * Hook for deleting a post with automatic cache invalidation
 *
 * @memberof CityArtWalks.Actions.Post.Hooks
 * @function useDeletePost
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to delete a post
 * @returns {Promise<Object>} returns.result - Deletion response
 * @throws {Error} When API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useDeletePost(token = '') {
  const { mutate } = useSWRConfig();

  return async (id) => {
    try {
      const result = await requests.deletePost(id, token);

      // Invalidate SWR cache - comprehensive invalidation
      mutate(
        (key) =>
          Array.isArray(key) &&
          (key.includes('post') ||
            key.includes('getPaginatedPosts') ||
            (key.includes('getPostById') && key.includes(id)) ||
            key.includes('getPostBySlug'))
      );

      // Clear related IndexedDB cache entries manually
      const cachePatterns = ['post', 'getPaginatedPosts', 'getPostById', 'getPostBySlug'];
      for (const pattern of cachePatterns) {
        const cacheKey = buildCacheKeyFromSWRKey([pattern]);
        await saveToIndexedDb(cacheKey, null);
      }

      debugLog(
        'CityArtWalks.Actions.Post.Hooks.useDeletePost',
        'Successfully deleted post and invalidated caches',
        {
          postId: id,
        }
      );

      return result;
    } catch (error) {
      debugError('CityArtWalks.Actions.Post.Hooks.useDeletePost', 'Failed to delete post', {
        error: error.message,
        id,
        token: token ? '[REDACTED]' : 'none',
      });
      throw error;
    }
  };
}

/**
 * Combined hook that provides all post mutation functions
 *
 * @memberof CityArtWalks.Actions.Post.Hooks
 * @function usePostMutations
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Object} Object containing all post mutation functions
 * @returns {Function} returns.createPost - Create post function
 * @returns {Function} returns.updatePost - Update post function
 * @returns {Function} returns.deletePost - Delete post function
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function usePostMutations(token = '') {
  const createPost = useCreatePost(token);
  const updatePost = useUpdatePost(token);
  const deletePost = useDeletePost(token);

  return useMemo(
    () => ({
      createPost,
      updatePost,
      deletePost,
    }),
    [createPost, updatePost, deletePost]
  );
}

/**
 * SWR hook for fetching latest posts related to a title/slug
 * // TODO: Review - Custom hook - Verify necessity and standards compliance
 *
 * @memberof CityArtWalks.Actions.Post.Hooks
 * @function useGetLatestPosts
 * @param {string} title - Title/slug to find related posts
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @returns {Object} Latest posts data with loading and error states
 * @returns {Array} returns.latestPosts - Array of latest post objects
 * @returns {boolean} returns.latestPostsLoading - Loading state
 * @returns {Error} returns.latestPostsError - Error state
 * @returns {boolean} returns.latestPostsValidating - Revalidation state
 * @returns {boolean} returns.latestPostsEmpty - Empty state
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useGetLatestPosts(title, token = '', revalidate = 600) {
  const { swrKey } = useMemo(() => {
    if (!title) return { swrKey: null };
    const key = ['getLatestPosts', title, revalidate];
    return { swrKey: key };
  }, [title, revalidate]);

  const { data, isLoading, error, isValidating } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getLatestPosts(title, token, revalidate);
        return response;
      } catch (err) {
        debugError(
          'CityArtWalks.Actions.Post.Hooks.useGetLatestPosts',
          'Failed to fetch latest posts',
          {
            error: err.message,
            title: title ? '[PROVIDED]' : 'missing',
            token: token ? '[REDACTED]' : 'none',
          }
        );
        throw err;
      }
    },
    swrOptions
  );

  return useMemo(
    () => ({
      latestPosts: data?.latestPosts || [],
      latestPostsLoading: isLoading,
      latestPostsError: error,
      latestPostsValidating: isValidating,
      latestPostsEmpty: !isLoading && (!data?.latestPosts || data.latestPosts.length === 0),
    }),
    [data, isLoading, error, isValidating]
  );
}

/**
 * SWR hook for searching posts by query
 * // TODO: Review - Custom hook - Verify necessity and standards compliance
 *
 * @memberof CityArtWalks.Actions.Post.Hooks
 * @function useSearchPosts
 * @param {string} query - Search query string
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @returns {Object} Search results data with loading and error states
 * @returns {Array} returns.searchResults - Array of search result objects
 * @returns {boolean} returns.searchLoading - Loading state
 * @returns {Error} returns.searchError - Error state
 * @returns {boolean} returns.searchValidating - Revalidation state
 * @returns {boolean} returns.searchEmpty - Empty state
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useSearchPosts(query, token = '', revalidate = 600) {
  const { swrKey } = useMemo(() => {
    if (!query) return { swrKey: null };
    const key = ['searchPosts', query, revalidate];
    return { swrKey: key };
  }, [query, revalidate]);

  const { data, isLoading, error, isValidating } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.searchPosts(query, token, revalidate);
        return response;
      } catch (err) {
        debugError('CityArtWalks.Actions.Post.Hooks.useSearchPosts', 'Failed to search posts', {
          error: err.message,
          query: query ? '[PROVIDED]' : 'missing',
          token: token ? '[REDACTED]' : 'none',
        });
        throw err;
      }
    },
    { ...swrOptions, keepPreviousData: true }
  );

  return useMemo(
    () => ({
      searchResults: data?.results || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !isValidating && (!data?.results || data.results.length === 0),
    }),
    [data, isLoading, error, isValidating]
  );
}
