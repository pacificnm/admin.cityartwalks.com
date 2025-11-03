/**
 * @file apiClient.js
 * @description Base API client class for City Art Walks with comprehensive HTTP request handling
 *
 * This module provides a base class for API clients with HTTP request handling for the City Art Walks backend.
 * It includes generic fetch wrappers with logging, automatic token retrieval from Auth0 session, and ISR 
 * (Incremental Static Regeneration) options. The client handles authentication automatically, error handling, 
 * and provides convenient helper methods for all HTTP verbs. Can be extended for specific API endpoints.
 * @namespace CityArtWalks.Lib.ApiClient
 * @version 2.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Lib} - Library utilities documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ApiClient} - API Client documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Debug} - Debug utilities documentation
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API} - Fetch API documentation
 * @see {@link https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating} - Next.js ISR documentation
 */
import { debugWarn, debugError } from './debug';

/**
 * Base API Client class for making HTTP requests with automatic Auth0 token handling.
 * This class provides a foundation for all API interactions and can be extended for specific endpoints.
 * Tokens are automatically retrieved from the user session for security and consistency.
 * 
 * Features:
 * - Comprehensive HTTP request handling with fetch API
 * - Automatic authentication via Auth0 session token retrieval
 * - FormData and JSON content-type detection
 * - Next.js ISR (Incremental Static Regeneration) integration
 * - Advanced error handling with status code categorization
 * - Debug logging for validation failures and request errors
 * - Support for absolute and relative URL paths
 * - Automatic JSON response parsing with fallback handling
 * - Extensible architecture for endpoint-specific clients
 * - Secure token management from user session only
 *
 * @class ApiClient
 * @memberof CityArtWalks.Lib.ApiClient
 * 
 * @example
 * // Basic usage (tokens handled automatically)
 * const client = new ApiClient();
 * const data = await client.get('/api/art-pieces');
 * 
 * @example
 * // Extending for specific endpoints
 * class UserApiClient extends ApiClient {
 *   async getUsers() {
 *     return this.get('/api/users');
 *   }
 *   
 *   async createUser(userData) {
 *     return this.post('/api/users', userData);
 *   }
 * }
 */
export class ApiClient {
  /**
   * The base URL for API requests with environment-specific configuration.
   * Defaults to NEXT_PUBLIC_SERVER_URL environment variable or production domain for fallback.
   * Used as the foundation for all relative API path requests throughout the application.
   *
   * @static
   * @constant {string} BASE_URL
   * @memberof CityArtWalks.Lib.ApiClient.ApiClient
   * @default 'https://api.cityartwalks.com'
   */
  static BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://api.cityartwalks.com';

  /**
   * Creates an instance of ApiClient.
   * 
   * @param {string} [baseUrl] - Override the default base URL
   */
  constructor(baseUrl = null) {
    this.baseUrl = baseUrl || ApiClient.BASE_URL;
  }

  /**
   * Set the base URL for this client instance.
   * 
   * @param {string} baseUrl - Base URL for API requests
   * @returns {ApiClient} Returns this instance for method chaining
   */
  setBaseUrl(baseUrl) {
    this.baseUrl = baseUrl;
    return this;
  }

  /**
   * Get the current base URL.
   * 
   * @returns {string} Current base URL
   */
  getBaseUrl() {
    return this.baseUrl;
  }

  /**
   * Get the current access token from the Auth0 session.
   * This method fetches the token from the /api/auth/token endpoint which
   * retrieves it securely from the user's session.
   * 
   * @private
   * @returns {Promise<string|null>} Access token or null if not available
   */
  async getAccessToken() {
    try {
      const response = await fetch('/api/auth/token');
      if (response.ok) {
        const data = await response.json();
        return data.accessToken;
      }
      debugWarn('CityArtWalks.Lib.ApiClient.ApiClient', 'Failed to get access token', {
        status: response.status,
        statusText: response.statusText,
      });
      return null;
    } catch (error) {
      debugError('CityArtWalks.Lib.ApiClient.ApiClient', 'Error getting access token', error);
      return null;
    }
  }

