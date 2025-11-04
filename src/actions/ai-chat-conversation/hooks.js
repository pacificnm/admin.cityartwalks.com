/**
 * @file hooks.js
 * @description SWR-based data fetching hooks for AIChatConversation.
 * @author Jaimie Garner
 * @version 2.1.0
 * @namespace CityArtWalks.Actions.AIChatConversation.Hooks
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/AIChatConversation} - AIChatConversation entity documentation
 */

import { useMemo, useState, useEffect, useCallback } from "react";

import { useBaseHook } from "src/lib/base-hook";
import {
  aiChatConversationQuerySchema,
  createAIChatConversationSchema,
  updateAIChatConversationSchema,
} from "src/validators/ai-chat-conversation";

import { AIChatConversationApiClient } from "./requests";

// Create a single instance to use across all hooks
const aiChatConversationApiClient = new AIChatConversationApiClient();

/**
 * Hook for sending messages to AI chat and managing conversation state
 *
 * @memberof CityArtWalks.Actions.AIChatConversation.Hooks
 * @function useAIChat
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
export function useAIChat() {
  const baseHook = useBaseHook("CityArtWalks.Actions.AIChatConversation.Hooks");
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
        const response = await aiChatConversationApiClient.sendAIChatMessage(
          message,
          conversation,
          sessionId
        );

        // Update conversation with new message and response
        const newConversation = [
          ...conversation,
          { role: 'user', content: message },
          { role: 'assistant', content: response.results.response },
        ];

        setConversation(newConversation);
        setSessionId(response.results.sessionId);

        return response.results;
      } catch (err) {
        baseHook.logger.error(
          "useAIChat",
          "Failed to send AI chat message",
          {
            error: err.message,
            messageLength: message.length,
            conversationLength: conversation.length,
          }
        );
        setError(err);
        return null;
      } finally {
        setIsSending(false);
      }
    },
    [conversation, sessionId, baseHook.logger]
  );

  const clearConversation = useCallback(() => {
    setConversation([]);
    setSessionId(null);
    setError(null);
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
 * @memberof CityArtWalks.Actions.AIChatConversation.Hooks
 * @function useGetPaginatedAIChatConversations
 * @description Hook to get paginated AI chat conversations with full filtering, caching via IndexedDB.
 *
 * @param {Object} params - Filter parameters
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=10] - Results per page limit
 * @param {string} [params.search=''] - Search term
 * @param {string} [params.userId=''] - User ID filter
 * @param {string} [params.sessionId=''] - Session ID filter
 * @param {string} [params.model=''] - AI model filter
 * @param {string} [params.startDate=''] - Start date filter
 * @param {string} [params.endDate=''] - End date filter
 * @param {string} [params.sortBy='createdAt'] - Sort field
 * @param {string} [params.sortOrder='desc'] - Sort order
 * @param {string|null} [params.refreshKey=null] - Key to trigger refresh
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and complete API results
 * @returns {Object} result.results - Complete API results object (data, pagination, performance, query metadata)
 * @returns {boolean} result.aiChatConversationsLoading - Loading state
 * @returns {Error} result.aiChatConversationsError - Error state
 * @returns {boolean} result.aiChatConversationsValidating - Validation state
 * @returns {boolean} result.aiChatConversationsEmpty - Empty state (no data)
 * @returns {Function} result.mutate - SWR mutate function
 * @throws {Error} When parameter validation fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetPaginatedAIChatConversations(params = {}, revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.AIChatConversation.Hooks");

  const {
    page = 1,
    limit = 10,
    search = "",
    userId = "",
    sessionId = "",
    model = "",
    startDate = "",
    endDate = "",
    sortBy = "createdAt",
    sortOrder = "desc",
    refreshKey = null,
  } = params;

  // Validate parameters using Zod schema
  const validationResult = useMemo(
    () =>
      baseHook.validators.validateWithSchema(
        { page, limit, search, userId, sessionId, model, startDate, endDate, sortBy, sortOrder },
        aiChatConversationQuerySchema,
        "useGetPaginatedAIChatConversations"
      ),
    [baseHook.validators, page, limit, search, userId, sessionId, model, startDate, endDate, sortBy, sortOrder]
  );

  const { swrKey } = useMemo(() => {
    if (!validationResult.success) {
      return { swrKey: null };
    }

    const key = [
      "getPaginatedAIChatConversations",
      page,
      limit,
      search,
      userId,
      sessionId,
      model,
      startDate,
      endDate,
      sortBy,
      sortOrder,
      revalidate,
    ];
    return baseHook.utils.generateKeys(key);
  }, [
    baseHook.utils,
    validationResult.success,
    page,
    limit,
    search,
    userId,
    sessionId,
    model,
    startDate,
    endDate,
    sortBy,
    sortOrder,
    revalidate,
  ]);

  const { data, isLoading, error, isValidating, mutate } =
    baseHook.useSWRWithCache(
      swrKey,
      async () => {
        const response = await aiChatConversationApiClient.getPaginatedAIChatConversations(
          { page, limit, search, userId, sessionId, model, startDate, endDate, sortBy, sortOrder },
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
      aiChatConversationsLoading: isLoading,
      aiChatConversationsError: error,
      aiChatConversationsValidating: isValidating,
      aiChatConversationsEmpty: !isLoading && (!results.data || results.data.length === 0),
      mutate,
    };
  }, [data, isLoading, error, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.AIChatConversation.Hooks
 * @function useGetAIChatConversation
 * @description Hook to get AI chat conversation by ID with IndexedDB caching.
 *
 * @param {string|number} aiChatConversationId - The AI chat conversation ID
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and conversation data
 * @throws {Error} When aiChatConversationId is invalid or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetAIChatConversation(aiChatConversationId, revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.AIChatConversation.Hooks");

  // Validate aiChatConversationId parameter
  useEffect(() => {
    if (
      aiChatConversationId &&
      !baseHook.validators.validateWithSchema(
        ["string", "number"],
        aiChatConversationId,
        "aiChatConversationId",
        "useGetAIChatConversation"
      )
    ) {
      // Validation handled by base hook
    }
  }, [baseHook.validators, aiChatConversationId]);

  const { swrKey } = useMemo(() => {
    if (!aiChatConversationId) return { swrKey: null };
    const key = ["getAIChatConversation", aiChatConversationId, revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, aiChatConversationId, revalidate]);

  const { data, isLoading, error, isValidating, mutate } =
    baseHook.useSWRWithCache(
      swrKey,
      async () => {
        const response = await aiChatConversationApiClient.getAIChatConversation(aiChatConversationId, revalidate);
        return response;
      },
      revalidate
    );

  return useMemo(() => {
    const aiChatConversation = data?.results?.data || null;
    return {
      aiChatConversation,
      aiChatConversationLoading: isLoading,
      aiChatConversationError: error,
      aiChatConversationValidating: isValidating,
      aiChatConversationEmpty: !isLoading && !aiChatConversation,
      mutate,
    };
  }, [data, isLoading, error, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.AIChatConversation.Hooks
 * @function useCreateAIChatConversation
 * @description Hook to create a new AI chat conversation with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (aiChatConversation) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When AI chat conversation data validation fails or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const createAIChatConversation = useCreateAIChatConversation();
 * await createAIChatConversation.mutate(aiChatConversationData);
 */
