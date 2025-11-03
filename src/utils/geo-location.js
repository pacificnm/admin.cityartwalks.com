import { debugWarn, debugError } from 'src/lib/debug';
import { getGeoIPLocation as requestGeoIPLocation } from 'src/actions/geo-location/requests.js';

/**
 * Fetch GeoIP location using the Actions Requests layer.
 * Falls back to Portland, OR if the external service fails.
 *
 * @memberof CityArtWalks.Utils.GeoLocation
 * @function getGeoIPLocation
 * @returns {Promise<Object>} GeoIP data
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Geo-Location-Util}
 */
export async function getGeoIPLocation() {
  // Default location fallback (Portland, OR)
  const defaultLocation = {
    as: 'Failed TO fetch GeoIP data',
    city: 'Portland',
    country: 'United States',
    countryCode: 'US',
    isp: 'Failed TO fetch GeoIP data',
    lat: 45.5073,
    lon: -122.6929,
    org: 'Failed TO fetch GeoIP data',
    query: '0.0.0.0',
    region: 'OR',
    regionName: 'Oregon',
    status: 'success',
    timezone: 'America/Los_Angeles',
    zip: '97201',
  };

  try {
    const data = await requestGeoIPLocation('', 600);
    if (data && data.status === 'success') {
      return data;
    }
    debugError('GeoIP: API returned non-success status, using default location?:', data);
    return defaultLocation;
  } catch (error) {
    debugError('GeoIP: Error fetching GeoIP location, using default location?:', error);
    return defaultLocation;
  }
}

export function getUserLocation(successCallback) {
  if (!navigator.geolocation) {
    debugWarn('GeoIP: Geolocation is not supported by this browser.');
    alert('Geolocation is not supported by your browser.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    successCallback,
    (error) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          debugWarn('GeoIP: User denied the request for Geolocation.');
          alert('GeoIP: User denied the request for Geolocation.');
          break;
        case error.POSITION_UNAVAILABLE:
          debugWarn('GeoIP: Location information is unavailable.');
          alert('GeoIP: Location information is unavailable.');
          break;
        case error.TIMEOUT:
          debugWarn('GeoIP: The request to get user location timed out.');
          alert('GeoIP: The request to get user location timed out.');
          break;
        default:
          debugWarn('GeoIP: An unknown error occurred while getting user location.');
          alert('GeoIP: An unknown error occurred.');
          break;
      }
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}

/**
 * Reads GeoIP location from localStorage cache.
 * NOTE: Kept for backward compatibility (e.g., analytics). Prefer Hooks + IndexedDB.
 * @returns {Object|null} GeoIP location object or null if not found.
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Geo-Location-Util} - Complete documentation
 */
export async function getGeoIPFromCache() {
  if (typeof window === 'undefined') return null;

  const cached = localStorage.getItem('geo_ip_data');

  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      localStorage.removeItem('geo_ip_data');
    }
  }

  // If not cached, fetch and cache using Requests layer
  try {
    const data = await getGeoIPLocation();

    if (data && data.status === 'success') {
      localStorage.setItem('geo_ip_data', JSON.stringify(data));
      return data;
    }
  } catch (error) {
    debugError('GeoIP: Failed to fetch GeoIP data?:', error);
  }

  return null;
}
