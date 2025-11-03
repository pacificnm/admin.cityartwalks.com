/**
 * @file requests.js
 * @description StripeApiClient class for Stripe payment operations.
 * @author Jaimie Garner
 * @version 3.0.0
 * @namespace CityArtWalks.Actions.Stripe.Requests
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */

import { ApiClient } from '@/lib/api-client';

import { endpoints } from 'src/endpoints';

/**
 * StripeApiClient class for handling Stripe payment API operations.
 * Extends ApiClient to provide Stripe-specific HTTP methods.
 * Handles automatic token management through session.
 * 
 * @class StripeApiClient
 * @extends ApiClient
 * @memberof CityArtWalks.Actions.Stripe.Requests
 */
export class StripeApiClient extends ApiClient {
  constructor() {
    super();
  }

  /**
   * Create a Stripe Checkout session and redirect to the checkout URL.
   * @returns {Promise<void>} Redirects to Stripe checkout URL on success
   * @throws {Error} When checkout session creation fails or URL is not received
   */
  async subscribeUser() {
    const path = endpoints.stripe.checkout.path;
    const response = await this.post(path, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (response?.data?.url) {
      window.location.href = response.data.url;
    } else {
      throw new Error('Stripe session URL not received.');
    }
  }

  /**
   * Fetch user invoices from Stripe API with pagination support.
   * @param {Object} filters - Filter parameters
   * @param {number} [filters.limit] - Maximum number of invoices to return
   * @param {string} [filters.starting_after] - Invoice ID to start pagination from
   * @returns {Promise<Object>} Response containing invoices data
   */
  async getStripeInvoices(filters = {}) {
    const path = endpoints.stripe.invoices.path;

    const params = new URLSearchParams();
    if (filters.limit) {
      params.append('limit', filters.limit.toString());
    }
    if (filters.starting_after) {
      params.append('starting_after', filters.starting_after);
    }

    const fullPath = params.toString() ? `${path}?${params.toString()}` : path;
    const response = await this.get(fullPath);

    return response?.data || { invoices: [], hasMore: false, total: 0 };
  }
}
