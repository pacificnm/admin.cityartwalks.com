import useSWR, { mutate as mutateGlobal } from 'swr';

import { useAuthContext } from 'src/auth/hooks';

import * as requests from './requests.js';
import * as userPreferenceRequests from '../user-preference/requests.js';

/**
 * @file hooks.js
 * @description React hooks for Geo-Location operations using SWR
 *
 * This module provides React hooks for geolocation operations with intelligent location detection,
 * user preference integration, and fallback strategies. Includes IP-based geolocation, user
 * preference location mapping, and comprehensive caching with SWR.
 * @namespace CityArtWalks.Actions.GeoLocation.Hooks
 * @version 3.0.0
 * @author GitHub Copilot
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Requests} - Requests patterns documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/GeoLocation-Model} - GeoLocation model documentation
 */

const FALLBACK_LOCATION = {
  status: 'success',
  country: 'United States',
  countryId: 186,
  countrySlug: 'united-states',
  region: 'OR',
  regionName: 'Oregon',
  stateId: 37,
  state: 'Oregon',
  stateSlug: 'oregon',
  city: 'Portland',
  cityId: 132,
  citySlug: 'portland',
  longitude: -122.6929,
  latitude: 45.5073,
  timezone: 'America/Los_Angeles',
};

/**
 * Builds a location object from user location preferences with comprehensive data mapping.
 * Transforms user preference data into a standardized geolocation format with fallback values.
 *
 * Features:
 * - User preference data transformation
 * - Fallback location inheritance
 * - Coordinate mapping from preferences
 * - Source tracking for debugging
 * - Hierarchical location data (country/state/city)
 *
 * @function buildLocationFromPreferences
 * @memberof CityArtWalks.Actions.GeoLocation.Hooks
 *
 * @example
 * // Build location from user preferences
 * const location = buildLocationFromPreferences({
 *   DefaultCountry: { name: 'Canada', countryId: 1, slug: 'canada' },
 *   DefaultState: { name: 'Ontario', stateId: 5, slug: 'ontario' },
 *   DefaultCity: { name: 'Toronto', cityId: 123, slug: 'toronto' }
 * });
 *
 * @param {Object} userPreferences - User preference object with location data
 * @param {Object} [userPreferences.DefaultCountry] - Default country preference
 * @param {Object} [userPreferences.DefaultState] - Default state preference
 * @param {Object} [userPreferences.DefaultCity] - Default city preference
 * @returns {Object} Location object compatible with geolocation format
 */
function buildLocationFromPreferences(userPreferences) {
  const { DefaultCountry, DefaultState, DefaultCity } = userPreferences;

  // Start with fallback defaults but mark source as user_preferences
  const location = { ...FALLBACK_LOCATION, source: 'user_preferences' };

  // Populate with user preference data if available
  if (DefaultCountry) {
    location.country = DefaultCountry.name;
    location.countryId = DefaultCountry.countryId;
    location.countrySlug = DefaultCountry.slug;
    location.countryCode = DefaultCountry.code;
    location.lat = DefaultCountry.latitude || location.lat;
    location.lon = DefaultCountry.longitude || location.lon;
  }

  if (DefaultState) {
    location.region = DefaultState.abbreviation;
    location.regionName = DefaultState.name;
    location.stateId = DefaultState.stateId;
    location.state = DefaultState.name;
    location.stateSlug = DefaultState.slug;
    location.lat = DefaultState.latitude || location.lat;
    location.lon = DefaultState.longitude || location.lon;
  }

  if (DefaultCity) {
    location.city = DefaultCity.name;
    location.cityId = DefaultCity.cityId;
    location.citySlug = DefaultCity.slug;
    location.lat = DefaultCity.latitude || location.lat;
    location.lon = DefaultCity.longitude || location.lon;
  }

  return location;
}

/**
 * Normalizes IP-API response to match internal location format with comprehensive field mapping.
 * Transforms external IP geolocation data into standardized internal structure with fallback values.
 *
 * Features:
 * - IP-API response normalization
 * - Fallback location inheritance
 * - Coordinate validation and mapping
 * - Field standardization
 * - Source tracking for debugging
 *
 * @function normalizeIPAPIResponse
 * @memberof CityArtWalks.Actions.GeoLocation.Hooks
 *
 * @example
 * // Normalize IP-API response
 * const location = normalizeIPAPIResponse({
 *   country: 'United States',
 *   countryCode: 'US',
 *   region: 'CA',
 *   regionName: 'California',
 *   city: 'San Francisco',
 *   lat: 37.7749,
 *   lon: -122.4194,
 *   timezone: 'America/Los_Angeles'
 * });
 *
 * @param {Object} ipApiResponse - Raw response from IP-API service
 * @param {string} [ipApiResponse.country] - Country name
 * @param {string} [ipApiResponse.countryCode] - Country code
 * @param {string} [ipApiResponse.region] - Region/state code
 * @param {string} [ipApiResponse.regionName] - Region/state name
 * @param {string} [ipApiResponse.city] - City name
 * @param {number} [ipApiResponse.lat] - Latitude coordinate
 * @param {number} [ipApiResponse.lon] - Longitude coordinate
 * @param {string} [ipApiResponse.timezone] - Timezone identifier
 * @returns {Object} Normalized location object matching FALLBACK_LOCATION structure
 */
