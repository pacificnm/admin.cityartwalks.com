/**
 * @file requests.js
 * @description PostApiClient class for Post CRUD operations.
 * @author Jaimie Garner
 * @version 3.0.0
 * @namespace CityArtWalks.Actions.Post.Requests
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */

import { ApiClient } from '@/lib/api-client';

import { endpoints } from 'src/endpoints';


/**
 * PostApiClient class for handling Post API operations.
 * Extends ApiClient to provide post-specific HTTP methods.
 * Handles automatic token management through session.
 * 
 * @class PostApiClient
 * @extends ApiClient
 * @memberof CityArtWalks.Actions.Post.Requests
 */
export class PostApiClient extends ApiClient {
  constructor() {
    super();
  }

  /**
   * Fetch paginated list of posts with optional filtering.
   * @param {Object} params - Filter parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Results per page
   * @param {string} [params.search=''] - Search term
   * @param {string} [params.status=''] - Status filter
   * @param {string} [params.category=''] - Category filter
   * @param {string} [params.sortBy='createdAt'] - Sort field
   * @param {string} [params.sortOrder='desc'] - Sort order
   * @param {boolean} [params.featured=''] - Featured filter
   * @param {string} [params.createdBy=''] - Creator filter
   * @param {boolean} [params.includeUnpublished=false] - Include unpublished
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Paginated posts data
   */
  async getPaginatedPosts({ page = 1, limit = 10, search = '', status = '', category = '', sortBy = 'createdAt', sortOrder = 'desc', featured = '', createdBy = '', includeUnpublished = false } = {}, revalidate) {
    const params = new URLSearchParams({
      page,
      limit,
      ...(search && { search: encodeURIComponent(search) }),
      ...(status && { status }),
      ...(category && { category }),
      ...(sortBy && { sortBy }),
      ...(sortOrder && { sortOrder }),
      ...(featured !== '' && { featured }),
      ...(createdBy && { createdBy }),
      ...(includeUnpublished && { includeUnpublished }),
    });

    const path = `${endpoints.post.list.path}?${params}`;
    return this.get(path, { revalidate });
  }

  /**
   * Fetch a single post by ID.
   * @param {string|number} id - The post ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} The post object
   */
  async getPost(id, revalidate) {
    const path = endpoints.post.details.path(id);
    return this.get(path, { revalidate });
  }

  /**
   * Fetch a single post by slug.
   * @param {string} slug - The post slug
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} The post object
   */
  async getPostBySlug(slug, revalidate) {
    const path = endpoints.post.bySlug.command(slug);
    return this.get(path, { revalidate });
  }

  /**
   * Create a new post.
   * @param {Object|FormData} data - The post data
   * @returns {Promise<Object>} The created post
   */
  async createPost(data) {
    const path = endpoints.post.create.path;

    if (data instanceof FormData) {
      return this.post(path, { body: data });
    }

    return this.post(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Update an existing post.
   * @param {string|number} id - The post ID
   * @param {Object|FormData} data - The updated post data
   * @returns {Promise<Object>} The updated post
   */
  async updatePost(id, data) {
    const path = endpoints.post.update.command(id);

    if (data instanceof FormData) {
      return this.put(path, { body: data });
    }

    return this.put(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Delete a post by ID.
   * @param {string|number} id - The post ID
   * @returns {Promise<Object>} The response data
   */
  async deletePost(id) {
    const path = endpoints.post.delete.command(id);
    return this.delete(path);
  }

  /**
   * Fetch latest posts with optional title filter.
   * @param {Object} params - Filter parameters
   * @param {string} [params.title=''] - Title filter
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Latest posts data
   */
  async getLatestPosts({ title = '' } = {}, revalidate) {
    const params = new URLSearchParams({
      ...(title && { title: encodeURIComponent(title) }),
    });

    const path = params.toString() 
      ? `${endpoints.post.latest.command()}?${params}`
      : endpoints.post.latest.command();
    return this.get(path, { revalidate });
  }

  /**
   * Search posts by query with optional filters.
   * @param {Object} params - Search parameters
   * @param {string} params.query - Search query (required)
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Results per page
   * @param {string} [params.category=''] - Category filter
   * @param {boolean} [params.featured] - Featured filter
   * @param {boolean} [params.includeUnpublished=false] - Include unpublished
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Search results
   */
  async searchPosts({ query, page = 1, limit = 10, category = '', featured, includeUnpublished = false } = {}, revalidate) {
    const params = new URLSearchParams({
      query: encodeURIComponent(query),
      page,
      limit,
      ...(category && { category }),
      ...(featured !== undefined && { featured }),
      ...(includeUnpublished && { includeUnpublished }),
    });

    const path = `${endpoints.post.search.command()}?${params}`;
    return this.get(path, { revalidate });
  }

  /**
   * Fetch posts by category with pagination.
   * @param {string} category - Post category
   * @param {Object} params - Filter parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Results per page
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Posts by category
   */
  async getPostsByCategory(category, { page = 1, limit = 10 } = {}, revalidate) {
    const params = new URLSearchParams({
      page,
      limit,
    });

    const path = `${endpoints.post.byCategory.command(encodeURIComponent(category))}?${params}`;
    return this.get(path, { revalidate });
  }

  /**
   * Generate AI-powered complete blog post package.
   * Generates content, excerpt, SEO title, and meta description.
   * @param {Object} data - Content assistance parameters
   * @returns {Promise<Object>} Generated content package
   */
  async generateContentAssistance(data) {
    const path = endpoints.post.contentAssistance.path;

    return this.post(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