export function useCreateAIChatConversation() {
  const baseHook = useBaseHook("CityArtWalks.Actions.AIChatConversation.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (aiChatConversation) => {
      // Validate AI chat conversation data if not FormData
      if (!(aiChatConversation instanceof FormData)) {
        baseHook.validators.validateWithSchema(
          aiChatConversation,
          createAIChatConversationSchema,
          "useCreateAIChatConversation",
          true // throw on error
        );
      }

      const result = await aiChatConversationApiClient.createAIChatConversation(aiChatConversation);
      return result;
    },
    ["aiChatConversation", "getPaginatedAIChatConversations"]
  );
}

/**
 * @memberof CityArtWalks.Actions.AIChatConversation.Hooks
 * @function useUpdateAIChatConversation
 * @description Hook to update an existing AI chat conversation with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (id, aiChatConversationData) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When AI chat conversation ID is missing, data validation fails, or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const updateAIChatConversation = useUpdateAIChatConversation();
 * await updateAIChatConversation.mutate(aiChatConversationId, updatedData);
 */
export function useUpdateAIChatConversation() {
  const baseHook = useBaseHook("CityArtWalks.Actions.AIChatConversation.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (id, aiChatConversation) => {
      // Validate parameters
      if (!id) {
        baseHook.logger.error("useUpdateAIChatConversation", "AIChatConversation ID is required");
        throw new Error("AIChatConversation ID is required");
      }

      // Validate AI chat conversation data if not FormData
      if (!(aiChatConversation instanceof FormData)) {
        baseHook.validators.validateWithSchema(
          aiChatConversation,
          updateAIChatConversationSchema,
          "useUpdateAIChatConversation",
          true // throw on error
        );
      }

      const result = await aiChatConversationApiClient.updateAIChatConversation(id, aiChatConversation);
      return result;
    },
    ["aiChatConversation", "getPaginatedAIChatConversations"]
  );
}

/**
 * @memberof CityArtWalks.Actions.AIChatConversation.Hooks
 * @function useDeleteAIChatConversation
 * @description Hook to delete an AI chat conversation with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (id) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When AI chat conversation ID is missing or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const deleteAIChatConversation = useDeleteAIChatConversation();
 * await deleteAIChatConversation.mutate(aiChatConversationId);
 */
export function useDeleteAIChatConversation() {
  const baseHook = useBaseHook("CityArtWalks.Actions.AIChatConversation.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (id) => {
      // Validate parameters
      if (!id) {
        baseHook.logger.error("useDeleteAIChatConversation", "AIChatConversation ID is required");
        throw new Error("AIChatConversation ID is required");
      }

      const result = await aiChatConversationApiClient.deleteAIChatConversation(id);
      return result;
    },
    ["aiChatConversation", "getPaginatedAIChatConversations"]
  );
}

/**
 * @memberof CityArtWalks.Actions.AIChatConversation.Hooks
 * @function useAIChatConversationMutations
 * @description Hook that returns all AI chat conversation mutation functions for convenient access.
 *
 * @returns {Object} Collection of all AI chat conversation mutation functions
 * @returns {Function} result.createAIChatConversation - Create AI chat conversation mutation function
 * @returns {Function} result.updateAIChatConversation - Update AI chat conversation mutation function
 * @returns {Function} result.deleteAIChatConversation - Delete AI chat conversation mutation function
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const { createAIChatConversation, updateAIChatConversation, deleteAIChatConversation } = useAIChatConversationMutations();
 * await createAIChatConversation.mutate(aiChatConversationData);
 * await updateAIChatConversation.mutate(aiChatConversationId, updatedData);
 * await deleteAIChatConversation.mutate(aiChatConversationId);
 */
export function useAIChatConversationMutations() {
  const createAIChatConversation = useCreateAIChatConversation();
  const updateAIChatConversation = useUpdateAIChatConversation();
  const deleteAIChatConversation = useDeleteAIChatConversation();

  return {
    createAIChatConversation,
    updateAIChatConversation,
    deleteAIChatConversation,
  };
}
