/**
 * @file requests.js
 * @description CityApiClient class for City CRUD operations
 * @namespace CityArtWalks.Actions.City.Requests
 * @version 3.0.0
 * @author Jaimie Garner
 */

import { ApiClient } from '@/lib/api-client';

import { endpoints } from 'src/endpoints';
import { parseInteger, sanitizeText, sanitizeBoolean } from 'src/lib/sanitize';
import { cityQuerySchema, createCitySchema, updateCitySchema } from 'src/validators/city';

// ==========================================
// CITY API CLIENT
// ==========================================

/**
 * CityApiClient class for handling City API operations.
 * Extends ApiClient to provide city-specific HTTP methods.
 * Handles automatic token management through session.
 *
 * @class CityApiClient
 * @extends ApiClient
 * @memberof CityArtWalks.Actions.City.Requests
 */
export class CityApiClient extends ApiClient {
  constructor() {
    super();
  }

  /**
   * Retrieves all active cities from the database.
   * Fetches only published/active cities, typically used for dropdowns and forms.
   *
   * @async
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} API response containing active cities array
   * @throws {Error} If the request fails or endpoint is not configured
   */
  async getActiveCities(revalidate) {
    if (!endpoints.city?.active?.path) {
      throw new Error('Active cities endpoint configuration missing');
    }

    const path = endpoints.city.active.path;
    return this.get(path, { revalidate });
  }

/**
 * Retrieves a paginated list of cities with optional filtering and search capabilities.
 * Supports comprehensive filtering, validation, and sanitization of query parameters.
 *
 * Features:
 * - Paginated results with configurable page size
 * - Multiple filter options (search, active status, location hierarchy)
 * - Zod schema validation for query parameters
 * - Input sanitization for security
 * - Comprehensive error handling with validation passthrough
 * - ISR revalidation support
 *
 * @async
 * @function getPaginatedCities
 * @memberof CityArtWalks.Actions.City.Requests
 *
 * @example
 * // Basic pagination
 * const response = await getPaginatedCities(1, 20);
 *
 * @example
 * // With comprehensive filtering
 * const response = await getPaginatedCities(
 *   1,
 *   10,
  /**
   * Retrieves a paginated list of cities with optional filtering and search capabilities.
   *
   * @async
   * @param {Object} params - Parameter object
   * @param {number} [params.page=1] - Page number (1-based)
   * @param {number} [params.limit=10] - Results per page
   * @param {string} [params.search=''] - Search term for city names
   * @param {boolean} [params.active] - Filter by active status
   * @param {number} [params.stateId] - Filter by state ID
   * @param {number} [params.countryId] - Filter by country ID
   * @param {string} [params.slug] - Filter by slug
   * @param {number} [revalidate] - Optional ISR revalidate time
   * @returns {Promise<Object>} API response with paginated cities and metadata
   * @throws {Error} When validation fails or API request fails
   */
  async getPaginatedCities(
    { page = 1, limit = 10, search = '', active, stateId, countryId, slug, createdBy, updatedBy } = {},
    revalidate
  ) {
    if (!endpoints.city?.list?.path) {
      throw new Error('City list endpoint configuration missing');
    }

    // Validate query parameters
    const validationResult = cityQuerySchema.safeParse({
      page: page.toString(),
      limit: limit.toString(),
      search,
      active,
      stateId,
      countryId,
      slug,
      createdBy,
      updatedBy,
    });

    if (!validationResult.success) {
      throw validationResult.error;
    }

    const validatedParams = validationResult.data;

    // Sanitize parameters
    const sanitizedPage = parseInteger(validatedParams.page) || 1;
    const sanitizedLimit = parseInteger(validatedParams.limit) || 10;

    const params = new URLSearchParams({
      page: sanitizedPage.toString(),
      limit: sanitizedLimit.toString(),
    });

    // Add filters conditionally
    if (validatedParams.search) {
      params.append('search', encodeURIComponent(sanitizeText(validatedParams.search)));
    }
    if (validatedParams.active !== undefined) {
      params.append('active', sanitizeBoolean(validatedParams.active).toString());
    }
    if (validatedParams.slug) {
      params.append('slug', sanitizeText(validatedParams.slug));
    }
    if (validatedParams.stateId) {
      params.append('stateId', parseInteger(validatedParams.stateId).toString());
    }
    if (validatedParams.countryId) {
      params.append('countryId', parseInteger(validatedParams.countryId).toString());
    }
    if (validatedParams.createdBy) {
      params.append('createdBy', parseInteger(validatedParams.createdBy).toString());
    }
    if (validatedParams.updatedBy) {
      params.append('updatedBy', parseInteger(validatedParams.updatedBy).toString());
    }

    const path = `${endpoints.city.list.path}?${params.toString()}`;
    return this.get(path, { revalidate });
  }

/**
 * Retrieves a single city by its ID with comprehensive error handling and validation.
 * Provides consistent interface for accessing city data with optional authentication.
 *
 * Features:
 * - ID validation and type checking
 * - Authentication token support
 * - Structured error responses
 * - ISR revalidation support
 * - Consistent API response format
 *
 * @async
 * @function getCityById
 * @memberof CityArtWalks.Actions.City.Requests
 *
 * @example
  /**
   * Retrieves a single city by its ID.
   *
   * @async
   * @param {number|string} id - City ID
   * @param {number} [revalidate] - Optional ISR revalidate time
   * @returns {Promise<Object>} City object with all related data
   * @throws {Error} When city is not found or invalid ID provided
   */
  async getCity(id, revalidate) {
    if (!id) {
      throw new Error('City ID is required');
    }

    if (!endpoints.city?.details?.path) {
      throw new Error('City details endpoint configuration missing');
    }

    const sanitizedId = parseInteger(id);
    if (!sanitizedId) {
      throw new Error('Invalid city ID provided');
    }

    const path = endpoints.city.details.path(sanitizedId);
    return this.get(path, { revalidate });
  }

/**
 * Retrieves a city by its canonical location path with hierarchical slug matching.
 * Provides structured location-based city lookup for SEO-friendly routing.
 *
 * Features:
 * - Hierarchical location path matching (country/state/city)
 * - URL slug validation and sanitization
 * - Comprehensive error handling
 * - ISR revalidation support
 * - Optimized for location-based navigation
 *
 * @async
 * @function getCityByLocation
  /**
   * Retrieves a city by its canonical location path.
   * Provides hierarchical slug matching (country/state/city).
   *
   * @async
   * @param {string} countrySlug - Country slug identifier
   * @param {string} stateSlug - State slug identifier
   * @param {string} citySlug - City slug identifier
   * @param {number} [revalidate] - Optional ISR revalidate time
   * @returns {Promise<Object>} The city object from the server
   * @throws {Error} If the request fails or required slugs are missing
   */
  async getCityByLocation(countrySlug, stateSlug, citySlug, revalidate) {
    if (!countrySlug || !stateSlug || !citySlug) {
      throw new Error('Country, state, and city slugs are required');
    }

    if (!endpoints.location?.city?.path) {
      throw new Error('Location city endpoint configuration missing');
    }

    const sanitizedCountrySlug = sanitizeText(countrySlug);
    const sanitizedStateSlug = sanitizeText(stateSlug);
    const sanitizedCitySlug = sanitizeText(citySlug);

    const path = endpoints.location.city.path(
      sanitizedCountrySlug,
      sanitizedStateSlug,
      sanitizedCitySlug
    );
    return this.get(path, { revalidate });
  }

/**
 * Creates a new city record with comprehensive validation and error handling.
 * Supports both structured object data and FormData for file uploads.
 *
 * Features:
 * - Zod schema validation for object data
 * - FormData support for file uploads
  /**
   * Creates a new city record.
   * Supports both structured object data and FormData for file uploads.
   *
   * @async
   * @param {Object|FormData} data - City data for creation
   * @returns {Promise<Object>} The created city object from the server
   * @throws {Error} When validation fails or API request fails
   */
  async createCity(data) {
    if (!data) {
      throw new Error('City data is required');
    }

    if (!endpoints.city?.create?.path) {
      throw new Error('City create endpoint configuration missing');
    }

    const isFormData = data instanceof FormData;

    if (!isFormData) {
      // Validate input data using create schema
      const validationResult = createCitySchema.safeParse(data);
      if (!validationResult.success) {
        throw validationResult.error;
      }
    }

    const path = endpoints.city.create.path;

    if (isFormData) {
      return this.post(path, { body: data });
    }

    return this.post(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

/**
 * Updates an existing city record with comprehensive validation and error handling.
 * Supports both partial updates with object data and file uploads with FormData.
 *
 * Features:
 * - Zod schema validation for object data
 * - FormData support for file uploads
 * - Partial update capability
 * - ID validation and sanitization
 * - Comprehensive error handling with validation passthrough
 * - Bearer token authentication support
 * - ISR revalidation support
 *
 * @async
 * @function updateCity
  /**
   * Updates an existing city record.
   * Supports both partial updates with object data and file uploads with FormData.
   *
   * @async
   * @param {string|number} id - City ID to update
   * @param {Object|FormData} data - City data for update
   * @returns {Promise<Object>} The updated city object from the server
   * @throws {Error} When validation fails or API request fails
   */
  async updateCity(id, data) {
    if (!id || !data) {
      throw new Error('City ID and data are required for update');
    }

    if (!endpoints.city?.update?.path) {
      throw new Error('City update endpoint configuration missing');
    }

    const sanitizedId = parseInteger(id);
    if (!sanitizedId) {
      throw new Error('Invalid city ID provided');
    }

    const isFormData = data instanceof FormData;

    if (!isFormData) {
      // Validate input data using update schema
      const validationResult = updateCitySchema.safeParse(data);
      if (!validationResult.success) {
        throw validationResult.error;
      }
    }

    const path = endpoints.city.update.path(sanitizedId);

    if (isFormData) {
      return this.put(path, { body: data });
    }

    return this.put(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

/**
 * Deletes a city record with comprehensive validation and error handling.
 * Provides secure deletion with ID validation and authentication support.
 *
  /**
   * Deletes a city record.
   *
   * @async
   * @param {string|number} id - City ID to delete
   * @returns {Promise<Object>} The response from the server
   * @throws {Error} If the request fails or city ID is invalid
   */
  async deleteCity(id) {
    if (!id) {
      throw new Error('City ID is required for deletion');
    }

    if (!endpoints.city?.delete?.path) {
      throw new Error('City delete endpoint configuration missing');
    }

    const sanitizedId = parseInteger(id);
    if (!sanitizedId) {
      throw new Error('Invalid city ID provided');
    }

    const path = endpoints.city.delete.path(sanitizedId);
    return this.delete(path);
  }
}
