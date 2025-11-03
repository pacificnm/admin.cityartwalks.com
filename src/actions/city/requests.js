/**
 * @file requests.js
 * @description Direct API request functions for City operations with comprehensive CRUD support, validation, and error handling
 * @namespace CityArtWalks.Actions.City.Requests
 * @version 2.2.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Requests} - Requests patterns documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks error handling patterns
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Client} - API Client documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/City-Model} - City model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#City} - Database schema reference
 */

import { endpoints } from 'src/endpoints';
import { debugLog, debugError } from 'src/lib/debug';
import { apiGet, apiPut, apiPost, apiDelete } from '@/lib/api-client';
import { parseInteger, sanitizeText, sanitizeBoolean } from 'src/lib/sanitize';
import { cityQuerySchema, createCitySchema, updateCitySchema } from 'src/validators/city';

// ==========================================
// CORE CRUD OPERATIONS
// ==========================================

/**
 * Retrieves all active cities from the database.
 * Custom function for fetching only published/active cities, typically used for dropdowns and forms.
 * Note: This is a specialized endpoint, not part of standard CRUD operations.
 *
 * Features:
 * - Fetches only active/published cities
 * - Endpoint configuration validation
 * - ISR revalidation support
 * - Comprehensive error handling and logging
 *
 * @async
 * @function getActiveCities
 * @memberof CityArtWalks.Actions.City.Requests
 *
 * @example
 * // Get active cities for dropdown
 * const response = await getActiveCities(accessToken);
 *
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @param {number} [revalidate] - Optional ISR revalidate time in seconds
 * @returns {Promise<Object>} API response containing active cities array
 * @throws {Error} If the request fails or endpoint is not configured
 */
export const getActiveCities = async (token = '', revalidate) => {
  try {
    // Validate endpoints configuration exists
    if (!endpoints.city?.active?.path) {
      throw new Error('Active cities endpoint configuration missing');
    }

    debugLog('CityArtWalks.Actions.City.Requests.getActiveCities', 'Fetching active cities list');

    const url = endpoints.city.active.path;
    const next = revalidate ? { revalidate } : undefined;

    return apiGet(url, token, next);
  } catch (err) {
    debugError('CityArtWalks.Actions.City.Requests.getActiveCities', err);
    throw new Error('Failed to fetch active cities');
  }
};

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
 *   {
 *     search: 'San Francisco',
 *     active: true,
 *     stateId: 5,
 *     countryId: 1
 *   },
 *   accessToken
 * );
 *
 * @param {number} [page=1] - The page number (1-based)
 * @param {number} [rowsPerPage=10] - Number of records per page
 * @param {Object} [filters={}] - Filter parameters object
 * @param {string} [filters.search] - Search term for city names
 * @param {boolean} [filters.active] - Filter by active status
 * @param {number} [filters.stateId] - Filter by state ID
 * @param {number} [filters.countryId] - Filter by country ID
 * @param {string} [filters.slug] - Filter by slug
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @param {number} [revalidate] - Optional ISR revalidate time in seconds
 * @returns {Promise<Object>} API response containing paginated cities and metadata
 * @throws {ZodError} When validation fails - passed through for hooks to display
 * @throws {Error} When API request fails
 */
