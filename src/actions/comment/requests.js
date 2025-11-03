/**
 * @file requests.js
 * @description CommentApiClient class for Comment CRUD operations.
 * @author Jaimie Garner
 * @version 3.0.0
 * @namespace CityArtWalks.Actions.Comment.Requests
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Requests} - Requests module documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Comment} - Comment entity documentation
 */

import { ApiClient } from '@/lib/api-client';

import { endpoints } from 'src/endpoints';

/**
 * CommentApiClient class for handling Comment API operations.
 * Extends ApiClient to provide comment-specific HTTP methods.
 * Handles automatic token management through session.
 * 
 * @class CommentApiClient
 * @extends ApiClient
 * @memberof CityArtWalks.Actions.Comment.Requests
 */
export class CommentApiClient extends ApiClient {
  constructor() {
    super();
  }

  /**
   * Fetch paginated comments with filters.
   * @param {Object} params - Filter parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Results per page limit
   * @param {string} [params.search=''] - Search term
   * @param {string} [params.status] - Status filter
   * @param {number} [params.postId] - Post ID filter
   * @param {number} [params.parentId] - Parent comment ID filter
   * @param {number} [params.createdBy] - Creator user ID filter
   * @param {string} [params.sortBy] - Sort field
   * @param {string} [params.sortOrder] - Sort order
   * @param {boolean} [params.includeDeleted] - Include deleted comments
   * @param {boolean} [params.includeModerated] - Include moderated comments
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Paginated comments data
   */
  async getPaginatedComments({ page = 1, limit = 10, search = '', status, postId, parentId, createdBy, sortBy, sortOrder, includeDeleted, includeModerated } = {}, revalidate) {
    const params = new URLSearchParams({
      page,
      limit,
      ...(search && { search: encodeURIComponent(search) }),
      ...(status && { status }),
      ...(postId && { postId }),
      ...(parentId && { parentId }),
      ...(createdBy && { createdBy }),
      ...(sortBy && { sortBy }),
      ...(sortOrder && { sortOrder }),
      ...(includeDeleted !== undefined && { includeDeleted }),
      ...(includeModerated !== undefined && { includeModerated }),
    });

    const path = `${endpoints.comment.list.path}?${params}`;
    return this.get(path, { revalidate });
  }

  /**
   * Fetch a single comment by ID.
   * @param {string|number} id - The comment ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} The comment object
   */
  async getCommentById(id, revalidate) {
    const path = endpoints.comment.details.command(id);
    return this.get(path, { revalidate });
  }

  /**
   * Fetch all comments for a specific post.
   * @param {string|number} postId - The post ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Comments for the post
   */
  async getCommentsByPostId(postId, revalidate) {
    const path = endpoints.comment.byPost.command(postId);
    return this.get(path, { revalidate });
  }

  /**
   * Fetch replies for a specific comment.
   * @param {string|number} commentId - The comment ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Comment replies
   */
  async getCommentReplies(commentId, revalidate) {
    const path = endpoints.comment.replies.command(commentId);
    return this.get(path, { revalidate });
  }

  /**
   * Create a new comment.
   * @param {Object|FormData} data - The comment data
   * @returns {Promise<Object>} The created comment
   */
  async createComment(data) {
    const path = endpoints.comment.create.path;

    if (data instanceof FormData) {
      return this.post(path, { body: data });
    }

    return this.post(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Update an existing comment.
   * @param {string|number} id - The comment ID
   * @param {Object|FormData} data - The updated comment data
   * @returns {Promise<Object>} The updated comment
   */
  async updateComment(id, data) {
    const path = endpoints.comment.update.command(id);

    if (data instanceof FormData) {
      return this.put(path, { body: data });
    }

    return this.put(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Delete a comment.
   * @param {string|number} id - The comment ID
   * @returns {Promise<Object>} The response data
   */
  async deleteComment(id) {
    const path = endpoints.comment.delete.command(id);
    return this.delete(path);
  }
}
