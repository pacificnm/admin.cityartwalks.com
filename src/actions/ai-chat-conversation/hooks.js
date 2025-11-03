/**
 * React hooks for AI Chat Conversation operations using SWR
 *
 * This module provides React hooks for AI chat conversation data operations throughout
 * the City Art Walks application. Includes hooks for sending messages to AI chat,
 * fetching conversation history, and managing AI chat interactions with proper
 * caching, error handling, and state management.
 *
 * @namespace CityArtWalks.Actions.AIChatConversation.Hooks
 * @fileoverview React hooks for AI chat conversation operations using SWR with IndexedDB caching
 * @author jaimie garner
 * @version 1.0.0
 *
 * @requires {@link https://swr.vercel.app/} swr - Data fetching library with caching
 * @requires {@link https://reactjs.org/docs/hooks-intro.html} react - React hooks
 * @requires {@link https://github.com/pacificnm/cityartwalks.com/wiki/Debug} - Debug utilities
 * @requires {@link https://github.com/pacificnm/cityartwalks.com/wiki/IndexedDB} - IndexedDB utilities
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/AIChatConversation-Hooks} - AI Chat hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */

import useSWR, { useSWRConfig } from 'swr';
import { useMemo, useState, useEffect, useCallback } from 'react';

import { debugLog, debugError } from 'src/lib/debug';
import { saveToIndexedDb, loadFromIndexedDb, buildCacheKeyFromSWRKey } from 'src/lib/indexDb';

import * as requests from './requests.js';

// ----------------------------------------------------------------------

/**
 * Standard SWR options for AI chat conversation hooks
 * @memberof CityArtWalks.Actions.AIChatConversation.Hooks
 * @constant {Object}
 */
const swrOptions = {
  revalidateIfStale: false,
  keepPreviousData: true,
};

// ----------------------------------------------------------------------

/**
 * Hook for sending messages to AI chat and managing conversation state
 *
 * @memberof CityArtWalks.Actions.AIChatConversation.Hooks
 * @function useAIChat
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Object} AI chat interface with state and functions
 * @returns {Array} returns.conversation - Current conversation history
 * @returns {string} returns.sessionId - Current session ID
 * @returns {boolean} returns.isLoading - Loading state for current request
 * @returns {boolean} returns.isSending - Sending state for message
 * @returns {Error} returns.error - Error state
 * @returns {Function} returns.sendMessage - Function to send message to AI
 * @returns {Function} returns.clearConversation - Function to clear conversation
 * @returns {Function} returns.setConversation - Function to set conversation history
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/AIChatConversation-Hooks} - AI Chat hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/AI-Chat-API} - AI Chat API documentation
 */
export function useAIChat(token = '') {
  const [conversation, setConversation] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(
    async (message) => {
      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        setError(new Error('Message is required and must be a non-empty string'));
        return null;
      }

      setIsSending(true);
      setError(null);

      try {
        debugLog(
          'CityArtWalks.Actions.AIChatConversation.Hooks.useAIChat',
          'Sending message to AI',
          {
            messageLength: message.length,
            conversationLength: conversation.length,
            hasSessionId: !!sessionId,
            hasToken: !!token,
          }
        );

        const response = await requests.sendAIChatMessage(message, conversation, sessionId, token);

        // Update conversation with new message and response
        const newConversation = [
          ...conversation,
          { role: 'user', content: message },
          { role: 'assistant', content: response.data.response },
        ];

        setConversation(newConversation);
        setSessionId(response.data.sessionId);

        debugLog(
          'CityArtWalks.Actions.AIChatConversation.Hooks.useAIChat',
          'Message sent successfully',
          {
            sessionId: response.data.sessionId,
            responseTime: response.data.responseTime,
            conversationLength: newConversation.length,
          }
        );

        return response.data;
      } catch (err) {
        debugError(
          'CityArtWalks.Actions.AIChatConversation.Hooks.useAIChat',
          'Failed to send AI chat message',
          {
            error: err.message,
            messageLength: message.length,
            conversationLength: conversation.length,
            hasToken: !!token,
          }
        );
        setError(err);
        return null;
      } finally {
        setIsSending(false);
      }
    },
    [conversation, sessionId, token]
  );

  const clearConversation = useCallback(() => {
    setConversation([]);
    setSessionId(null);
    setError(null);
    debugLog('CityArtWalks.Actions.AIChatConversation.Hooks.useAIChat', 'Conversation cleared');
  }, []);

  return useMemo(
    () => ({
      conversation,
      sessionId,
      isLoading: isSending,
      isSending,
      error,
      sendMessage,
      clearConversation,
      setConversation,
    }),
    [conversation, sessionId, isSending, error, sendMessage, clearConversation]
  );
}