function normalizeIPAPIResponse(ipApiResponse) {
  // Start with fallback location to ensure all fields are present
  const normalizedLocation = { ...FALLBACK_LOCATION, source: 'ip_api' };

  // Map IP-API fields to our structure
  if (ipApiResponse) {
    // Basic location info
    if (ipApiResponse.country) normalizedLocation.country = ipApiResponse.country;
    if (ipApiResponse.countryCode) normalizedLocation.countryCode = ipApiResponse.countryCode;
    if (ipApiResponse.region) normalizedLocation.region = ipApiResponse.region;
    if (ipApiResponse.regionName) normalizedLocation.regionName = ipApiResponse.regionName;
    if (ipApiResponse.city) normalizedLocation.city = ipApiResponse.city;
    if (ipApiResponse.zip) normalizedLocation.zip = ipApiResponse.zip;
    if (ipApiResponse.timezone) normalizedLocation.timezone = ipApiResponse.timezone;

    // Coordinates
    if (typeof ipApiResponse.lat === 'number') normalizedLocation.lat = ipApiResponse.lat;
    if (typeof ipApiResponse.lon === 'number') normalizedLocation.lon = ipApiResponse.lon;

    // Status
    if (ipApiResponse.status) normalizedLocation.status = ipApiResponse.status;

    // Note: IP-API doesn't provide countryId, stateId, cityId, or slugs
    // These would need to be enriched from our database if needed
  }

  return normalizedLocation;
}

/**
 * Hook to fetch and cache the user's location with intelligent priority system and comprehensive fallback strategies.
 * Provides location detection through multiple sources with user preference integration and IP-based geolocation.
 *
 * Location Priority System:
 * 1. User location preferences (if authenticated and preferences exist)
 * 2. IP-based geolocation
 * 3. Fallback location (Portland, OR)
 *
 * Features:
 * - Multi-source location detection
 * - User preference integration
 * - IP-based geolocation with normalization
 * - Intelligent caching based on authentication status
 * - Comprehensive error handling with graceful fallbacks
 * - Source tracking for debugging and analytics
 * - SWR caching with deduplication
 *
 * @async
 * @function useGetGeoLocation
 * @memberof CityArtWalks.Actions.GeoLocation.Hooks
 *
 * @example
 * // Basic usage
 * const { location, locationLoading, locationError } = useGetGeoLocation();
 *
 * @example
 * // With authentication token
 * const { location, locationLoading, mutateLocation } = useGetGeoLocation(accessToken);
 *
 * // Check location source
 * console.log('Location source:', location.source); // 'user_preferences', 'ip_api', 'fallback', or 'loading'
 *
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Object} Location data with loading and error states
 * @returns {Object} returns.location - Location object with comprehensive geographic data
 * @returns {boolean} returns.locationLoading - Loading state
 * @returns {Error} returns.locationError - Error state
 * @returns {Function} returns.mutateLocation - SWR mutate function for cache invalidation
 */
export function useGetGeoLocation(token = '') {
  const { user, authenticated } = useAuthContext();

  // Create a simple cache key based on user authentication
  const cacheKey =
    authenticated && user?.userId ? `geo-location-user-${user.userId}` : 'geo-location-anon';

  const { data, isLoading, error, mutate } = useSWR(
    cacheKey,
    async () => {
      // 1) Try user location preferences first (if authenticated)
      if (authenticated && user?.userId && token) {
        try {
          const userPreferences = await userPreferenceRequests.getUserPreferences(
            user.userId,
            token
          );

          if (userPreferences?.status === 'success' && userPreferences?.data) {
            const preferences = userPreferences.data;

            // Check if user has location preferences set
            if (
              preferences?.defaultCountryId ||
              preferences?.defaultStateId ||
              preferences?.defaultCityId
            ) {
              return buildLocationFromPreferences(preferences);
            }
          }
        } catch {
          // Failed to get user preferences, continue to IP geolocation
        }
      }

      // 2) Fall back to IP-based geolocation
      try {
        const geo = await requests.getGeoIPLocation(token, 600);
        if (geo?.status === 'success') {
          return normalizeIPAPIResponse(geo);
        }
      } catch {
        // IP geolocation failed, use fallback
      }

      // 3) Use fallback location
      return { ...FALLBACK_LOCATION, source: 'fallback' };
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 minutes
    }
  );

  return {
    location: data || { ...FALLBACK_LOCATION, source: 'loading' },
    locationLoading: isLoading,
    locationError: error,
    mutateLocation: mutate,
  };
}

/**
 * Invalidates the geolocation cache for a specific user with comprehensive cache management.
 * Provides cache invalidation for both user-specific and anonymous geolocation data when user preferences are updated.
 *
 * Features:
 * - User-specific cache invalidation
 * - Anonymous cache invalidation
 * - Global SWR cache management
 * - Graceful error handling
 * - Revalidation triggering
 *
 * @async
 * @function invalidateUserLocationCache
 * @memberof CityArtWalks.Actions.GeoLocation.Hooks
 *
 * @example
 * // Invalidate cache after user updates location preferences
 * await invalidateUserLocationCache(123);
 *
 * @example
 * // Use in preference update flow
 * const handleLocationUpdate = async (userId, newPreferences) => {
 *   await updateUserPreferences(userId, newPreferences);
 *   await invalidateUserLocationCache(userId);
 * };
 *
 * @param {number} userId - User ID to invalidate cache for
 * @returns {Promise<void>} Promise that resolves when cache invalidation is complete
 */
export async function invalidateUserLocationCache(userId) {
  try {
    // Invalidate both user and anonymous cache
    const userKey = `geo-location-user-${userId}`;
    const anonKey = 'geo-location-anon';

    await mutateGlobal(userKey, undefined, { revalidate: true });
    await mutateGlobal(anonKey, undefined, { revalidate: true });
  } catch {
    // Failed to invalidate cache, continue silently
  }
}
export default {
  useGetGeoLocation,
  invalidateUserLocationCache,
};