export const getPaginatedCities = async (
  page = 1,
  rowsPerPage = 10,
  filters = {},
  token = '',
  revalidate
) => {
  try {
    // Validate endpoints configuration exists
    if (!endpoints.city?.list?.path) {
      throw new Error('City list endpoint configuration missing');
    }

    // Validate query parameters using schema
    const validationResult = cityQuerySchema.safeParse({
      page: page.toString(),
      limit: rowsPerPage.toString(), // API expects 'limit' but we use 'rowsPerPage' for consistency
      ...filters,
    });

    if (!validationResult.success) {
      debugError(
        'CityArtWalks.Actions.City.Requests.getPaginatedCities',
        new Error('Query validation failed: ' + JSON.stringify(validationResult.error.issues))
      );
      throw validationResult.error; // Pass through for hooks to handle
    }

    const validatedParams = validationResult.data;

    // Sanitize and destructure validated parameters
    const sanitizedPage = parseInteger(validatedParams.page) || 1;
    const sanitizedLimit = parseInteger(validatedParams.limit) || 10;

    debugLog(
      'CityArtWalks.Actions.City.Requests.getPaginatedCities',
      `Fetching page ${sanitizedPage} with ${sanitizedLimit} cities`
    );

    // Sanitize filter parameters
    const {
      search = '',
      active,
      slug = '',
      stateId,
      countryId,
      createdBy,
      updatedBy,
    } = validatedParams;

    const sanitizedFilters = {
      search: sanitizeText(search),
      active: active !== undefined ? sanitizeBoolean(active) : undefined,
      slug: sanitizeText(slug),
      stateId: stateId ? parseInteger(stateId) : undefined,
      countryId: countryId ? parseInteger(countryId) : undefined,
      createdBy: createdBy ? parseInteger(createdBy) : undefined,
      updatedBy: updatedBy ? parseInteger(updatedBy) : undefined,
    };

    // Build query parameters
    const params = new URLSearchParams({
      page: sanitizedPage.toString(),
      limit: sanitizedLimit.toString(),
    });

    // Add filters only if they have meaningful values
    Object.entries(sanitizedFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        params.append(key, value.toString());
      }
    });

    const url = `${endpoints.city.list.path}?${params.toString()}`;
    const next = revalidate ? { revalidate } : undefined;

    return apiGet(url, token, next);
  } catch (err) {
    if (err.name === 'ZodError') {
      throw err; // Pass through validation errors to hooks
    }
    debugError('CityArtWalks.Actions.City.Requests.getPaginatedCities', err);
    throw new Error('Failed to fetch paginated cities');
  }
};

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
 * // Basic city retrieval
 * const city = await getCityById(123);
 *
 * @example
 * // With authentication
 * const city = await getCityById(123, accessToken);
 *
 * @param {number|string} id - The unique identifier of the city
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @param {number} [revalidate] - Optional ISR revalidate time in seconds
 * @returns {Promise<Object>} City object with all related data
 * @throws {Error} When city is not found or invalid ID provided
 * @throws {Error} When API request fails
 */
export const getCityById = async (id, token = '', revalidate) => {
  try {
    if (!id) {
      throw new Error('City ID is required');
    }

    // Validate endpoints configuration exists
    if (!endpoints.city?.details?.path) {
      throw new Error('City details endpoint configuration missing');
    }

    const sanitizedId = parseInteger(id);
    if (!sanitizedId) {
      throw new Error('Invalid city ID provided');
    }

    debugLog(
      'CityArtWalks.Actions.City.Requests.getCityById',
      `Fetching city with ID: ${sanitizedId}`
    );

    const path = endpoints.city.details.path(sanitizedId);
    const next = revalidate ? { revalidate } : undefined;

    return apiGet(path, token, next);
  } catch (err) {
    debugError('CityArtWalks.Actions.City.Requests.getCityById', err);
    throw new Error('Failed to fetch city by ID');
  }
};

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
 * @memberof CityArtWalks.Actions.City.Requests
 *
 * @example
 * // Retrieve city by full location path
 * const city = await getCityByLocation('usa', 'california', 'san-francisco');
 *
 * @example
 * // With revalidation for ISR
 * const city = await getCityByLocation('usa', 'california', 'los-angeles', '', 3600);
 *
 * @param {string} countrySlug - The country slug identifier
 * @param {string} stateSlug - The state slug identifier
 * @param {string} citySlug - The city slug identifier
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @param {number} [revalidate] - Optional ISR revalidate time in seconds
 * @returns {Promise<Object>} The city object from the server
 * @throws {Error} If the request fails or the response is not OK
 */