  /**
   * Generic request method for API calls with comprehensive logging, automatic authentication, and ISR support.
   * Provides centralized HTTP request handling with automatic error processing, token management from session,
   * and Next.js ISR integration. Supports both JSON and FormData payloads with appropriate
   * content-type handling and automatic authentication integration.
   *
   * @method request
   * @memberof CityArtWalks.Lib.ApiClient.ApiClient
   *
   * @example
   * // Basic GET request
   * const data = await client.request('/api/art-pieces');
   *
   * @example
   * // POST with JSON data
   * const result = await client.request('/api/art-pieces', {
   *   method: 'POST',
   *   body: { title: 'New Art Piece', description: 'Amazing artwork' }
   * });
   *
   * @example
   * // FormData upload
   * const formData = new FormData();
   * formData.append('file', file);
   * const uploaded = await client.request('/api/upload', {
   *   method: 'POST',
   *   body: formData
   * });
   *
   * @example
   * // With ISR revalidation
   * const data = await client.request('/api/art-pieces', {
   *   method: 'GET',
   *   next: { revalidate: 300 }
   * });
   *
   * @param {string} path - Relative API path (e.g., /api/art-piece) or absolute URL
   * @param {Object} [options={}] - Fetch configuration object
   * @param {string} [options.method='GET'] - HTTP method (GET, POST, PUT, DELETE, etc.)
   * @param {Object|FormData|string} [options.body] - Request body (auto-stringified for JSON)
   * @param {Object} [options.headers={}] - Additional headers to include
   * @param {Object} [options.next] - ISR config object: { revalidate: number }
   * @returns {Promise<any>} Parsed JSON response from the API or text for non-JSON responses
   * @throws {Error} Throws error with status, response, and data properties if request fails
   */
  async request(path, options = {}) {
    const {
      method = 'GET',
      body,
      headers = {},
      next, // ISR config: { revalidate: number }
      ...rest // other fetch options
    } = options;

    // Get the access token from the session
    const token = await this.getAccessToken();

    // Construct full headers for the request, including Authorization if token is available
    const isFormData = body instanceof FormData;
    const willAddAuth = token && typeof token === 'string' && token.trim() !== '';

    const fullHeaders = {
      // Don't set Content-Type for FormData - let browser set it with boundary
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...(willAddAuth && { Authorization: `Bearer ${token}` }),
      ...headers,
    };

    // Options object for fetch API
    const fetchOptions = {
      method,
      headers: fullHeaders,
      // Don't stringify FormData - use it directly
      ...(body
        ? { body: isFormData ? body : typeof body === 'string' ? body : JSON.stringify(body) }
        : {}),
      ...(next ? { next } : {}),
      ...rest,
    };

    try {
      // Support absolute URLs (http/https) without prefixing BASE_URL
      const isAbsolute = typeof path === 'string' && /^(https?:)?\/\//i.test(path);
      const normalizedPath = typeof path === 'string' ? path : String(path);
      const url = isAbsolute
        ? normalizedPath
        : `${this.baseUrl}${normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`}`;

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        // Try to parse JSON error response
        let errorData;
        let errorMessage;

        try {
          const errorText = await response.text();
          errorData = JSON.parse(errorText);
          // Extract the error message from the response
          errorMessage =
            errorData.error || errorData.message || `API ${response.status}: ${errorText}`;
        } catch {
          // If not JSON, use the text as-is
          errorMessage = `API ${response.status}: Request failed`;
        }

        // Log validation failures as warnings, other errors as errors
        if (response.status >= 400 && response.status < 500) {
          debugWarn('CityArtWalks.Lib.ApiClient.ApiClient', `Validation failure: ${errorMessage}`, {
            status: response.status,
            path,
            errorData,
          });
        } else {
          debugError('CityArtWalks.Lib.ApiClient.ApiClient', `Request failed: ${errorMessage}`, {
            status: response.status,
            path,
            errorData,
          });
        }

        const error = new Error(errorMessage);
        error.status = response.status;
        error.response = response;
        error.data = errorData;
        throw error;
      }

      // Handle responses with no content (like DELETE 204)
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return null;
      }

      // Check if response has JSON content
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const json = await response.json();
        return json;
      }

      // For non-JSON responses, return text
      const text = await response.text();
      return text || null;
    } catch (error) {
      // If it's already our custom error with status, preserve it
      if (error.status) {
        throw error;
      }

      debugError('CityArtWalks.Lib.ApiClient.ApiClient', 'Unexpected request error', error);
      throw error;
    }
  }

  /**
   * Helper method for GET requests with automatic authentication and ISR support.
   * Tokens are automatically retrieved from the user session.
   *
   * @method get
   * @memberof CityArtWalks.Lib.ApiClient.ApiClient
   *
   * @example
   * // Basic GET request
   * const artPieces = await client.get('/api/art-pieces');
   *
   * @example
   * // With ISR revalidation (number shorthand)
   * const data = await client.get('/api/art-pieces', 300);
   *
   * @example
   * // With ISR revalidation (object format)
   * const data = await client.get('/api/art-pieces', { revalidate: 300, tags: ['art-pieces'] });
   *
   * @param {string} path - Relative API path
   * @param {Object|number|null} [next=null] - ISR config (number for revalidate seconds or full config object)
   * @returns {Promise<any>} Parsed JSON response from the API
   * @throws {Error} Throws error if request fails
   */
  get(path, next = null) {
    // Allow next to be a number (revalidate seconds) or object { revalidate, tags, ... }
    const nextOption = typeof next === 'number' ? { revalidate: next } : next;
    return this.request(path, { method: 'GET', ...(nextOption && { next: nextOption }) });
  }

  /**
   * Helper method for POST requests with automatic content-type handling and authentication.
   * Tokens are automatically retrieved from the user session.
   *
   * @method post
   * @memberof CityArtWalks.Lib.ApiClient.ApiClient
   *
   * @example
   * // POST with JSON data
   * const newArtPiece = await client.post('/api/art-pieces', {
   *   title: 'Street Art Mural',
   *   description: 'Beautiful street art',
   *   artistId: 123
   * });
   *
   * @example
   * // POST with FormData (file upload)
   * const formData = new FormData();
   * formData.append('file', file);
   * formData.append('title', 'Uploaded Image');
   * const result = await client.post('/api/images/upload', formData);
   *
   * @param {string} path - Relative API path
   * @param {Object|FormData|string} body - Request body (auto-detected and processed)
   * @returns {Promise<any>} Parsed JSON response from the API
   * @throws {Error} Throws error if request fails
   */
  post(path, body) {
    return this.request(path, { method: 'POST', body });
  }

  /**
   * Helper method for PUT requests with automatic content-type handling and authentication.
   * Tokens are automatically retrieved from the user session.
   *
   * @method put
   * @memberof CityArtWalks.Lib.ApiClient.ApiClient
   *
   * @example
   * // PUT with JSON data (partial update)
   * const updatedArtPiece = await client.put('/api/art-pieces/123', {
   *   title: 'Updated Title',
   *   description: 'New description'
   * });
   *
   * @example
   * // PUT with FormData (update with file)
   * const formData = new FormData();
   * formData.append('title', 'Updated Title');
   * formData.append('newImage', imageFile);
   * const result = await client.put('/api/art-pieces/123', formData);
   *
   * @param {string} path - Relative API path
   * @param {Object|FormData|string} body - Request body (auto-detected and processed)
   * @returns {Promise<any>} Parsed JSON response from the API
   * @throws {Error} Throws error if request fails
   */
  put(path, body) {
    return this.request(path, { method: 'PUT', body });
  }

  /**
   * Helper method for PATCH requests with automatic content-type handling and authentication.
   * Tokens are automatically retrieved from the user session.
   *
   * @method patch
   * @memberof CityArtWalks.Lib.ApiClient.ApiClient
   *
   * @example
   * // PATCH with JSON data (partial update)
   * const updatedArtPiece = await client.patch('/api/art-pieces/123', {
   *   title: 'Updated Title'
   * });
   *
   * @param {string} path - Relative API path
   * @param {Object|FormData|string} body - Request body (auto-detected and processed)
   * @returns {Promise<any>} Parsed JSON response from the API
   * @throws {Error} Throws error if request fails
   */
  patch(path, body) {
    return this.request(path, { method: 'PATCH', body });
  }

  /**
   * Helper method for DELETE requests with automatic authentication and proper response handling.
   * Tokens are automatically retrieved from the user session.
   *
   * @method delete
   * @memberof CityArtWalks.Lib.ApiClient.ApiClient
   *
   * @example
   * // Basic DELETE request
   * await client.delete('/api/art-pieces/123');
   *
   * @example
   * // DELETE with response data (soft delete)
   * const deletedRecord = await client.delete('/api/users/456');
   * console.log('Deleted user:', deletedRecord);
   *
   * @param {string} path - Relative API path
   * @returns {Promise<any>} Parsed JSON response from the API (null for 204 responses)
   * @throws {Error} Throws error if request fails
   */
  delete(path) {
    return this.request(path, { method: 'DELETE' });
  }
}

// Backward compatibility - export functions that create a default instance
/**
 * @deprecated Use ApiClient class instead. This function will be removed in v3.0.0
 */
export async function apiRequestCompat(path, options = {}, token = '') {
  const client = new ApiClient();
  return client.request(path, options);
}

/**
 * @deprecated Use ApiClient class instead. This function will be removed in v3.0.0
 */
export function apiGetCompat(path, token = '', next = null) {
  const client = new ApiClient();
  return client.get(path, next);
}

/**
 * @deprecated Use ApiClient class instead. This function will be removed in v3.0.0
 */
export function apiPostCompat(path, body, token = '') {
  const client = new ApiClient();
  return client.post(path, body);
}

/**
 * @deprecated Use ApiClient class instead. This function will be removed in v3.0.0
 */
export function apiPutCompat(path, body, token = '') {
  const client = new ApiClient();
  return client.put(path, body);
}

/**
 * @deprecated Use ApiClient class instead. This function will be removed in v3.0.0
 */
export function apiDeleteCompat(path, token = '') {
  const client = new ApiClient();
  return client.delete(path);
}

// Export default instance for convenience
export default ApiClient;
