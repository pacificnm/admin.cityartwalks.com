/**
 * @file requests.js
 * @description AIChatConversationApiClient class for AIChatConversation CRUD operations.
 * @author Jaimie Garner
 * @version 3.0.0
 * @namespace CityArtWalks.Actions.AIChatConversation.Requests
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Requests} - Requests module documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/AIChatConversation} - AIChatConversation entity documentation
 */

import { ApiClient } from '@/lib/api-client';

import { endpoints } from 'src/endpoints';

/**
 * AIChatConversationApiClient class for handling AIChatConversation API operations.
 * Extends ApiClient to provide AI chat conversation-specific HTTP methods.
 * Handles automatic token management through session.
 * 
 * @class AIChatConversationApiClient
 * @extends ApiClient
 * @memberof CityArtWalks.Actions.AIChatConversation.Requests
 */
export class AIChatConversationApiClient extends ApiClient {
  constructor() {
    super();
  }
  /**
   * Send a message to the AI chat API and get a response.
   * @param {string} message - The user's message to send to the AI
   * @param {Array} [conversation=[]] - Previous conversation history
   * @param {string} [sessionId] - Optional session ID for conversation continuity
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} AI chat response object with response, sessionId, responseTime, tokenCount
   */
  async sendAIChatMessage(message, conversation = [], sessionId, revalidate) {
    const requestBody = {
      message: message.trim(),
      conversation: Array.isArray(conversation) ? conversation : [],
      ...(sessionId && { sessionId }),
    };

    const path = endpoints.aiChat.post.path;
    return this.post(path, {
      body: JSON.stringify(requestBody),
      headers: { 'Content-Type': 'application/json' },
      revalidate,
    });
  }

  /**
   * Fetch paginated AI chat conversations with filters.
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
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Paginated AI chat conversations data
   */
  async getPaginatedAIChatConversations({ page = 1, limit = 10, search = '', userId = '', sessionId = '', model = '', startDate = '', endDate = '', sortBy = 'createdAt', sortOrder = 'desc' } = {}, revalidate) {
    const params = new URLSearchParams({
      page,
      limit,
      ...(search && { search: encodeURIComponent(search) }),
      ...(userId && { userId }),
      ...(sessionId && { sessionId }),
      ...(model && { model }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      ...(sortBy && { sortBy }),
      ...(sortOrder && { sortOrder }),
    });

    const path = `${endpoints.aiChatConversation.get.path}?${params}`;
    return this.get(path, { revalidate });
  }

  /**
   * Fetch a single AI chat conversation by ID.
   * @param {string|number} id - The AI chat conversation ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} The AI chat conversation object
   */
  async getAIChatConversation(id, revalidate) {
    const path = endpoints.aiChatConversation.getById.path(id);
    return this.get(path, { revalidate });
  }

  /**
   * Create a new AI chat conversation.
   * @param {Object|FormData} data - The AI chat conversation data
   * @returns {Promise<Object>} The created AI chat conversation
   */
  async createAIChatConversation(data) {
    const path = endpoints.aiChatConversation.post.path;

    if (data instanceof FormData) {
      return this.post(path, { body: data });
    }

    return this.post(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Update an existing AI chat conversation.
   * @param {string|number} id - The AI chat conversation ID
   * @param {Object|FormData} data - The updated AI chat conversation data
   * @returns {Promise<Object>} The updated AI chat conversation
   */
  async updateAIChatConversation(id, data) {
    const path = endpoints.aiChatConversation.put.path(id);

    if (data instanceof FormData) {
      return this.put(path, { body: data });
    }

    return this.put(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Delete an AI chat conversation.
   * @param {string|number} id - The AI chat conversation ID
   * @returns {Promise<Object>} The response data
   */
  async deleteAIChatConversation(id) {
    const path = endpoints.aiChatConversation.delete.path(id);
    return this.delete(path);
  }
}