export const getCityByLocation = async (
  countrySlug,
  stateSlug,
  citySlug,
  token = '',
  revalidate
) => {
  try {
    if (!countrySlug || !stateSlug || !citySlug) {
      throw new Error('Country, state, and city slugs are required');
    }

    // Validate endpoints configuration exists
    if (!endpoints.location?.city?.path) {
      throw new Error('Location city endpoint configuration missing');
    }

    const sanitizedCountrySlug = sanitizeText(countrySlug);
    const sanitizedStateSlug = sanitizeText(stateSlug);
    const sanitizedCitySlug = sanitizeText(citySlug);

    debugLog(
      'CityArtWalks.Actions.City.Requests.getCityByLocation',
      `Fetching city by location: ${sanitizedCountrySlug}/${sanitizedStateSlug}/${sanitizedCitySlug}`
    );

    const path = endpoints.location.city.path(
      sanitizedCountrySlug,
      sanitizedStateSlug,
      sanitizedCitySlug
    );
    const next = revalidate ? { revalidate } : undefined;

    return apiGet(path, token, next);
  } catch (err) {
    debugError('CityArtWalks.Actions.City.Requests.getCityByLocation', err);
    throw new Error('Failed to fetch city by location');
  }
};

/**
 * Creates a new city record with comprehensive validation and error handling.
 * Supports both structured object data and FormData for file uploads.
 *
 * Features:
 * - Zod schema validation for object data
 * - FormData support for file uploads
 * - Comprehensive error handling with validation passthrough
 * - Bearer token authentication support
 * - ISR revalidation support
 *
 * @async
 * @function createCity
 * @memberof CityArtWalks.Actions.City.Requests
 *
 * @example
 * // Create with object data
 * const newCity = await createCity({
 *   name: 'New City',
 *   slug: 'new-city',
 *   stateId: 5,
 *   active: true
 * }, accessToken);
 *
 * @example
 * // Create with FormData (for file uploads)
 * const formData = new FormData();
 * formData.append('name', 'New City');
 * formData.append('image', imageFile);
 * const newCity = await createCity(formData, accessToken);
 *
 * @param {Object|FormData} data - City data for creation
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @param {number} [revalidate] - Optional ISR revalidate time in seconds
 * @returns {Promise<Object>} The created city object from the server
 * @throws {ZodError} When validation fails - passed through for hooks to display
 * @throws {Error} If the request fails
 */
