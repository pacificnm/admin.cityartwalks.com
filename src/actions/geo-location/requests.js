/**
 * @file requests.js
 * @description GeoLocationApiClient class for GeoLocation operations.
 * @author Jaimie Garner
 * @version 3.0.0
 * @namespace CityArtWalks.Actions.GeoLocation.Requests
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Requests} - Requests module documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/GeoLocation} - GeoLocation entity documentation
 */

import { ApiClient } from '@/lib/api-client';

import { endpoints } from 'src/endpoints';

/**
 * GeoLocationApiClient class for handling GeoLocation API operations.
 * Extends ApiClient to provide geolocation-specific HTTP methods.
 * Handles automatic token management through session.
 * 
 * @class GeoLocationApiClient
 * @extends ApiClient
 * @memberof CityArtWalks.Actions.GeoLocation.Requests
 */
export class GeoLocationApiClient extends ApiClient {
  constructor() {
    super();
  }

  /**
   * Fetch user location based on IP address.
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} IP-based location data
   */
  async getGeoIPLocation(revalidate) {
    const url = endpoints.geoip.location;
    return this.get(url, { revalidate });
  }

  /**
   * Fetch city by hierarchical slugs.
   * @param {string} countrySlug - Country slug
   * @param {string} stateSlug - State slug
   * @param {string} citySlug - City slug
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} City data
   */
  async getCityBySlugs(countrySlug, stateSlug, citySlug, revalidate) {
    const url = endpoints.location.city.path(countrySlug, stateSlug, citySlug);
    return this.get(url, { revalidate });
  }

  /**
   * Fetch city by names with automatic slug transformation.
   * @param {string} country - Country name
   * @param {string} region - State/region name
   * @param {string} city - City name
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} City data
   */
  async getCityByNames(country, region, city, revalidate) {
    const countrySlug = this.constructor.nameToSlug(country);
    const stateSlug = this.constructor.nameToSlug(region);
    const citySlug = this.constructor.nameToSlug(city);
    return this.getCityBySlugs(countrySlug, stateSlug, citySlug, revalidate);
  }

  /**
   * Validate location preference hierarchy.
   * @param {Object} preferences - User location preferences
   * @returns {boolean} True if valid
   * @throws {Error} If hierarchy is invalid
   */
  static validateLocationPreferences(preferences) {
    const { DefaultCountry, DefaultState, DefaultCity } = preferences;

    if (DefaultState && DefaultCountry && DefaultState.countryId !== DefaultCountry.countryId) {
      throw new Error('State does not belong to selected country');
    }

    if (DefaultCity && DefaultState && DefaultCity.stateId !== DefaultState.stateId) {
      throw new Error('City does not belong to selected state');
    }

    return true;
  }

  /**
   * Enrich user location preferences with coordinates.
   * @param {Object} preferences - User location preferences
   * @returns {Object} Enriched location data
   */
  static enrichLocationPreferences(preferences) {
    this.validateLocationPreferences(preferences);

    const { DefaultCountry, DefaultState, DefaultCity } = preferences;
    const location = DefaultCity || DefaultState || DefaultCountry;

    return {
      source: 'preferences',
      country: DefaultCountry?.name || 'United States',
      countryId: DefaultCountry?.countryId || 186,
      countrySlug: DefaultCountry?.slug || 'united-states',
      countryCode: DefaultCountry?.code || 'US',
      region: DefaultState?.abbreviation || 'OR',
      regionName: DefaultState?.name || 'Oregon',
      stateId: DefaultState?.stateId || 37,
      state: DefaultState?.name || 'Oregon',
      stateSlug: DefaultState?.slug || 'oregon',
      city: DefaultCity?.name || 'Portland',
      cityId: DefaultCity?.cityId || 132,
      citySlug: DefaultCity?.slug || 'portland',
      zip: null,
      lon: location?.longitude || -122.6929,
      lat: location?.latitude || 45.5073,
      timezone: 'America/Los_Angeles',
      status: 'success',
    };
  }

  /**
   * Convert name to slug format.
   * @param {string} name - Name to convert
   * @returns {string} Slug format
   */
  static nameToSlug(name) {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }
}