/**
 * SWR hook for paginated AI chat conversations with IndexedDB caching support
 *
 * @memberof CityArtWalks.Actions.AIChatConversation.Hooks
 * @function useGetPaginatedAIChatConversations
 * @param {Object} [filters={}] - Filter parameters object
 * @param {string} [filters.search=''] - Search term for messages
 * @param {string} [filters.userId=''] - User ID filter
 * @param {string} [filters.sessionId=''] - Session ID filter
 * @param {string} [filters.model=''] - AI model filter
 * @param {string} [filters.startDate=''] - Start date filter
 * @param {string} [filters.endDate=''] - End date filter
 * @param {string} [filters.sortBy='createdAt'] - Sort field
 * @param {string} [filters.sortOrder='desc'] - Sort order
 * @param {number} [page=1] - Page number for pagination
 * @param {number} [rowsPerPage=10] - Number of items per page
 * @param {string} [token=''] - Auth token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @param {*} [refreshKey] - Key to trigger manual refresh
 * @returns {Object} Paginated AI chat conversations result with IndexedDB caching
 * @returns {Array} returns.aiChatConversations - Array of AI chat conversation objects
 * @returns {Object} returns.paginationMeta - Pagination metadata
 * @returns {boolean} returns.aiChatConversationsLoading - Loading state
 * @returns {Error} returns.aiChatConversationsError - Error state
 * @returns {boolean} returns.aiChatConversationsEmpty - Empty state
 * @returns {Function} returns.mutate - SWR mutate function
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/AIChatConversation-Hooks} - AI Chat hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useGetPaginatedAIChatConversations(
  filters = {},
  page = 1,
  rowsPerPage = 10,
  token = '',
  revalidate = 600,
  refreshKey
) {
  const {
    search = '',
    userId = '',
    sessionId = '',
    model = '',
    startDate = '',
    endDate = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = filters;
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    const key = [
      'getPaginatedAIChatConversations',
      search,
      userId,
      sessionId,
      model,
      startDate,
      endDate,
      sortBy,
      sortOrder,
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
    userId,
    sessionId,
    model,
    startDate,
    endDate,
    sortBy,
    sortOrder,
    page,
    rowsPerPage,
    revalidate,
  ]);

  const { data, isLoading, error, mutate } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getPaginatedAIChatConversations(
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
          'CityArtWalks.Actions.AIChatConversation.Hooks.useGetPaginatedAIChatConversations',
          'Failed to fetch paginated AI chat conversations',
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
          'CityArtWalks.Actions.AIChatConversation.Hooks.useGetPaginatedAIChatConversations',
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
      aiChatConversations: data?.data?.aiChatConversations || [],
      paginationMeta: data?.data?.meta || {
        total: 0,
        page: 1,
        rowsPerPage: 10,
        totalPages: 0,
      },
      aiChatConversationsLoading: isLoading,
      aiChatConversationsError: error,
      aiChatConversationsEmpty:
        !isLoading &&
        (!data?.data?.aiChatConversations || data.data.aiChatConversations.length === 0),
      mutate,
    }),
    [data, isLoading, error, mutate]
  );
}

/**
 * SWR hook for fetching a single AI chat conversation by ID with IndexedDB caching
 *
 * @memberof CityArtWalks.Actions.AIChatConversation.Hooks
 * @function useGetAIChatConversationById
 * @param {string|number} id - The unique identifier of the AI chat conversation
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @returns {Object} AI chat conversation data with loading and error states
 * @returns {Object} returns.aiChatConversation - AI chat conversation object or null
 * @returns {boolean} returns.aiChatConversationLoading - Loading state
 * @returns {Error} returns.aiChatConversationError - Error state
 * @returns {boolean} returns.aiChatConversationValidating - Revalidation state
 * @returns {boolean} returns.aiChatConversationEmpty - Empty state
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/AIChatConversation-Hooks} - AI Chat hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useGetAIChatConversationById(id, token = '', revalidate = 600) {
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    if (!id) return { swrKey: null, cacheKey: null };
    const key = ['getAIChatConversationById', id, revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [id, revalidate]);

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getAIChatConversationById(id, token, revalidate);
        if (response && cacheKey) {
          await saveToIndexedDb(cacheKey, response);
          debugLog(`[IndexedDB] Saved data for ${cacheKey}`);
        }
        return response;
      } catch (err) {
        debugError(
          'CityArtWalks.Actions.AIChatConversation.Hooks.useGetAIChatConversationById',
          'Failed to fetch AI chat conversation by ID',
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
        debugError(
          'CityArtWalks.Actions.AIChatConversation.Hooks.useGetAIChatConversationById',
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
      aiChatConversation: data?.data || null,
      aiChatConversationLoading: isLoading,
      aiChatConversationError: error,
      aiChatConversationValidating: isValidating,
      aiChatConversationEmpty: !isLoading && !data?.data,
    }),
    [data, isLoading, error, isValidating]
  );
}

/**
 * Hook for creating a new AI chat conversation with automatic cache invalidation
 *
 * @memberof CityArtWalks.Actions.AIChatConversation.Hooks
 * @function useCreateAIChatConversation
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to create an AI chat conversation
 * @returns {Promise<Object>} returns.result - Created AI chat conversation response
 * @throws {Error} When AI chat conversation data validation fails or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/AIChatConversation-Hooks} - AI Chat hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useCreateAIChatConversation(token = '') {
  const { mutate } = useSWRConfig();

  return async (aiChatConversationData) => {
    try {
      const result = await requests.createAIChatConversation(aiChatConversationData, token);

      // Invalidate SWR cache
      mutate(
        (key) =>
          Array.isArray(key) &&
          (key.includes('aiChatConversation') || key.includes('getPaginatedAIChatConversations'))
      );

      // Clear related IndexedDB cache entries manually after mutations
      const cachePatterns = ['aiChatConversation', 'getPaginatedAIChatConversations'];
      for (const pattern of cachePatterns) {
        const cacheKey = buildCacheKeyFromSWRKey([pattern]);
        await saveToIndexedDb(cacheKey, null);
      }

      debugLog(
        'CityArtWalks.Actions.AIChatConversation.Hooks.useCreateAIChatConversation',
        'AI chat conversation created successfully',
        {
          id: result.aiChatConversationId,
        }
      );

      return result;
    } catch (error) {
      debugError(
        'CityArtWalks.Actions.AIChatConversation.Hooks.useCreateAIChatConversation',
        'Failed to create AI chat conversation',
        {
          error: error.message,
          hasData: !!aiChatConversationData,
          hasToken: !!token,
        }
      );
      throw error;
    }
  };
}

/**
 * Hook for updating an existing AI chat conversation with automatic cache invalidation
 *
 * @memberof CityArtWalks.Actions.AIChatConversation.Hooks
 * @function useUpdateAIChatConversation
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to update an AI chat conversation
 * @returns {Promise<Object>} returns.result - Updated AI chat conversation response
 * @throws {Error} When AI chat conversation data validation fails or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/AIChatConversation-Hooks} - AI Chat hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useUpdateAIChatConversation(token = '') {
  const { mutate } = useSWRConfig();

  return async (id, aiChatConversationData) => {
    try {
      const result = await requests.updateAIChatConversation(id, aiChatConversationData, token);

      // Invalidate SWR cache
      mutate(
        (key) =>
          Array.isArray(key) &&
          (key.includes('aiChatConversation') || key.includes('getPaginatedAIChatConversations'))
      );

      // Clear related IndexedDB cache entries manually after mutations
      const cachePatterns = ['aiChatConversation', 'getPaginatedAIChatConversations'];
      for (const pattern of cachePatterns) {
        const cacheKey = buildCacheKeyFromSWRKey([pattern]);
        await saveToIndexedDb(cacheKey, null);
      }

      debugLog(
        'CityArtWalks.Actions.AIChatConversation.Hooks.useUpdateAIChatConversation',
        'AI chat conversation updated successfully',
        {
          id,
        }
      );

      return result;
    } catch (error) {
      debugError(
        'CityArtWalks.Actions.AIChatConversation.Hooks.useUpdateAIChatConversation',
        'Failed to update AI chat conversation',
        {
          error: error.message,
          id,
          hasData: !!aiChatConversationData,
          hasToken: !!token,
        }
      );
      throw error;
    }
  };
}

/**
 * Hook for deleting an AI chat conversation with automatic cache invalidation
 *
 * @memberof CityArtWalks.Actions.AIChatConversation.Hooks
 * @function useDeleteAIChatConversation
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to delete an AI chat conversation
 * @returns {Promise<Object>} returns.result - Deletion response
 * @throws {Error} When API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/AIChatConversation-Hooks} - AI Chat hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useDeleteAIChatConversation(token = '') {
  const { mutate } = useSWRConfig();

  return async (id) => {
    try {
      const result = await requests.deleteAIChatConversation(id, token);

      // Invalidate SWR cache
      mutate(
        (key) =>
          Array.isArray(key) &&
          (key.includes('aiChatConversation') || key.includes('getPaginatedAIChatConversations'))
      );

      // Clear related IndexedDB cache entries manually after mutations
      const cachePatterns = ['aiChatConversation', 'getPaginatedAIChatConversations'];
      for (const pattern of cachePatterns) {
        const cacheKey = buildCacheKeyFromSWRKey([pattern]);
        await saveToIndexedDb(cacheKey, null);
      }

      debugLog(
        'CityArtWalks.Actions.AIChatConversation.Hooks.useDeleteAIChatConversation',
        'AI chat conversation deleted successfully',
        {
          id,
        }
      );

      return result;
    } catch (error) {
      debugError(
        'CityArtWalks.Actions.AIChatConversation.Hooks.useDeleteAIChatConversation',
        'Failed to delete AI chat conversation',
        {
          error: error.message,
          id,
          hasToken: !!token,
        }
      );
      throw error;
    }
  };
}

/**
 * Combined hook that provides all AI chat conversation mutation functions
 *
 * @memberof CityArtWalks.Actions.AIChatConversation.Hooks
 * @function useAIChatConversationMutations
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Object} Object containing all mutation functions
 * @returns {Function} returns.createAIChatConversation - Function to create AI chat conversation
 * @returns {Function} returns.updateAIChatConversation - Function to update AI chat conversation
 * @returns {Function} returns.deleteAIChatConversation - Function to delete AI chat conversation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/AIChatConversation-Hooks} - AI Chat hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useAIChatConversationMutations(token = '') {
  const createAIChatConversation = useCreateAIChatConversation(token);
  const updateAIChatConversation = useUpdateAIChatConversation(token);
  const deleteAIChatConversation = useDeleteAIChatConversation(token);

  return useMemo(
    () => ({
      createAIChatConversation,
      updateAIChatConversation,
      deleteAIChatConversation,
    }),
    [createAIChatConversation, updateAIChatConversation, deleteAIChatConversation]
  );
}