export async function createCity(data, token = '', revalidate) {
  try {
    if (!data) {
      throw new Error('City data is required');
    }

    // Validate endpoints configuration exists
    if (!endpoints.city?.create?.path) {
      throw new Error('City create endpoint configuration missing');
    }

    // Skip validation for FormData, let the API handle it
    const isFormData = data instanceof FormData;

    if (!isFormData) {
      // Validate input data using create schema
      const validationResult = createCitySchema.safeParse(data);
      if (!validationResult.success) {
        debugError(
          'CityArtWalks.Actions.City.Requests.createCity',
          new Error('Validation failed: ' + JSON.stringify(validationResult.error.issues))
        );
        throw validationResult.error; // Pass through for hooks to display
      }

      debugLog(
        'CityArtWalks.Actions.City.Requests.createCity',
        `Creating city: ${data.name || 'Unknown'}`
      );
    } else {
      debugLog('CityArtWalks.Actions.City.Requests.createCity', 'Creating city with FormData');
    }

    const path = endpoints.city.create.path;
    const next = revalidate ? { revalidate } : undefined;

    return apiPost(
      path,
      {
        body: isFormData ? data : JSON.stringify(data),
        headers: isFormData
          ? {} // Browser handles the correct multipart boundaries
          : { 'Content-Type': 'application/json' },
      },
      token,
      next
    );
  } catch (err) {
    if (err.name === 'ZodError') {
      throw err; // Pass through validation errors to hooks
    }
    debugError('CityArtWalks.Actions.City.Requests.createCity', err);
    throw new Error('Failed to create city');
  }
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
 * @memberof CityArtWalks.Actions.City.Requests
 *
 * @example
 * // Partial update with object data
 * const updatedCity = await updateCity(123, {
 *   name: 'Updated City Name',
 *   active: false
 * }, accessToken);
 *
 * @example
 * // Update with FormData (for file uploads)
 * const formData = new FormData();
 * formData.append('name', 'Updated City');
 * formData.append('image', newImageFile);
 * const updatedCity = await updateCity(123, formData, accessToken);
 *
 * @param {string|number} cityId - The unique identifier of the city to update
 * @param {Object|FormData} data - City data for update
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @param {number} [revalidate] - Optional ISR revalidate time in seconds
 * @returns {Promise<Object>} The updated city object from the server
 * @throws {ZodError} When validation fails - passed through for hooks to display
 * @throws {Error} If the request fails
 */
export async function updateCity(cityId, data, token = '', revalidate) {
  try {
    if (!cityId || !data) {
      throw new Error('City ID and data are required for update');
    }

    // Validate endpoints configuration exists
    if (!endpoints.city?.update?.path) {
      throw new Error('City update endpoint configuration missing');
    }

    const sanitizedId = parseInteger(cityId);
    if (!sanitizedId) {
      throw new Error('Invalid city ID provided');
    }

    // Skip validation for FormData, let the API handle it
    const isFormData = data instanceof FormData;

    if (!isFormData) {
      // Validate input data using update schema
      const validationResult = updateCitySchema.safeParse(data);
      if (!validationResult.success) {
        debugError(
          'CityArtWalks.Actions.City.Requests.updateCity',
          new Error('Validation failed: ' + JSON.stringify(validationResult.error.issues))
        );
        throw validationResult.error; // Pass through for hooks to display
      }

      debugLog(
        'CityArtWalks.Actions.City.Requests.updateCity',
        `Updating city ID: ${sanitizedId} with data: ${data.name || 'Partial Update'}`
      );
    } else {
      debugLog(
        'CityArtWalks.Actions.City.Requests.updateCity',
        `Updating city ID: ${sanitizedId} with FormData`
      );
    }

    const path = endpoints.city.update.path(sanitizedId);
    const next = revalidate ? { revalidate } : undefined;

    return apiPut(
      path,
      {
        body: isFormData ? data : JSON.stringify(data),
        headers: isFormData
          ? {} // Browser handles the correct multipart boundaries
          : { 'Content-Type': 'application/json' },
      },
      token,
      next
    );
  } catch (err) {
    if (err.name === 'ZodError') {
      throw err; // Pass through validation errors to hooks
    }
    debugError('CityArtWalks.Actions.City.Requests.updateCity', err);
    throw new Error('Failed to update city');
  }
}

/**
 * Deletes a city record with comprehensive validation and error handling.
 * Provides secure deletion with ID validation and authentication support.
 *
 * Features:
 * - ID validation and type checking
 * - Comprehensive error handling
 * - Bearer token authentication support
 * - ISR revalidation support
 * - Secure deletion operations
 *
 * @async
 * @function deleteCity
 * @memberof CityArtWalks.Actions.City.Requests
 *
 * @example
 * // Delete city by ID
 * await deleteCity(123, accessToken);
 *
 * @example
 * // Delete with revalidation
 * await deleteCity(123, accessToken, 0);
 *
 * @param {string|number} cityId - The unique identifier of the city to delete
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @param {number} [revalidate] - Optional ISR revalidate time in seconds
 * @returns {Promise<Object>} The response from the server
 * @throws {Error} If the request fails or city ID is invalid
 */
export async function deleteCity(cityId, token = '', revalidate) {
  try {
    if (!cityId) {
      throw new Error('City ID is required for deletion');
    }

    // Validate endpoints configuration exists
    if (!endpoints.city?.delete?.path) {
      throw new Error('City delete endpoint configuration missing');
    }

    const sanitizedId = parseInteger(cityId);
    if (!sanitizedId) {
      throw new Error('Invalid city ID provided');
    }

    debugLog(
      'CityArtWalks.Actions.City.Requests.deleteCity',
      `Deleting city with ID: ${sanitizedId}`
    );

    const path = endpoints.city.delete.path(sanitizedId);
    const next = revalidate ? { revalidate } : undefined;

    return apiDelete(path, token, next);
  } catch (err) {
    debugError('CityArtWalks.Actions.City.Requests.deleteCity', err);
    throw new Error('Failed to delete city');
  }
}
